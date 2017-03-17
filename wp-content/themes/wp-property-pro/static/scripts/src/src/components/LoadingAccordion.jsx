import React, {Component, PropTypes} from 'react';
import {Lib} from '../lib.jsx';

class LoadingAccordion extends Component {
  render() {
    let {
      style
    } = this.props;
    return (
      <div style={style}>
        <div className={Lib.THEME_CLASSES_PREFIX+"spinner-accordion"} style={{margin: 'auto'}}>
          <div className={Lib.THEME_CLASSES_PREFIX+"rect1"}></div>
          <div className={Lib.THEME_CLASSES_PREFIX+"rect2"}></div>
          <div className={Lib.THEME_CLASSES_PREFIX+"rect3"}></div>
          <div className={Lib.THEME_CLASSES_PREFIX+"rect4"}></div>
          <div className={Lib.THEME_CLASSES_PREFIX+"rect5"}></div>
        </div>
      </div>
    );
  }
};

export default LoadingAccordion;
