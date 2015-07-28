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
    let { done } = this.props;
    let { input } = this.state;
    return (
      <div>
        <div className="view">
          <input className="toggle" type="checkbox" checked={done ? "checked" : ''} />
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
