export default function composeBackbone(Component){

  class BackboneContainer extends React.Component {

    static propTypes = {
      collection: React.PropTypes.array
    }

    componentDidMount() {
      this.getBackboneModels().forEach((model) => {
        model.on('add change remove', this.forceUpdate.bind(this, null), this);
      }, this);
    }
    
    componentWillUnmount() {
      this.getBackboneModels().forEach((model) => {
        model.off(null, null, this);
      }, this);
    }

    getBackboneModels(){
      let { collection } = this.props;
      if (collection) return collection;
      return [];
    }
    
    render(){
      return <Component {..this.props} />
    }
  }

  return BackboneContainer;
}
