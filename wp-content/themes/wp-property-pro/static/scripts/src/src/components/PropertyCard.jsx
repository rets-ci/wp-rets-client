import {Lib} from '../lib.jsx';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import numeral from 'numeral';
import Util from './Util.jsx';
import renderHTML from 'react-render-html';
import Swiper from './Swiper.jsx';
import {browserHistory, Link} from 'react-router';
import _ from 'lodash';

export default class PropertyCard extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    listType: PropTypes.string.isRequired
  }

  handlePropertyClick(eve, url) {
    eve.preventDefault();

    browserHistory.push(url);
  }

  componentDidMount() {
    // let's hold a breathe until the parent cards slider allots width to inner gallery slider
    setTimeout(() => {
      this.swiper = Swiper.init(this.swiperElement, {
        effect: 'slide',
        preloadImages: false,
        lazyLoading: true,
        lazyLoadingInPrevNext: true,
        lazyLoadingOnTransitionStart: true,
        lazyLoadingInPrevNextAmount: 3,
        spaceBetween: 30
      });
    });
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
      thumbnail,
      type,
      zip
    } = this.props.data;

    let link = '/' + bundle.property_single_url + '/' + post_name;
    let classes = [];

    let info_box = `<li>${type}</li>`;

    if (property_type !== 'commercial' && property_type !== 'land') {
      info_box += `<li>${beds} Bed</li><li>${baths} Bath</li>`;
    }

    if (property_type !== 'land' && !!+living_area[0]) {
      info_box += `<li>${Util.formatSQFTValue(living_area)} SF</li>`;
    }

    if (property_type === 'land') {
      info_box += `<li>${lots_size} Acres</li>`;
    }

    if (this.props.listType === Lib.PROPERTIES_LIST_CAROUSEL) {
      classes = classes.concat(['card', `${Lib.THEME_CLASSES_PREFIX}card`, `${Lib.THEME_CLASSES_PREFIX}card-homepage`, 'swiper-slide']);
    } else {
      classes = classes.concat(['card', `${Lib.THEME_CLASSES_PREFIX}card`]);
    }

    if (this.props.highlighted) {
      classes.push(`${Lib.THEME_CLASSES_PREFIX}card-selected`);
    }
    classes.push(id);
    return (
      <div
        className={classes.join(' ')}>
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
            <div className="swiper-container" ref={(r) => this.swiperElement = r}>
              <div className="swiper-wrapper">
                <div className="swiper-slide">
                  <img
                    alt="Card image cap"
                    className="swiper-lazy card-img-top"
                    src={_.isEmpty(thumbnail) ? Util.getGoogleStreetViewThumbnailURL({
                        size: Lib.PROPERTY_LISTING_IMAGE_SIZE,
                        location: !_.isEmpty(location) ? location.join(',') : ''
                      }) : (!_.get(this.props.data, 'full_image', false) ? Util.getThumbnailUrlBySize(thumbnail, Lib.PROPERTY_LISTING_IMAGE_SIZE) : thumbnail)}
                  />
                </div>
                {gallery_images.slice(1, gallery_images.length).map((d, k) =>
                  <div className="swiper-slide" key={k}>
                    <img
                      alt={_.isEmpty(d) ? 'Card image cap' : ''}
                      className="swiper-lazy card-img-top"
                      data-src={Util.getThumbnailUrlBySize(d, Lib.PROPERTY_LISTING_IMAGE_SIZE)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={Lib.THEME_CLASSES_PREFIX + "direction-nav-container"}>
            <ul className={`nav ${Lib.THEME_CLASSES_PREFIX}direction-nav text-center`}>
              <li className="nav-item mr-auto ">
                <a
                  className={`${Lib.THEME_CLASSES_PREFIX}nav-prev rounded-circle`}
                  onClick={(e) => {
                    e.preventDefault();
                    return this.handleNavigation.bind(this)('prev');
                  }}
                  href="#"></a></li>
              <li className="nav-item"><a className={`${Lib.THEME_CLASSES_PREFIX}nav-next rounded-circle`}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            return this.handleNavigation.bind(this)('next');
                                          } } href="#"></a></li>
            </ul>
          </div>
        </div>
        <Link
          to={link}
        >
          <div className={`card-block ${Lib.THEME_CLASSES_PREFIX}card-block`}>
            <h4 className={`card-title ${Lib.THEME_CLASSES_PREFIX}card-title m-0`}>{address}</h4>
            <p className={`card-text ${Lib.THEME_CLASSES_PREFIX}card-text`}>{zip}, {city}</p>
            <ul className={`${Lib.THEME_CLASSES_PREFIX}listing-info-box`}>{renderHTML(info_box)}</ul>
          </div>
        </Link>
      </div>
    );
  }
}
