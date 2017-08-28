import PropTypes from 'prop-types';
import React, { Component } from 'react';
import numeral from 'numeral';
import renderHTML from 'react-render-html';
import Swiper from 'react-id-swiper';
import { browserHistory, Link } from 'react-router';
import _ from 'lodash';

import { Lib } from '../lib.jsx';
import Util from './Util.jsx';


export default class PropertyCard extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  handlePropertyClick(eve, url) {
    eve.preventDefault();

    browserHistory.push(url);

    this.swiper = null;
  }

  handleNavigation(direction) {
    if (direction === 'next') {
      this.swiper.slideNext();
    } else if (direction === 'prev') {
      this.swiper.slidePrev();
    }
  }

  render() {
    let {
      address,
      baths,
      beds,
      city,
      gallery_images,
      id,
      living_area,
      location,
      lots_size,
      price,
      property_type,
      post_name,
      state,
      thumbnail,
      type,
      sub_type,
      zip
    } = this.props.data;

    const swiperParams = {
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

    let link = '/' + bundle.property_single_url + '/' + post_name;
    let classes;

    let info_box = `<li>${sub_type}</li>`;

    if (type !== 'commercial' && type !== 'land') {
      info_box += `<li>${beds} Bed</li><li>${baths} Bath</li>`;
    }

    if (type !== 'land' && !!+living_area[0]) {
      info_box += `<li>${Util.formatSQFTValue(living_area)} SF</li>`;
    }

    if (type === 'land') {
      info_box += `<li>${lots_size} Acres</li>`;
    }

    classes = ['card', `${Lib.THEME_CLASSES_PREFIX}card`]
    if (this.props.highlighted) {
      classes.push(`${Lib.THEME_CLASSES_PREFIX}card-selected`);
    }

    return (
      <div
        className={classes.join(' ')}>
        <Link
          to={link}
        >
          <div className={Lib.THEME_CLASSES_PREFIX + "card-img"}>
            <div className={Lib.THEME_CLASSES_PREFIX + "card-img-top"}>
              <div className={Lib.THEME_CLASSES_PREFIX + "listing-top"}>
                <span className={Lib.THEME_CLASSES_PREFIX + "price"}>{Util.formatPriceValue(price)}</span>
                <span className={Lib.THEME_CLASSES_PREFIX + "action-btn-group"}>
                  {/*<a href="#" className={`${Lib.THEME_CLASSES_PREFIX}favorite ${Lib.THEME_CLASSES_PREFIX}active`}
                    title="Save as favorite">
                    <i className="fa fa-heart" aria-hidden="true"></i>
                  </a>
                  <a href="#" className={Lib.THEME_CLASSES_PREFIX + "hide"} title="Hide">
                    <i className="fa fa-eye-slash" aria-hidden="true"></i>
                  </a>*/}
                </span>
              </div>
              <Swiper {...swiperParams}>
                <div className="swiper-slide" key={0}>
                  <img
                    alt="Card image cap"
                    className="swiper-lazy card-img-top"
                    src={_.isEmpty(thumbnail) ? Util.getGoogleStreetViewThumbnailURL({
                        size: Lib.PROPERTY_LISTING_IMAGE_SIZE,
                        location: !_.isEmpty(location) ? location.join(',') : ''
                      }) : (!_.get(this.props.data, 'full_image', false) ? Util.getThumbnailUrlBySize(thumbnail, Lib.PROPERTY_LISTING_IMAGE_SIZE) : thumbnail)}
                  />
                </div>
                {gallery_images.slice(1).map((d, k) =>
                  <div className="swiper-slide" key={k + 1}>
                    <img
                      alt={_.isEmpty(d) ? 'Card image cap' : ''}
                      className="swiper-lazy card-img-top"
                      data-src={Util.getThumbnailUrlBySize(d, Lib.PROPERTY_LISTING_IMAGE_SIZE)}
                    />
                    <div className="swiper-lazy-preloader"></div>
                  </div>
                )}
              </Swiper>
            </div>
            <div className={Lib.THEME_CLASSES_PREFIX + "direction-nav-container"}>
              <ul className={`nav ${Lib.THEME_CLASSES_PREFIX}direction-nav text-center`}>
                <li className="nav-item mr-auto">
                  <a href="#"
                    className={`${Lib.THEME_CLASSES_PREFIX}nav-prev rounded-circle`}
                    onClick={e => {
                      e.preventDefault();
                      this.handleNavigation.bind(this)('prev');
                    }}
                  ></a>
                </li>
                <li className="nav-item">
                  <a href="#"
                    className={`${Lib.THEME_CLASSES_PREFIX}nav-next rounded-circle`}
                    onClick={e => {
                      e.preventDefault();
                      this.handleNavigation.bind(this)('next');
                    }}
                  ></a>
                </li>
              </ul>
            </div>
          </div>

          <div className={`card-block ${Lib.THEME_CLASSES_PREFIX}card-block`}>
            <h4 className={`card-title ${Lib.THEME_CLASSES_PREFIX}card-title m-0`}>{address}</h4>
            <p className={`card-text ${Lib.THEME_CLASSES_PREFIX}card-text`}>{city}, {state} {zip}</p>
            <ul className={`${Lib.THEME_CLASSES_PREFIX}listing-info-box`}>{renderHTML(info_box)}</ul>
          </div>
        </Link>
      </div>
    );
  }
}
