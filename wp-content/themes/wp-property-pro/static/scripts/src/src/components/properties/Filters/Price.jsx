import React, {Component, PropTypes} from 'react';
import Slider from '../Components/Slider.jsx';

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
    let min;
    let max;
    let range = {};
    let percentages;
    if (saleType === 'Sale') {
      min = 100000;
      max = 1000000;
    } else if (saleType === 'Rent') {
      min = 100;
      max = 5000;
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
      <Slider range={range} start={start || defaults[saleType].start} to={to || defaults[saleType].to} handleOnClick={this.props.handleOnClick} />
    )
  }
};

export default Price;
