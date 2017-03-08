import {Lib} from '../lib.jsx';
import React, {Component, PropTypes} from 'react';
import Util from './Util.jsx';
import Swiper from './Swiper.jsx';

export default class PropertyCard extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  componentDidMount() {
    console.log('component did mount');
    this.swiper = Swiper.init(this.swiperElement, {
      preloadImages: false,
      lazyLoading: true
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
      gallery_images,
      post_title,
      thumbnail
    } = this.props.data;
    return (
      <div className="card card-homepage swiper-slide">
        <div className="card-img">
          <div className="card-img-top">
            <div className="swiper-container" ref={(r) => this.swiperElement = r}>
              <div className="swiper-wrapper">
                <div className="swiper-slide">
                  <img
                    alt="Card image cap"
                    className="swiper-lazy"
                    src={Util.getThumbnailUrlBySize(thumbnail, Lib.PROPERTY_LISTING_IMAGE_SIZE)}
                  />
                </div>
                {gallery_images.map((d, k) =>
                  <div className="swiper-slide" key={k}>
                    <img
                      alt="Card image cap"
                      className="swiper-lazy"
                      data-src={Util.getThumbnailUrlBySize(d, Lib.PROPERTY_LISTING_IMAGE_SIZE)}
                    />
                    <div className="swiper-lazy-preloader"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <ul className="direction-nav">
            <li><a className="nav-prev" onClick={(e) => { e.preventDefault(); return this.handleNavigation.bind(this)('prev'); } } href="#"></a></li>
            <li><a className="nav-next" onClick={(e) => { e.preventDefault(); return this.handleNavigation.bind(this)('next'); } } href="#"></a></li>
          </ul>
        </div>
        <div className="card-block">
          <div className="listing-top">
            <span className="price">$1,249,000</span>
            <span className="action-btn-group">
              <a href="#" className="favorite active" title="Save as favorite">
                <i className="fa fa-heart" aria-hidden="true"></i>
              </a>
              <a href="#" className="hide" title="Hide">
                <i className="fa fa-eye-slash" aria-hidden="true"></i>
              </a>
            </span>
          </div>
          <h4 className="card-title">{post_title}</h4>
          <p className="card-text">Durham, NC 27712</p>
          <ul className="liting-info-box">
            <li>3 Bed</li>
            <li>2 Bath</li>
            <li>1,142 SF</li>
          </ul>
        </div>
      </div>
    );
  }
}
