import React, {Component, PropTypes} from 'react';
import Slider from '../Components/Slider.jsx';

let sliderFormatter = (min, max) => {
  return () => ({
    to: val => {
  	   let returnVal;
      if (val === min) {
        returnVal = Lib.RANGE_SLIDER_NO_MIN_TEXT;
      } else if (val === max) {
        returnVal = Lib.RANGE_SLIDER_NO_MAX_TEXT;
      } else {
        returnVal = Util.formatLotSizeFilter(val);
      }
      return returnVal;
    },
    from: val => val
  })
};

class LotSize extends Component {
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
        start: 0.25,
        to: 0.35
      },
      Rent: {
        start: 0.25,
        to: 0.35
      }
    };
    let min;
    let max;
    let range = {};
    let step;
    let percentages;
    step = 0.25;
    min = 0;
    max = 1;
    formatter = sliderFormatter(min, max);
    range = {
      min: min,
      max: max
    };
    percentages = [10, 25, 50, 75];
    percentages.forEach(p => {
      range[p + '%'] = [min + (min * (p / 100))];
    });
    return (
      <Slider formatter={formatter} range={range} start={start || defaults[saleType].start} step={step} to={to || defaults[saleType].to} handleOnClick={this.props.handleOnClick} />
    )
  }
};

export default LotSize;
