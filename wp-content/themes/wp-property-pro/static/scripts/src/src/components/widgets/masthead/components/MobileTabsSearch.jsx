import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Lib} from '../../../../lib.jsx';

class MobileTabsSearch extends Component {
  static propTypes = {
    handleOptionSelect: PropTypes.func,
    labels: PropTypes.array,
    selectedOption: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  selectOption(eve, option) {
    // consume the event argument before calling the parent callback
    eve.preventDefault();
    this.props.handleOptionSelect(option);
  }

  shouldComponentUpdate() {
    if(this.props.labels.length === 1) {
      return typeof this.props.selectedOption === 'undefined';
    }

    return true;
  }

  componentDidMount() {
    if (this.props.labels.length === 1) {
      this.props.handleOptionSelect(this.props.labels[0]);
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
            return (<li key={i} className={linkClasses}><a href="#" onClick={(eve) => self.selectOption.bind(this)(eve, l)}>{l}</a></li>)
          }
        )}
      </ul>
      </div>
    );
  }
};

export default MobileTabsSearch;