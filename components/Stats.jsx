import React, { Component } from 'react';

export default class Stats extends Component {
  render(){
    let { done, remaining } = this.props;
    return (
      <div>
        {done ? <a id="clear-completed">Clear {done} completed {done == 1 ? 'item' : 'items'}</a> : null}
        <div className="todo-count"><b>{remaining}</b>{remaining == 1 ? 'item' : 'items'} left</div>
      </div>
    );
  }
}
