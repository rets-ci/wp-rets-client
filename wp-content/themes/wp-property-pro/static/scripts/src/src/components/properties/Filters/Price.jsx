import React, {Component, PropTypes} from 'react';
import Slider from '../Components/Slider.jsx';

class Price extends Component {
  static propTypes = {
    handleOnClick: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let min = 100000;
    let max = 1000000;
    let range = {
      min: min,
      max: max
    };
    let percentages = [10, 25, 50, 75];

    percentages.forEach(p => {
    	range[p + '%'] = [min + (min * (p / 100))];
    });
    return (
      <Slider range={range} start={150000} to={400000} handleOnClick={this.props.handleOnClick} />
    )
  }
};

export default Price;
