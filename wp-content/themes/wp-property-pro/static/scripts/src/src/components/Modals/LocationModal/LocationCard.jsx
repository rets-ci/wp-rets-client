import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import Swiper from 'react-id-swiper';
import map from 'lodash/map';
import get from 'lodash/get';

import { Lib } from 'app_root/lib.jsx';
import Util from 'app_root/components/Util.jsx';


class LocationCard extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  handlePrevClick = (e) => {
    e.stopPropagation();
    this.swiper.slidePrev();
  }

  handleNextClick = (e) => {
    e.stopPropagation();
    this.swiper.slideNext();
  }

  render() {
    let {
      images,
      label,
      text,
      listingsCount,
    } = this.props.data;

    const swiperParams = {
      loop: true,
      preloadImages: false,
      lazyLoading: true,
      lazyLoadingInPrevNext: true,
      lazyLoadingInPrevNextAmount: 3,
      lazyLoadingOnTransitionStart: true,
      onInit: (swiper) => {
        this.swiper = swiper;
        setTimeout(() => {  // need to resize images
          this.swiper.onResize();
        });
      },
    };

    let swiperImages = (images || []).slice(0);

    swiperImages.unshift(
      Util.getGoogleStaticMapThumbnailURL({
        size: Lib.PROPERTY_LISTING_IMAGE_SIZE,
        location: `${text},NC`, // @FIXME later
        zoom: 11,
      })
    );

    const labelClass = classNames(
      Lib.THEME_CLASSES_PREFIX + 'label',
      Lib.THEME_CLASSES_PREFIX + label.toLowerCase(),
    );

    const cardImageBlock = (
      <div className={Lib.THEME_CLASSES_PREFIX + "card-img"}>
        <div className={Lib.THEME_CLASSES_PREFIX + "card-img-top"}>
          <span className={Lib.THEME_CLASSES_PREFIX + "price"}>{ text }</span>
          <span className={labelClass}>{ label }</span>
          <span className={Lib.THEME_CLASSES_PREFIX + "action-buttons"}>
            <a href="#">
              <i className="fa fa-search" aria-hidden="true"></i>
            </a>
          </span>
          <Swiper {...swiperParams}>
            {swiperImages.map((url, index) =>
              <div className="swiper-slide" key={index}>
                <div className="swiper-lazy bg-card-img" data-background={ url }>
                  <div className="swiper-lazy-preloader"></div>
                </div>
              </div>
            )}
          </Swiper>
        </div>
        { swiperImages.length > 1 &&
          <div className={Lib.THEME_CLASSES_PREFIX + "direction-nav-container"}>
            <ul className={`nav ${Lib.THEME_CLASSES_PREFIX}direction-nav text-center`}>
              <li className="nav-item mr-auto">
                <span
                  className={`${Lib.THEME_CLASSES_PREFIX}nav-prev rounded-circle`}
                  onClick={this.handlePrevClick}
                ></span>
              </li>
              <li className="nav-item">
                <span
                  className={`${Lib.THEME_CLASSES_PREFIX}nav-next rounded-circle`}
                  onClick={this.handleNextClick}
                ></span>
              </li>
            </ul>
          </div>
        }
      </div>
    );

    const cardInfoBlock = (
      <div className={`card-block ${Lib.THEME_CLASSES_PREFIX}card-block`}>
        <div className={`${Lib.THEME_CLASSES_PREFIX}card-attrs`}>{ `${listingsCount} Listings` }</div>
      </div>
    );

    return (
      <div className={`${Lib.THEME_CLASSES_PREFIX}card card`}>
        { cardImageBlock }
        { cardInfoBlock }
      </div>
    );
  }
}

export default LocationCard;
