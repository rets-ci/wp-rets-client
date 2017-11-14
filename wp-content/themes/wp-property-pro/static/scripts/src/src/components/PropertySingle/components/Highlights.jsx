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

  let gridClass = `${Lib.THEME_CLASSES_PREFIX}small-info-box `;
  if (fromMapView) {
    gridClass += 'col-6 col-xl-4'
  } else {
    gridClass += 'col-4 col-md-3'
  }

  const subTypes = getSubTypes(elasticSearchSource) || 'N/A'
  const design = getDesign(elasticSearchSource) || 'N/A'
  const style = getStyle(elasticSearchSource) || 'N/A'
  const yearBuilt = getYearBuilt(elasticSearchSource) || 'N/A'
  const isNewConstruction = getNewConstruction(elasticSearchSource)
  const subDivision = getSubdivision(elasticSearchSource) || 'N/A'
  const insideCity = getInsideCity(elasticSearchSource)
  const county = getCounty(elasticSearchSource) || 'N/A'
  const elementarySchool = getElementarySchool(elasticSearchSource) || 'N/A'
  const middleSchool = getMiddleSchool(elasticSearchSource) || 'N/A'
  const highSchool = getMiddleSchool(elasticSearchSource) || 'N/A'

  const designAndStyle = [ design, style ].join(', ')
  const yearAndNewFlag = isNewConstruction === 'Yes' ? `${yearBuilt}, New Construction` : yearBuilt

  return (
    <div className={ `${Lib.THEME_CLASSES_PREFIX}single-highlights pt-5` }>
      <h5 className={ `${Lib.THEME_CLASSES_PREFIX}info-section-header mb-4` }>
        Property Highlights
      </h5>

      <div className="row pt-3">
        <div className={ `${gridClass}` }>
          <p className="text-muted">Type </p>
          <p>{ subTypes }</p>
        </div>
        <div className={ `${gridClass}` }>
          <p className="text-muted">Style </p>
          <p>{ designAndStyle }</p>
        </div>
        <div className={ `${gridClass}` }>
          <p className="text-muted">Year </p>
          <p>{ yearAndNewFlag || 'N/A' }</p>
        </div>
        <div className={ `${gridClass}` }>
          <p className="text-muted">Subdivision</p>
          <p>{ subDivision }</p>
        </div>
        <div className={ `${gridClass}` }>
          <p className="text-muted">Inside City</p>
          <p>{ insideCity }</p>
        </div>
        <div className={ `${gridClass}` }>
          <p className="text-muted">County</p>
          <p>{ county }</p>
        </div>
        <div className={ `${gridClass}` }>
          <p className="text-muted">Elementary School</p>
          <p>{ elementarySchool }</p>
        </div>
        <div className={ `${gridClass}` }>
          <p className="text-muted">Middle School</p>
          <p>{ middleSchool }</p>
        </div>
        <div className={ `${gridClass}` }>
          <p className="text-muted">High School</p>
          <p>{ highSchool }</p>
        </div>
      </div>
    </div>
  );
};

Highlights.propTypes = {
  elasticSearchSource: PropTypes.object,
  fromMapView: PropTypes.bool,
}

export default Highlights;
