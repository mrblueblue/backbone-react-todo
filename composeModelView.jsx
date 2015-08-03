import React from 'react';

export default function composeModelView(Component){

  class BackboneModelContainer extends React.Component {

    static propTypes = {
      model: React.PropTypes.object.isRequired
    }

    componentDidMount() {
      this.getBackboneModel().on('add change remove', this.forceUpdate.bind(this, null), this);
    }
    
    componentWillUnmount() {
      this.getBackboneModel().off(null, null, this);
    }

    getBackboneModel(){
      let { model } = this.props;
      if (model) return model;
      return [];
    }
    
    render(){
      let { model, ...rest } = this.props
      return <Component {...model.attributes} {...rest}/>
    }
  }

  return BackboneModelContainer;
}
