import {Lib} from '../../../lib.jsx';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

function PropertyHighlights(props) {
  let {
    elementary_school,
    rets_high_school,
    rets_middle_school,
    rets_year_built,
    wpp_location_subdivision,
    wpp_location_city
  } = props;
  return <div className="row mb-4">
      <div className={`col-md-3 small-info-box`}>
        <p className={`text-muted ${Lib.THEME_CLASSES_PREFIX}top`}>Design </p>
        <p className={`${Lib.THEME_CLASSES_PREFIX}bottom`}>One Story</p>
      </div>
      <div className={`col-md-3 ${Lib.THEME_CLASSES_PREFIX}small-info-box`}>
        <p className={`text-muted ${Lib.THEME_CLASSES_PREFIX}top`}>Sub Division</p>
        <p className={`${Lib.THEME_CLASSES_PREFIX}bottom`}>{wpp_location_subdivision || "N/A"}</p>
      </div>
      <div className={`col-md-3 ${Lib.THEME_CLASSES_PREFIX}small-info-box`}>
        <p className={`text-muted ${Lib.THEME_CLASSES_PREFIX}top`}>Elementary School</p>
        <p className={`${Lib.THEME_CLASSES_PREFIX}bottom`}>{elementary_school || "N/A"}</p>
      </div>
      <div className={`col-md-3 ${Lib.THEME_CLASSES_PREFIX}small-info-box`}>
        <p className={`text-muted ${Lib.THEME_CLASSES_PREFIX}top`}>Middle School</p>
        <p className={`${Lib.THEME_CLASSES_PREFIX}bottom`}>{rets_middle_school || "N/A"}</p>
      </div>
      <div className={`col-md-3 ${Lib.THEME_CLASSES_PREFIX}small-info-box`}>
        <p className={`text-muted ${Lib.THEME_CLASSES_PREFIX}top`}>Year Built</p>
        <p className={`${Lib.THEME_CLASSES_PREFIX}bottom`}>{rets_year_built || "N/A"}</p>
      </div>
      <div className={`col-md-3 ${Lib.THEME_CLASSES_PREFIX}small-info-box`}>
        <p className={`text-muted ${Lib.THEME_CLASSES_PREFIX}top`}>County</p>
        <p className={`${Lib.THEME_CLASSES_PREFIX}bottom`}>{wpp_location_city || "N/A"}</p>
      </div>
      <div className={`col-md-3 ${Lib.THEME_CLASSES_PREFIX}small-info-box`}>
        <p className={`text-muted ${Lib.THEME_CLASSES_PREFIX}top`}>High School</p>
        <p className={`${Lib.THEME_CLASSES_PREFIX}bottom`}>{rets_high_school || "N/A"}</p>
      </div>
    </div>;
}

export default PropertyHighlights;