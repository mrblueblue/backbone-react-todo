import React, { Component } from 'react';

export default class TodoItem extends Component {

  static propTypes = {
    done: React.PropTypes.bool,
    title: React.PropTypes.string
  }

  constructor(props){
    super(props);
    this.state = {input: props.title};
    this.handleChange = this.handleChange.bind(this);
  }

  render(){
    let { done, toggle, edit } = this.props;
    let { input } = this.state;
    return (
      <div className={done ? 'done' : null}>
        <div className="view" onDoubleClick={edit}>
          <input className="toggle" type="checkbox" checked={done ? "checked" : ''} onClick={toggle} />
          <label>{input}</label>
          <a className="destroy"></a>
        </div>
        <input className="edit" type="text" value={input} onChange={this.handleChange}/>
      </div>
    )
  }
  
  handleChange(e){
    let input = e.target.value;
    this.setState({input: input});
  }
}
