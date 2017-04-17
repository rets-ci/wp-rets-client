import {Lib} from '../../../lib.jsx';
import React, {Component, PropTypes} from 'react';
import Util from '../../Util.jsx';

let noUiSlider = require('nouislider');
require('nouislider/distribute/nouislider.css');

let min = 100000;
let max = 1000000;

let sliderFormatter = {
  to: val => {
  	let returnVal;
    if (val === min) {
      returnVal = Lib.RANGE_SLIDER_NO_MIN_TEXT;
    } else if (val === max) {
      returnVal = Lib.RANGE_SLIDER_NO_MAX_TEXT;
    } else {
      returnVal = Util.formatPriceFilter(val);
    }
    return returnVal;
  },
  from: val => val
};

class Slider extends Component {
  static propTypes = {
    handleOnClick: PropTypes.func.isRequired,
    range: PropTypes.object.isRequired,
    start: PropTypes.any,
    step: PropTypes.any,
    to: PropTypes.any
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
      step,
      to
    } = this.props;
    this.slider = noUiSlider.create(this.sliderElement, {
    	connect: true,
      format: sliderFormatter,
      pips: {
      	mode: 'range',
    		density: 5,
        format: sliderFormatter
      },
      range: range,
    	start: [start === Lib.RANGE_SLIDER_NO_MIN_TEXT ? min : start, to === Lib.RANGE_SLIDER_NO_MAX_TEXT ? max : to],
      step: step,
      tooltips: true
    });

    this.slider.on('change', function(values, handle, unencoded){
      let start = values[0] === Lib.RANGE_SLIDER_NO_MIN_TEXT ? Lib.RANGE_SLIDER_NO_MIN_TEXT : Math.round(unencoded[0]);
      let to = values[1] === Lib.RANGE_SLIDER_NO_MAX_TEXT ? Lib.RANGE_SLIDER_NO_MAX_TEXT : Math.round(unencoded[1]);
      handleOnClick(start, to);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.start !== this.props.start || nextProps.to !== this.props.to) {
      let start = nextProps.start === Lib.RANGE_SLIDER_NO_MIN_TEXT ? min : nextProps.start;
      let to = nextProps.to === Lib.RANGE_SLIDER_NO_MAX_TEXT ? max : nextProps.to;
      this.sliderElement.noUiSlider.set([start, to]);
    }
  }

  render() {
    return (
      <div>
        <div ref={(r) => this.sliderElement = r}></div>
      </div>
    );
  }
};

export default Slider;
