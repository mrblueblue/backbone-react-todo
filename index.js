var React = require('react');
var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
require('backbone.localstorage');

var composeModelView = require('./composeModelView');
/* React Components */
var TodoItem = composeModelView(require('./components/TodoItem'));
var Stats = require('./components/Stats');

$(function() {

// Todo Model
// ----------

// Our basic **Todo** model has `title`, `order`, and `done` attributes.
  var Todo = Backbone.Model.extend({

  // Default attributes for the todo item.
  defaults: function() {
    return {
      title: "empty todo...",
      order: Todos.nextOrder(),
      done: false
    };
  },

  // Toggle the `done` state of this todo item.
  toggle: function() {
    console.log('toggle')
    this.save({done: !this.get("done")});
  }

  });

  // Todo Collection
  // ---------------

  // The collection of todos is backed by *localStorage* instead of a remote
  // server.
  var TodoList = Backbone.Collection.extend({

  // Reference to this collection's model.
  model: Todo,

  // Save all of the todo items under the `"todos-backbone"` namespace.
  localStorage: new Backbone.LocalStorage("todos-backbone"),

  // Filter down the list of all todo items that are finished.
  done: function() {
    return this.where({done: true});
  },

  // Filter down the list to only todo items that are still not finished.
  remaining: function() {
    return this.where({done: false});
  },

  // We keep the Todos in sequential order, despite being saved by unordered
  // GUID in the database. This generates the next order number for new items.
  nextOrder: function() {
    if (!this.length) return 1;
    return this.last().get('order') + 1;
  },

  // Todos are sorted by their original insertion order.
  comparator: 'order'

  });

  // Create our global collection of **Todos**.
  var Todos = new TodoList;

  // Todo Item View
  // --------------

  // The DOM element for a todo item...
  var TodoView = Backbone.View.extend({

  //... is a list tag.
  tagName:  "li",

  // The DOM events specific to an item.
  events: {
    "click a.destroy" : "clear",
    "keypress .edit"  : "updateOnEnter",
    "blur .edit"      : "close"
  },

  // Re-render the titles of the todo item.
  render: function() {

    /* REACT RENDER BLOCK */
    React.render(
      <TodoItem
        model={this.model} 
        toggle={this.model.toggle.bind(this.model)}
        edit={this.edit.bind(this)} />,
      this.$el[0]
    );

    this.input = this.$('.edit');
    return this;
  },

  // Switch this view into `"editing"` mode, displaying the input field.
  edit: function() {
    this.$el.addClass("editing");
    this.input.focus();
  },

  // Close the `"editing"` mode, saving changes to the todo.
  close: function() {
    var value = this.input.val();
    if (!value) {
      this.clear();
    } else {
      this.model.save({title: value});
      this.$el.removeClass("editing");
    }
  },

  // If you hit `enter`, we're through editing the item.
  updateOnEnter: function(e) {
    if (e.keyCode == 13) this.close();
  },

  // Remove the item, destroy the model.
  clear: function() {
    this.model.destroy();
  }

  });

  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  var AppView = Backbone.View.extend({

  // Instead of generating a new element, bind to the existing skeleton of
  // the App already present in the HTML.
  el: $("#todoapp"),

  // Delegated events for creating new items, and clearing completed ones.
  events: {
    "keypress #new-todo":  "createOnEnter",
    "click #clear-completed": "clearCompleted",
    "click #toggle-all": "toggleAllComplete"
  },

  // At initialization we bind to the relevant events on the `Todos`
  // collection, when items are added or changed. Kick things off by
  // loading any preexisting todos that might be saved in *localStorage*.
  initialize: function() {

    this.input = this.$("#new-todo");
    this.allCheckbox = this.$("#toggle-all")[0];

    this.listenTo(Todos, 'add', this.addOne);
    this.listenTo(Todos, 'reset', this.addAll);
    this.listenTo(Todos, 'all', this.render);

    this.footer = this.$('footer');
    this.main = $('#main');

    Todos.fetch();
  },

  // Re-rendering the App just means refreshing the statistics -- the rest
  // of the app doesn't change.
  render: function() {
    var done = Todos.done().length;
    var remaining = Todos.remaining().length;

    if (Todos.length) {
      this.main.show();
      this.footer.show();

      /* REACT RENDER BLOCK */
      React.render(
        <Stats done={done} remaining={remaining} />,
        this.footer[0]
      )

    } else {
      this.main.hide();
      this.footer.hide();
    }

    this.allCheckbox.checked = !remaining;
  },

  // Add a single todo item to the list by creating a view for it, and
  // appending its element to the `<ul>`.
  addOne: function(todo) {
    var view = new TodoView({model: todo});
    this.$("#todo-list").append(view.render().el);
  },

  // Add all items in the **Todos** collection at once.
  addAll: function() {
    Todos.each(this.addOne, this);
  },

  // If you hit return in the main input field, create new **Todo** model,
  // persisting it to *localStorage*.
  createOnEnter: function(e) {

    console.log('enter')

    if (e.keyCode != 13) return;
    if (!this.input.val()) return;

    Todos.create({title: this.input.val()});
    this.input.val('');
  },

  // Clear all done todo items, destroying their models.
  clearCompleted: function() {
    _.invoke(Todos.done(), 'destroy');
    return false;
  },

  toggleAllComplete: function () {
    var done = this.allCheckbox.checked;
    Todos.each(function (todo) { todo.save({'done': done}); });
  }

  });

  // Finally, we kick things off by creating the **App**.
  var App = new AppView;

});