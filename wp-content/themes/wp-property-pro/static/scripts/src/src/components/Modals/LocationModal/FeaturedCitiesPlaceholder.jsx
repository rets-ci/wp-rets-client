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
      </div>
    </div>
  );
};

const Placeholder = ({ isMobile }) => {
  return (
    <div className={ `${Lib.THEME_CLASSES_PREFIX}featured-cities-wrapper container` }>
      <div className="row">
        <div className="col-12 col-md-4">
          <CardPlaceholder />
        </div>
        { !isMobile &&
          <div className="col-12 col-md-4">
            <CardPlaceholder />
          </div>
        }
        { !isMobile &&
          <div className="col-12 col-md-4">
            <CardPlaceholder />
          </div>
        }
      </div>
    </div>
  );
};

Placeholder.propTypes = {
  isMobile: PropTypes.bool.isRequired,
}

export default Placeholder;
