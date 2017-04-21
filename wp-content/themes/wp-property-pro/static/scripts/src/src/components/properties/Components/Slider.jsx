import {Lib} from '../../../lib.jsx';
import React, {Component, PropTypes} from 'react';

let noUiSlider = require('nouislider');
require('nouislider/distribute/nouislider.css');

class Slider extends Component {
  static propTypes = {
    formatter: PropTypes.func.isRequired,
    handleOnClick: PropTypes.func.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
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
      formatter,
      handleOnClick,
      max,
      min,
      start,
      step,
      to
    } = this.props;
    let range = {
      min,
      max
    };

    let percentages = [20, 40, 60, 80];

    let filterPips = (value, type) => {
      if (value === min || value === max) {
        return 1;
      } else {
        let ourValue = (value / max) * 100;
        return percentages.indexOf(ourValue) >= 0 ? 1 : 0;
      }
    };

    this.slider = noUiSlider.create(this.sliderElement, {
    	connect: true,
      format: formatter(),
      pips: {
      	mode: 'steps',
    		density: 5,
        filter: filterPips,
        format: formatter()
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
      let start = nextProps.start === Lib.RANGE_SLIDER_NO_MIN_TEXT ? this.props.min : nextProps.start;
      let to = nextProps.to === Lib.RANGE_SLIDER_NO_MAX_TEXT ? this.props.max : nextProps.to;
      this.sliderElement.noUiSlider.set([start, to]);
    }
  }

  render() {
    return (
      <div>
        <div className={Lib.THEME_CLASSES_PREFIX + "filter-slider"} ref={(r) => this.sliderElement = r}></div>
      </div>
    );
  }
};

export default Slider;
