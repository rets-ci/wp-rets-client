import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Lib} from '../lib.jsx';
import _ from 'lodash';

class LoadingCircle extends Component {
  static propTypes = {
    verticallyCentered: PropTypes.bool,
    containerHeight: PropTypes.string
  }

  render() {
    let {
      containerHeight,
      verticallyCentered
    } = this.props

    return (
      <div className={verticallyCentered ? `${Lib.THEME_CLASSES_PREFIX}spinner-container` : null} style={{height: containerHeight}}>
        <div className={`${Lib.THEME_CLASSES_PREFIX}spinner-circle my-auto text-center`}>
          <div className={`${Lib.THEME_CLASSES_PREFIX}double-bounce1 rounded-circle`}></div>
          <div className={`${Lib.THEME_CLASSES_PREFIX}double-bounce2 rounded-circle`}></div>
        </div>
      </div>
    );
  }
}

export default LoadingCircle;
