import React, {Component, PropTypes} from 'react';
import {Lib} from '../lib.jsx';

class LoadingCircle extends Component {
  render() {
    let {
      style
    } = this.props;
    return (
      <div className={Lib.THEME_CLASSES_PREFIX+"spinner-circle"} style={style}>
        <div className={Lib.THEME_CLASSES_PREFIX+"double-bounce1"}></div>
        <div className={Lib.THEME_CLASSES_PREFIX+"double-bounce2"}></div>
      </div>
    );
  }
};

export default LoadingCircle;
