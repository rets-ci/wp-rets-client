import React, {Component, PropTypes} from 'react';
import {Lib} from '../../../../lib.jsx';

class MobileTabsSearch extends Component {
  static propTypes = {
    handleOptionSelect: PropTypes.func,
    labels: PropTypes.array,
    propertyTypes: PropTypes.array.isRequired,
    saleTypes: PropTypes.array.isRequired,
    selectedOption: PropTypes.string
  };

  constructor(props) {
    super(props);
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
      <div className={`${Lib.THEME_CLASSES_PREFIX}find-home-type hidden-md-up`}>
      <ul>
        {this.props.labels.map((l, i) => {
            let instance = this;
            let linkClasses = this.props.selectedOption === l ? Lib.THEME_CLASSES_PREFIX+'active' : '';
            return (<li key={i} className={linkClasses}><a href="#" onClick={(eve) => self.selectOption.bind(this)(eve, l, instance.props.saleTypes[i], instance.props.propertyTypes[i])}>{l}</a></li>)
          }
        )}
      </ul>
      </div>
    );
  }
};

export default MobileTabsSearch;