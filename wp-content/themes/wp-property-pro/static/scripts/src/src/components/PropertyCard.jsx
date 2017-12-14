import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {withRouter} from 'react-router';
import renderHTML from 'react-render-html';
import Swiper from 'react-id-swiper';
import {Link} from 'react-router-dom';
import each from 'lodash/each';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import { Lib } from '../lib.jsx';
import Util from './Util.jsx';

const isMobile = window.innerWidth < 576;


class PropertyCard extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    highlighted: PropTypes.bool,
    location: PropTypes.object.isRequired,
    onClickCard: PropTypes.func,
    openPanelWhenClicked: PropTypes.bool,
    propertiesDOM: PropTypes.object
  }

  handlePropertyClick = (id) => {
    this.props.onClickCard(id);
  }

  handlePrevClick = (e) => {
    e.preventDefault();
    this.swiper.slidePrev();
  }

  handleNextClick = (e) => {
    e.preventDefault();
    this.swiper.slideNext();
  }

  shouldComponentUpdate(nextProps) {
    let shouldUpdate = (
      !isEqual(nextProps.data, this.props.data) ||
      nextProps.highlighted !== this.props.highlighted ||
      !isEqual(nextProps.propertiesDOM, this.props.propertiesDOM) ||
      nextProps.openPanelWhenClicked !== this.props.openPanelWhenClicked
    );
    return shouldUpdate;
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
      sub_types,
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

    let info_box = [];

    sub_types = sub_types || [];
    info_box.push(`<li class="attr-subtypes">${sub_types.join(', ')}</li>`);

    if (type !== 'commercial' && type !== 'land') {
      info_box.push(`<li class="attr-bd">${beds} </li><li class="attr-ba">${baths} </li>`);
    }

    if (type !== 'land' && !!+sqft) {
      info_box.push(`<li class="attr-sf">${Util.formatSQFTValue(sqft)} </li>`);
    }

    if (type === 'land' && !!+lots_size) {
      info_box.push(`<li class="attr-ac">${Util.formatAcresValue(lots_size)} </li>`);
    }

    // residential - remove the property subtype from residential cards. #1526
    if (type === 'residential') {
      info_box.shift();
    }

    // commercial/land - order subtype to last in attribute row. #1526
    if (type === 'commercial' || type === 'land') {
      const temp = info_box.shift();
      info_box.push(temp);
    }

    info_box = info_box.join('');

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
          <span className={Lib.THEME_CLASSES_PREFIX + "price"}>{Util.formatPriceValue(price)}</span>
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
