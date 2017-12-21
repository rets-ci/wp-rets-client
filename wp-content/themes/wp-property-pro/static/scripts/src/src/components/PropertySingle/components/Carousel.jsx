import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Lightbox from 'react-images';
import Swiper from 'react-id-swiper';

import { Lib } from 'app_root/lib.jsx';
import Util from 'app_root/components/Util.jsx';


class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLightboxImage: 0,
      lightboxIsOpen: false
    };
  }
  
  imageMixerClicked(imgIndex) {
    this.setState({
      lightboxIsOpen: true,
      currentLightboxImage: imgIndex,
    });
  }

  closeLightbox = () => {
    this.setState({ lightboxIsOpen: false });
  }

  onLightboxNext = () => {
    this.setState({ currentLightboxImage: this.state.currentLightboxImage + 1 });
  }

  onLightboxPrev = () => {
		this.setState({ currentLightboxImage: this.state.currentLightboxImage - 1 });
	}

  handleNavigation(direction) {
    if (direction === 'next') {
      this.swiper.slideNext();
    } else if (direction === 'prev') {
      this.swiper.slidePrev();
    }
  }

  render() {
    let { address, city, state, images: gallery_images } = this.props.curatedPropertyInfo;
    
    let lightboxImages = (gallery_images || []).map(e => ({
      src: e
    }));

    let images = (gallery_images || []).map(e => 
      Util.getThumbnailUrlBySize(e, Lib.PROPERTY_IMAGE_SQUARE_SIZE) 
    )

    if (!images.length) {
      images = [
        Util.getGoogleStreetViewThumbnailURL({
          size: Lib.PROPERTY_IMAGE_SQUARE_SIZE,
          location: `${address[0]}, ${city}, ${state}`
        })
      ];
      lightboxImages = [images[0]]
    }

    let smImagesSet = []
    for (let i = 1; i < images.length; i = i + 2) {
      const subset = [ images[i] ]
      if ( i + 1 < images.length ) {
        subset.push(images[i + 1]);
      }
      smImagesSet.push(subset);
    }

    const desktopSwiperParams = {
      freeMode: true,
      slidesPerView: 'auto',
      spaceBetween: 5,
      preloadImages: false,
      lazyLoading: true,
      // Reinit swiper on update images
      rebuildOnUpdate: true,
      onInit: (swiper) => {
        this.swiper = swiper;
      },
    };

    const mobileSwiperParams = {
      loop: true,
      spaceBetween: 30,
      preloadImages: false,
      lazyLoading: true,
      lazyLoadingInPrevNext: true,
      lazyLoadingInPrevNextAmount: 3,
      // Reinit swiper on update images
      lazyLoadingOnTransitionStart: true,
      rebuildOnUpdate: true,
      onInit: (swiper) => {
        this.swiper = swiper;
      },
    };

    let desktopSwiper = null;
    let mobileSwiper = null;

    if (this.props.viewport.isMobile) {
      mobileSwiper = (
        <Swiper {...mobileSwiperParams}>
          { images.length && images.map((img, index) => (
              <div className="swiper-slide" key={index} onClick={this.imageMixerClicked.bind(this, index)}>
                <div
                  className="swiper-lazy img-mobile"
                  data-background={ img }
                >
                  <div className="swiper-lazy-preloader"></div>
                </div>
              </div>
            ))
          }
        </Swiper>
      );
    } else {
      desktopSwiper = (
        <Swiper {...desktopSwiperParams}>
          <div className="swiper-slide" key={0} onClick={this.imageMixerClicked.bind(this, 0)}>
            <div
              className="swiper-lazy img-main"
              style={{ backgroundImage : `url(${images[0]})` }}
            ></div>
          </div>
          { smImagesSet.map((subset, index) => (
              <div className="swiper-slide" key={index + 1}>
                <div
                  className="swiper-lazy img-sub"
                  style={{ backgroundImage : `url(${subset[0]})` }}
                  onClick={this.imageMixerClicked.bind(this, index * 2 + 1)}
                />
                {
                  subset[1]
                  ?  <div
                        className="swiper-lazy img-sub"
                        style={{backgroundImage: `url(${subset[1]})`}}
                        onClick={this.imageMixerClicked.bind(this, (index + 1) * 2)}
                    />
                  : null
                }
              </div>
            ))
          }
        </Swiper>
      );
    }

    const containerClass = classNames(
      `${Lib.THEME_CLASSES_PREFIX}property-single-carousel`,
      (this.props.viewport.isShort || this.props.fromMapView) ? `${Lib.THEME_CLASSES_PREFIX}viewport-short`: '',
    )

    return (
      <div className={ containerClass }>
        { mobileSwiper }
        { desktopSwiper }

        <div className={`${Lib.THEME_CLASSES_PREFIX}direction-nav-container`}>
          <ul className={`${Lib.THEME_CLASSES_PREFIX}direction-nav nav text-center`}>
            <li className="nav-item mr-auto">
              <span
                className={`${Lib.THEME_CLASSES_PREFIX}nav-prev rounded-circle`}
                onClick={e => {
                  e.preventDefault();
                  this.handleNavigation.bind(this)('prev');
                }}
              ></span>
            </li>
            <li className="nav-item">
              <span
                className={`${Lib.THEME_CLASSES_PREFIX}nav-next rounded-circle`}
                onClick={e => {
                  e.preventDefault();
                  this.handleNavigation.bind(this)('next');
                }}
              ></span>
            </li>
          </ul>
        </div>
        
        <Lightbox
          currentImage={this.state.currentLightboxImage}
          images={lightboxImages}
          isOpen={this.state.lightboxIsOpen}
          onClickNext={this.onLightboxNext}
          onClickPrev={this.onLightboxPrev}
          onClose={this.closeLightbox}
        />
      </div>
    )
  }
}

Carousel.propTypes = {
  viewport: PropTypes.object.isRequired,
  fromMapView: PropTypes.bool.isRequired,
};

export default Carousel;
