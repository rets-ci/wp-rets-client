import {Lib} from '../../../lib.jsx';
import React, {Component, PropTypes} from 'react';
import Slider from '../Components/Slider.jsx';
import Util from '../../Util.jsx';

let sliderFormatter = (min, max) => {
  return () => ({
    to: val => {
  	   let returnVal;
      if (val === min) {
        returnVal = Lib.RANGE_SLIDER_NO_MIN_TEXT;
      } else if (val === max) {
        returnVal = Lib.RANGE_SLIDER_NO_MAX_TEXT;
      } else {
        returnVal = Util.formatSQFTValue(val);
      }
      return returnVal;
    },
    from: val => val
  })
};

class SQFT extends Component {
  static propTypes = {
    saleType: PropTypes.string.isRequired,
    start: PropTypes.any,
    to: PropTypes.any,
    handleOnClick: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let {
      saleType,
      start,
      to
    } = this.props;
    let defaults = {
      Sale: {
        start: 1000,
        to: 1250
      },
      Rent: {
        start: 1000,
        to: 1250
      }
    };
    let formatter;
    let min;
    let max;
    let range = {};
    let step;
    let percentages;
    if (saleType === 'Sale' || saleType === 'Rent') {
      step = 500;
      min = 1000;
      max = 10000;
      formatter = sliderFormatter(min, max);
    }
    return (
      <Slider formatter={formatter} max={max} min={min} start={start || defaults[saleType].start} step={step} to={to || defaults[saleType].to} handleOnClick={this.props.handleOnClick} />
    )
  }
};

export default SQFT;
