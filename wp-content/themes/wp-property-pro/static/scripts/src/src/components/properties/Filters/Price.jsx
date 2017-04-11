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

class Price extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let slider = noUiSlider.create(this.slider, {
    	connect: true,
      format: sliderFormatter,
      pips: {
      	mode: 'range',
    		density: 5,
        format: sliderFormatter
      },
      range: {
      	'min': [100000],
      	'10%': [120000],
      	'50%': [150000],
      	'max': [1000000]
      },
    	start: [150000, 400000],
      step: 10000,
      tooltips: true
    });

    slider.on('change', function(data){
      let min = data[0];
      let max = data[1];
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

export default Price;
