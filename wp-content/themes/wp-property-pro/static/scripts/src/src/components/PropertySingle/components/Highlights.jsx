import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Lib } from 'app_root/lib.jsx';


const LISTING_TYPES_TO_HIDE = [ 'commercial', 'land' ];

const Highlights = ({ curatedPropertyInfo, fromMapView }) => {
  let {
    listing_type,
    elementary_school,
    rets_high_school,
    rets_middle_school,
    rets_year_built,
    wpp_location_subdivision,
    wpp_location_city
  } = curatedPropertyInfo;

  if (LISTING_TYPES_TO_HIDE.indexOf(listing_type) >= 0) {
    return null;
  }

  let gridClass = `${Lib.THEME_CLASSES_PREFIX}small-info-box `;
  if (fromMapView) {
    gridClass += 'col-6 col-xl-4'
  } else {
    gridClass += 'col-4 col-md-3'
  }


  return (
    <div className={ `${Lib.THEME_CLASSES_PREFIX}single-highlights pt-5` }>
      <h5 className={ `${Lib.THEME_CLASSES_PREFIX}info-section-header mb-4` }>
        Property Highlights
      </h5>

      <div className="row pt-3">
        <div className={ `${gridClass}` }>
          <p className="text-muted">Design </p>
          <p>One Story</p>
        </div>
        <div className={ `${gridClass}` }>
          <p className="text-muted">Sub Division</p>
          <p>{wpp_location_subdivision || "N/A"}</p>
        </div>
        <div className={ `${gridClass}` }>
          <p className="text-muted">Elementary School</p>
          <p>{elementary_school || "N/A"}</p>
        </div>
        <div className={ `${gridClass}` }>
          <p className="text-muted">Middle School</p>
          <p>{rets_middle_school || "N/A"}</p>
        </div>
        <div className={ `${gridClass}` }>
          <p className="text-muted">Year Built</p>
          <p>{rets_year_built || "N/A"}</p>
        </div>
        <div className={ `${gridClass}` }>
          <p className="text-muted">County</p>
          <p>{wpp_location_city || "N/A"}</p>
        </div>
        <div className={ `${gridClass}` }>
          <p className="text-muted">High School</p>
          <p>{rets_high_school || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

Highlights.propTypes = {
  curatedPropertyInfo: PropTypes.object,
  fromMapView: PropTypes.bool,
}

export default Highlights;