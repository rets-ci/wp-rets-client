import {Lib} from '../../../lib.jsx';
import React, {Component, PropTypes} from 'react';

function PropertyHighlights(props) {
  return <div className="row mb-4">
      <div className={`col-md-3 small-info-box`}>
        <p className={`text-muted ${Lib.THEME_CLASSES_PREFIX}top`}>Design </p>
        <p className={`${Lib.THEME_CLASSES_PREFIX}bottom`}>One Story</p>
      </div>
      <div className={`col-md-3 properypto-small-info-box`}>
        <p className={`text-muted ${Lib.THEME_CLASSES_PREFIX}top`}>Sub Division</p>
        <p className={`${Lib.THEME_CLASSES_PREFIX}bottom`}>Not in a Subdivision</p>
      </div>
      <div className={`col-md-3 properypto-small-info-box`}>
        <p className={`text-muted ${Lib.THEME_CLASSES_PREFIX}top`}>Elementary School</p>
        <p className={`${Lib.THEME_CLASSES_PREFIX}bottom`}>1 month</p>
      </div>
      <div className={`col-md-3 properypto-small-info-box`}>
        <p className={`text-muted ${Lib.THEME_CLASSES_PREFIX}top`}>Middle School</p>
        <p className={`${Lib.THEME_CLASSES_PREFIX}bottom`}>Durham - Githens</p>
      </div>
      <div className={`col-md-3 properypto-small-info-box`}>
        <p className={`text-muted ${Lib.THEME_CLASSES_PREFIX}top`}>Year Built</p>
        <p className={`${Lib.THEME_CLASSES_PREFIX}bottom`}>1915</p>
      </div>
      <div className={`col-md-3 properypto-small-info-box`}>
        <p className={`text-muted ${Lib.THEME_CLASSES_PREFIX}top`}>County</p>
        <p className={`${Lib.THEME_CLASSES_PREFIX}bottom`}>Durham</p>
      </div>
      <div className={`col-md-3 properypto-small-info-box`}>
        <p className={`text-muted ${Lib.THEME_CLASSES_PREFIX}top`}>High School</p>
        <p className={`${Lib.THEME_CLASSES_PREFIX}bottom`}>Durham Jordan</p>
      </div>
    </div>;
}

export default PropertyHighlights;