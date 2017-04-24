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
        returnVal = Util.formatPriceValue(val);
      }
      return returnVal;
    },
    from: val => val
  })
};

class Price extends Component {
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
        start: 150000,
        to: 400000
      },
      Rent: {
        start: 500,
        to: 3000
      }
    };
    let formatter;
    let min;
    let max;
    let step;
    let percentages;
    if (saleType === 'Sale') {
      min = 25000;
      max = 1000000;
      formatter = sliderFormatter(min, max);
      step = 25000;
    } else if (saleType === 'Rent') {
      min = 125;
      max = 5000;
      formatter = sliderFormatter(min, max);
      step = 125;
    }
    return (
      <Slider formatter={formatter} max={max} min={min} start={start || defaults[saleType].start} step={step} to={to || defaults[saleType].to} handleOnClick={this.props.handleOnClick} />
    )
  }
};

export default Price;
