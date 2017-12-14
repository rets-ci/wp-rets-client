import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentLoader, { Rect, Circle } from 'react-content-loader';

import { Lib } from 'app_root/lib.jsx';


const CardPlaceholder = () => {
  return (
    <div className={ `${Lib.THEME_CLASSES_PREFIX}card card ${Lib.THEME_CLASSES_PREFIX}content-placeholder` }>
      <div className={ `${Lib.THEME_CLASSES_PREFIX}card-img` }>
        <ContentLoader height={ 211 } primaryColor={ '#dcdcdc' }>
          <Rect />
        </ContentLoader>
      </div>
      <div className={ `${Lib.THEME_CLASSES_PREFIX}card-block card-block` }>
        <h4 className={ `${Lib.THEME_CLASSES_PREFIX}card-title card-title` }>
          <ContentLoader primaryColor={ '#8b8c8d' }>
            <Rect />
          </ContentLoader>
        </h4>
        <p className={ `${Lib.THEME_CLASSES_PREFIX}card-text card-text` }>
          <ContentLoader primaryColor={ '#dcdcdc' }>
            <Rect />
          </ContentLoader>
        </p>
        <div className={ `${Lib.THEME_CLASSES_PREFIX}listing-info-box` }>
          <div>
            <ContentLoader primaryColor={ '#dcdcdc' }>
              <Rect />
            </ContentLoader>
          </div>
          <div>
            <ContentLoader primaryColor={ '#dcdcdc' }>
              <Rect />
            </ContentLoader>
          </div>
          <div>
            <ContentLoader primaryColor={ '#dcdcdc' }>
              <Rect />
            </ContentLoader>
          </div>
        </div>
      </div>
    </div>
  );
};

const Placeholder = ({ onInit, isFetching, isMobile }) => {
  return (
    <div className={ isFetching ? 'row d-flex' : 'row d-none' } ref={ onInit }>
      <div className="col-12 col-xl-6">
        <CardPlaceholder />
      </div>
      { !isMobile &&
        <div className="col-12 col-xl-6">
          <CardPlaceholder />
        </div>
      }
    </div>
  );
};

Placeholder.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  onInit: PropTypes.func.isRequired,
}

export default Placeholder;
