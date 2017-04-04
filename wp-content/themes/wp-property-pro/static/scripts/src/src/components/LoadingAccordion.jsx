import React, {Component, PropTypes} from 'react';
import {Lib} from '../lib.jsx';

class LoadingAccordion extends Component {
  render() {

    return (
      <div className={Lib.THEME_CLASSES_PREFIX+"spinner-container"}>
        <div className={Lib.THEME_CLASSES_PREFIX+"spinner-accordion"}>
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
