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
        returnVal = Util.formatLotSizeValue(val);
      }
      return returnVal;
    },
    from: val => val
  })
};

class LotSize extends Component {
  static propTypes = {
    saleType: PropTypes.string,
    start: PropTypes.any,
    to: PropTypes.any,
    handleOnClick: PropTypes.func
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
      Commercial: {
        start: 1,
        to: 3
      },
      Sale: {
        start: 1,
        to: 3
      },
      Rent: {
        start: 1,
        to: 3
      }
    };
    let formatter;
    let min;
    let max;
    let step;
    if (saleType === 'Sale' || saleType === 'Rent' || saleType === 'Commercial') {
      step = 0.25;
      min = 0.25;
      max = 10;
      formatter = sliderFormatter(min, max);
    } else if (saleType === 'Land') {
      step = 10;
      min = 10;
      max = 400;
      formatter = sliderFormatter(min, max);
    }
    return (
      <Slider allowDecimalPlaces={true} formatter={formatter} max={max} min={min} start={start || defaults[saleType].start} step={step} to={to || defaults[saleType].to} handleOnClick={this.props.handleOnClick} />
    )
  }
};

export default LotSize;
