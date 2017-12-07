import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames'
import ContentLoader, { Rect, Circle } from 'react-content-loader';

import { Lib } from 'app_root/lib.jsx';
import LoadingCircle from 'app_root/components/LoadingCircle.jsx';


const Placeholder = ({ viewport }) => {

  let carouselClass = `${Lib.THEME_CLASSES_PREFIX}property-single-carousel`;
  let carouselHeight;

  if (viewport.isMobile) {
    carouselHeight = viewport.width;
  } else if (viewport.isShort) {
    carouselHeight = '400px';
    carouselClass += ` ${Lib.THEME_CLASSES_PREFIX}viewport-short`;
  } else {
    carouselHeight = '600px';
  }

  return (
    <div className={ `${Lib.THEME_CLASSES_PREFIX}single-container ${Lib.THEME_CLASSES_PREFIX}content-placeholder` }>
      <section className={ carouselClass }>
        <LoadingCircle verticallyCentered={true} containerHeight={carouselHeight} />
      </section>
      <section className={ `${Lib.THEME_CLASSES_PREFIX}single-masthead py-5` }>
        <div className="container"><div className="row"><div className="col-12 col-lg-8">
          <h4 className="mb-2">
            <ContentLoader primaryColor={ '#8b8c8d' }><Rect /></ContentLoader>
          </h4>
          <h6 className="mb-3">
            <ContentLoader primaryColor={ '#dcdcdc' }><Rect /></ContentLoader>
          </h6>
          <ul className={ `${Lib.THEME_CLASSES_PREFIX}listing-info-box flex-wrap m-0` }>
          { [1,2,3,4].map((e, index) =>
            <li key={index}>
              <ContentLoader primaryColor={ '#8b8c8d' }><Rect /></ContentLoader>
            </li>
          )}
          </ul>
        </div></div></div>
      </section>
    </div>
  );
};

Placeholder.propTypes = {
}

const mapStateToProps = (state) => ({
  viewport: state.viewport,
});

export default connect(mapStateToProps)(Placeholder);
