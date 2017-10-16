import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {withRouter} from 'react-router';
import renderHTML from 'react-render-html';
import Swiper from 'react-id-swiper';
import {Link} from 'react-router-dom';
import each from 'lodash/each';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { Lib } from '../lib.jsx';
import Util from './Util.jsx';

const isMobile = window.innerWidth < 576;


class PropertyCard extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    propertiesDOM: PropTypes.object
  }

  handlePropertyClick = (id) => {
    this.props.onClickCard(id);
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
      address,
      address_unit,
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
      sqft,
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

    if (type !== 'land' && !!+sqft) {
      info_box += `<li>${Util.formatSQFTValue(sqft)} SF</li>`;
    }

    if (type === 'land' && !!+lots_size) {
      info_box += `<li>${Util.formatLotSizeValue(lots_size)} Acres</li>`;
    }

    classes = ['card', `${Lib.THEME_CLASSES_PREFIX}card`]
    if (this.props.highlighted) {
      classes.push(`${Lib.THEME_CLASSES_PREFIX}card-selected`);
    }

    const thumbnailSrc = isEmpty(thumbnail)
      ? Util.getGoogleStreetViewThumbnailURL({
          size: Lib.PROPERTY_LISTING_IMAGE_SIZE,
          location: !isEmpty(location) ? location.join(',') : ''
        })
      : (!get(this.props.data, 'full_image', false)
        ? Util.getThumbnailUrlBySize(thumbnail, Lib.PROPERTY_LISTING_IMAGE_SIZE)
        : thumbnail
      )

    let swiperImages = [ thumbnailSrc ]
    each(gallery_images.slice(1), (e) => {
      swiperImages.push(Util.getThumbnailUrlBySize(e, Lib.PROPERTY_LISTING_IMAGE_SIZE))
    });

    const cardImageBlock = (
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
            {swiperImages.map((url, index) =>
              <div className="swiper-slide" key={index}>
                <div className="swiper-lazy bg-card-img" data-background={ url }>
                  <div className="swiper-lazy-preloader"></div>
                </div>
              </div>
            )}
          </Swiper>
        </div>
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
      </div>
    );

    const cardInfoBlock = (
      <div className={`card-block ${Lib.THEME_CLASSES_PREFIX}card-block`}>
        <h4 className={`card-title ${Lib.THEME_CLASSES_PREFIX}card-title m-0`}>{address} {address_unit}</h4>
        <p className={`card-text ${Lib.THEME_CLASSES_PREFIX}card-text`}>{city}, {state} {zip}</p>
        <ul className={`${Lib.THEME_CLASSES_PREFIX}listing-info-box`}>{renderHTML(info_box)}</ul>
      </div>
    );

    if (this.props.openPanelWhenClicked && !isMobile) {
      return (
        <div
          className={classes.join(' ')}
          ref={(r) => this.props.propertiesDOM ? this.props.propertiesDOM[id] = r : null}
          onClick={() => this.handlePropertyClick(id)}
        >
          { cardImageBlock }
          { cardInfoBlock }
        </div>
      );
    } else {
      return (
        <div
          className={classes.join(' ')}
          ref={(r) => this.props.propertiesDOM ? this.props.propertiesDOM[id] = r : null}
        >
          <Link to={link}>
            { cardImageBlock }
            { cardInfoBlock }
            </Link>
        </div>
      );
    }
  }
}

export default withRouter(PropertyCard);
