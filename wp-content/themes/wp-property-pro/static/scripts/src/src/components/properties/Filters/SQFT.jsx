import {Lib} from '../../../lib.jsx';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
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
      Buy: {
        start: 1000,
        to: 4000
      },
      Rent: {
        start: 1000,
        to: 4000
      }
    };
    let formatter;
    let min;
    let max;
    let step;
    if (saleType === 'Buy' || saleType === 'Rent') {
      step = 500;
      min = 500;
      max = 10000;
      formatter = sliderFormatter(min, max);
    } else if (saleType === 'Commercial') {
      step = 1000;
      min = 1000;
      max = 50000;
      formatter = sliderFormatter(min, max);
    }
    return (
      <div className={Lib.THEME_CLASSES_PREFIX + "noUislider-container"}>
        <Slider formatter={formatter} max={max} min={min} start={start || defaults[saleType].start} step={step} to={to || defaults[saleType].to} handleOnClick={this.props.handleOnClick} />
      </div>
    )
  }
};

export default SQFT;
