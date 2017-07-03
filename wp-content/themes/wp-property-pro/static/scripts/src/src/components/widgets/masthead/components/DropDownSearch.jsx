import PropTypes from 'prop-types';
import React, {Component} from 'react';
import onClickOutside from 'react-onclickoutside';
import {Lib} from '../../../../lib.jsx';

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

    return (
      <div className={Lib.THEME_CLASSES_PREFIX+"drop-search"}>
        <div className={Lib.THEME_CLASSES_PREFIX+"search-options-type-container"} onClick={() => self.props.handleChange(true)}>
          {this.props.selectedOption}
          <i className="fa fa-caret-down"></i>
        </div>
        <ul className={Lib.THEME_CLASSES_PREFIX + (this.props.open ? 'display' : 'hide')}>
          {this.props.labels.map((l, i) => {
            let instance = this;
            let linkClasses = this.props.selectedOption === l ? Lib.THEME_CLASSES_PREFIX+'active' : '';
            return (<li key={i}><a href="#" className={linkClasses} onClick={(eve) => self.selectOption.bind(this)(eve, l, instance.props.saleTypes[i], instance.props.propertyTypes[i])}>{l}</a></li>)
          }
          )}
        </ul>
      </div>
    );
  }
}

export default onClickOutside(DropDownSearch);
