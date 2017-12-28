import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {Lib} from '../../../lib.jsx';

let noUiSlider = require('nouislider');
require('nouislider/distribute/nouislider.css');


class Slider extends Component {
  static propTypes = {
		allowDecimalPlaces: PropTypes.bool,
    formatter: PropTypes.func,
    handleOnClick: PropTypes.func.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    start: PropTypes.any,
    step: PropTypes.any,
    to: PropTypes.any
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  createNoUiSlider(props) {
    let {
      formatter,
      handleOnClick,
      max,
      min,
      start,
      step,
      to
    } = props;

    let range = {
      min: min,
      max: max
    };

    let percentages = [20, 40, 60, 80];
    if (this.props.isMobile) {
      percentages = [50];
    }

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
      format: formatter ? formatter() : null,
      pips: {
        mode: 'steps',
        density: 5,
        filter: filterPips,
        format: formatter ? formatter() : null
      },
      range: range,
      start: [start === Lib.RANGE_SLIDER_NO_MIN_TEXT ? min : start,to === Lib.RANGE_SLIDER_NO_MAX_TEXT ? max : to],
      step: step,
      tooltips: true
    });
    this.slider.on('change', function(values, handle, unencoded) {
      let start;
      let to;
      if (values[0] === Lib.RANGE_SLIDER_NO_MIN_TEXT) {
        start = Lib.RANGE_SLIDER_NO_MIN_TEXT
      } else {
				if (this.props.allowDecimalPlaces) {
					start = unencoded[0].toFixed(2);
				} else {
					start = Math.round(unencoded[0]);
				}
      }

      if (values[1] === Lib.RANGE_SLIDER_NO_MAX_TEXT) {
        to = Lib.RANGE_SLIDER_NO_MAX_TEXT;
      } else {
				if (this.props.allowDecimalPlaces) {
					to = unencoded[1].toFixed(2);
				} else {
					to = Math.round(unencoded[1]);
				}
      }

      handleOnClick(start, to);
    }.bind(this));
  }

  componentDidMount() {
    this.createNoUiSlider(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.start !== this.props.start || nextProps.to !== this.props.to) {
      let start = nextProps.start === Lib.RANGE_SLIDER_NO_MIN_TEXT ? this.props.min : nextProps.start;
      let to = nextProps.to === Lib.RANGE_SLIDER_NO_MAX_TEXT ? this.props.max : nextProps.to;
      this.sliderElement.noUiSlider.set([start, to]);
    }

    if (nextProps.min !== this.props.min || nextProps.max !== this.props.max) {
      this.sliderElement.noUiSlider.destroy();
      this.createNoUiSlider(nextProps);
    }
  }

  render() {
    return (
      <div>
        <div className={Lib.THEME_CLASSES_PREFIX + "filter-slider"} ref={(r) => this.sliderElement = r}></div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isMobile: state.viewport.isMobile
});

export default connect(mapStateToProps)(Slider);
