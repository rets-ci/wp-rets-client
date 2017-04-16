import React, {Component, PropTypes} from 'react';
import Slider from '../Components/Slider.jsx';

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
    let min;
    let max;
    let range = {};
    let step;
    let percentages;
    if (saleType === 'Sale' || saleType === 'Rent') {
      step = 500;
      min = 1000;
      max = 10000;
    }
    range = {
      min: min,
      max: max
    };
    percentages = [10, 25, 50, 75];
    percentages.forEach(p => {
      range[p + '%'] = [min + (min * (p / 100))];
    });
    return (
      <Slider range={range} start={start || defaults[saleType].start} step={step} to={to || defaults[saleType].to} handleOnClick={this.props.handleOnClick} />
    )
  }
};

export default SQFT;
