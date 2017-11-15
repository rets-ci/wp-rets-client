import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Lib } from 'app_root/lib.jsx';
import {
  getListingType,
  getSubTypes,
  getDesign,
  getStyle,
  getYearBuilt,
  getNewConstruction,
  getSubdivision,
  getInsideCity,
  getCounty,
  getElementarySchool,
  getMiddleSchool,
  getHighSchool,
} from 'app_root/helpers/propertyAttributeHelper';


const LISTING_TYPES_TO_HIDE = [ 'commercial', 'land' ];

const Highlights = ({ elasticSearchSource, fromMapView }) => {

  const listingType = getListingType(elasticSearchSource)
  if (LISTING_TYPES_TO_HIDE.indexOf(listingType) >= 0) {
    return null;
  }

  let boxClass = `${Lib.THEME_CLASSES_PREFIX}attr-box`;
  let gridClass = fromMapView ? 'col-6' : 'col-6 col-md-4';

  const subTypes          = getSubTypes(elasticSearchSource) || 'N/A'
  const design            = getDesign(elasticSearchSource) || 'N/A'
  const style             = getStyle(elasticSearchSource) || 'N/A'
  const yearBuilt         = getYearBuilt(elasticSearchSource) || 'N/A'
  const isNewConstruction = getNewConstruction(elasticSearchSource)
  const subDivision       = getSubdivision(elasticSearchSource) || 'N/A'
  const insideCity        = getInsideCity(elasticSearchSource)
  const county            = getCounty(elasticSearchSource) || 'N/A'
  const elementarySchool  = getElementarySchool(elasticSearchSource) || 'N/A'
  const middleSchool      = getMiddleSchool(elasticSearchSource) || 'N/A'
  const highSchool        = getMiddleSchool(elasticSearchSource) || 'N/A'

  const designAndStyle = [ design, style ].join(', ')
  const yearAndNewFlag = isNewConstruction === 'Yes' ? `${yearBuilt}, New Construction` : yearBuilt

  return (
    <div className={ `${Lib.THEME_CLASSES_PREFIX}single-highlights pt-5` }>
      <h5 className={ `${Lib.THEME_CLASSES_PREFIX}info-section-header` }>
        Property Highlights
      </h5>

      <div className={ `${Lib.THEME_CLASSES_PREFIX}attr-box-container row` }>
        <div className={ gridClass }><div className={ boxClass }>
          <p>Type </p>
          <p>{ subTypes }</p>
        </div></div>
        <div className={ gridClass }><div className={ boxClass }>
          <p>Style </p>
          <p>{ designAndStyle }</p>
        </div></div>
        <div className={ gridClass }><div className={ boxClass }>
          <p>Year </p>
          <p>{ yearAndNewFlag }</p>
        </div></div>
        <div className={ gridClass }><div className={ boxClass }>
          <p>Subdivision</p>
          <p>{ subDivision }</p>
        </div></div>
        <div className={ gridClass }><div className={ boxClass }>
          <p>Inside City</p>
          <p>{ insideCity }</p>
        </div></div>
        <div className={ gridClass }><div className={ boxClass }>
          <p>County</p>
          <p>{ county }</p>
        </div></div>
        <div className={ gridClass }><div className={ boxClass }>
          <p>Elementary School</p>
          <p>{ elementarySchool }</p>
        </div></div>
        <div className={ gridClass }><div className={ boxClass }>
          <p>Middle School</p>
          <p>{ middleSchool }</p>
        </div></div>
        <div className={ gridClass }><div className={ boxClass }>
          <p>High School</p>
          <p>{ highSchool }</p>
        </div></div>
      </div>
    </div>
  );
};

Highlights.propTypes = {
  elasticSearchSource: PropTypes.object,
  fromMapView: PropTypes.bool,
}

export default Highlights;
