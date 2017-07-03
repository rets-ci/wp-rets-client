import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Lib} from '../lib.jsx';

class LoadingAccordion extends Component {
  render() {

    return (
      <div className="container">
        <div className="row">
          <div className={`${Lib.THEME_CLASSES_PREFIX}spinner-container my-auto`}>
            <div className={`${Lib.THEME_CLASSES_PREFIX}spinner-accordion text-center`}>
              <div className={Lib.THEME_CLASSES_PREFIX + "rect1"}></div>
              <div className={Lib.THEME_CLASSES_PREFIX + "rect2"}></div>
              <div className={Lib.THEME_CLASSES_PREFIX + "rect3"}></div>
              <div className={Lib.THEME_CLASSES_PREFIX + "rect4"}></div>
              <div className={Lib.THEME_CLASSES_PREFIX + "rect5"}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoadingAccordion;
