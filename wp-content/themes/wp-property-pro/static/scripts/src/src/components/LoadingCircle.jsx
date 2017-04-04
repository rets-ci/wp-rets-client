import React, {Component, PropTypes} from 'react';
import {Lib} from '../lib.jsx';
import _ from 'lodash';

class LoadingCircle extends Component {
  render() {
    let {
      additionalClass
    } = this.props;

    let classNames = additionalClass && _.isString(additionalClass) ? `${Lib.THEME_CLASSES_PREFIX}spinner-circle ${additionalClass}` : Lib.THEME_CLASSES_PREFIX + "spinner-circle";

    return (
      <div className={classNames}>
        <div className={Lib.THEME_CLASSES_PREFIX + "double-bounce1"}></div>
        <div className={Lib.THEME_CLASSES_PREFIX + "double-bounce2"}></div>
      </div>
    );
  }
}
;

export default LoadingCircle;
