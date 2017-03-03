import React, {Component, PropTypes} from 'react';
import onClickOutside from 'react-onclickoutside';

class DropDownSearch extends Component {
  static propTypes = {
    handleChange: PropTypes.func,
    handleOptionSelect: PropTypes.func,
    labels: PropTypes.array,
    open: PropTypes.bool.isRequired,
    propertyTypes: PropTypes.array.isRequired,
    saleTypes: PropTypes.array.isRequired,
    selectedOption: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  handleClickOutside(evt) {
   this.props.handleChange(false);
 }

 selectOption(eve, option, saleType, propertyTypes) {
   // consume the event argument before calling the parent callback
   eve.preventDefault();
   this.props.handleOptionSelect(option, saleType, propertyTypes);
 }

  shouldComponentUpdate() {
    if(this.props.labels.length === 1) {
      return typeof this.props.selectedOption === 'undefined';
    }

    return true;
  }

  componentDidMount(){
    if(this.props.labels.length === 1){
      this.props.handleOptionSelect(this.props.labels[0], this.props.saleTypes[0], this.props.propertyTypes[0]);
    }
  }

  render() {
    let self = this;

    if(this.props.labels.length === 1){
      return (<div></div>);
    }

    let dropSearchStyle = {};
    let primaryColor = _.get(bundle, 'colors.primary_color', null);
    if(primaryColor){
      dropSearchStyle = {
        'backgroundColor': primaryColor
      }
    }

    return (
      <div className="drop-search" style={dropSearchStyle}>
        <div id="search-options-type-container" onClick={() => self.props.handleChange(true)}>
          {this.props.selectedOption}
          <i className="fa fa-caret-down"></i>
        </div>
        <ul style={{display: this.props.open ? 'block' : 'none'}}>
          {this.props.labels.map((l, i) => {
            let instance = this;
            return (<li key={i}><a href="#" onClick={(eve) => self.selectOption.bind(this)(eve, l, instance.props.saleTypes[i], instance.props.propertyTypes[i])}>{l}</a></li>)
          }
          )}
        </ul>
      </div>
    );
  }
};

export default onClickOutside(DropDownSearch);
