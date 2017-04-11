import numeral from 'numeral';
import React, {Component, PropTypes} from 'react';

let noUiSlider = require('nouislider');
require('nouislider/distribute/nouislider.css');

let min = 100000;
let max = 1000000;

let sliderFormatter = {
  to: val => {
  	let returnVal;
    if (val === min) {
      returnVal = "No Min";
    } else if (val === max) {
      returnVal = "No Max";
    } else {
      let numeralNumber = numeral(val);
      if (val >= 100000) {
        returnVal = numeralNumber.format('0a')
      } else {
        returnVal = numeralNumber.format('0,0');
      }
    }
    return returnVal;
  },
  from: val => {
    return val;
  }
};

class Slider extends Component {
  static propTypes = {
    handleOnClick: PropTypes.func.isRequired,
    range: PropTypes.object.isRequired,
    start: PropTypes.number.isRequired,
    to: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let {
      handleOnClick,
      range,
      start,
      to
    } = this.props;
    let slider = noUiSlider.create(this.slider, {
    	connect: true,
      format: sliderFormatter,
      pips: {
      	mode: 'range',
    		density: 5,
        format: sliderFormatter
      },
      range: range,
    	start: [start, to],
      step: 10000,
      tooltips: true
    });

    slider.on('change', function(data){
      let start = data[0];
      let to = data[1];
      handleOnClick(start, to);
    });
  }

  render() {
    return (
      <div>
        <div ref={(r) => this.slider = r}></div>
      </div>
    );
  }
};

export default Slider;
