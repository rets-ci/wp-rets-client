import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-images';
import Swiper from 'react-id-swiper';

import { Lib } from '../../../lib.jsx';


class ImageMixer extends Component {
  static propTypes = {
    images: PropTypes.array
  }

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
    let {
      images
    } = this.props;

    let LightboxImages = images.map(i => ({
      src: i
    }));

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
      onInit: (swiper) => {
        this.swiper = swiper;
      },
    };

    const mobileSwiperParams = {
      spaceBetween: 30,
      preloadImages: false,
      lazyLoading: true,
      lazyLoadingInPrevNext: true,
      lazyLoadingInPrevNextAmount: 3,
      lazyLoadingOnTransitionStart: true,
      onInit: (swiper) => {
        this.swiper = swiper;
      },
    };

    const desktopSwiper = Lib.IS_MOBILE_VIEW === false && (
      <Swiper {...desktopSwiperParams}>
        <div className="swiper-slide" key={0} onClick={this.imageMixerClicked.bind(this, 0)}>
          <div
            className="swiper-lazy img-lg"
            data-background={ images[0] }
          >
            <div className="swiper-lazy-preloader"></div>
          </div>
        </div>
        { smImagesSet.map((subset, index) => (
            <div className="swiper-slide" key={index + 1}>
              <div
                className="swiper-lazy img-sm"
                style={{ backgroundImage : `url(${subset[0]})` }}
                onClick={this.imageMixerClicked.bind(this, index * 2 + 1)}
              />
              <div
                className="swiper-lazy img-sm"
                style={{ backgroundImage : `url(${subset[1]})` }}
                onClick={this.imageMixerClicked.bind(this, (index + 1) * 2)}
              />
            </div>
          ))
        }
      </Swiper>
    );

    const mobileSwiper = Lib.IS_MOBILE_VIEW === true && (
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


    return (
      <div className={`${Lib.THEME_CLASSES_PREFIX}image-mixer ${Lib.THEME_CLASSES_PREFIX}card-img`}>
        {
          Lib.IS_MOBILE_VIEW
            ? mobileSwiper
            : desktopSwiper
        }

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
          images={LightboxImages}
          isOpen={this.state.lightboxIsOpen}
          onClickNext={this.onLightboxNext}
          onClickPrev={this.onLightboxPrev}
          onClose={this.closeLightbox}
        />
      </div>
    )
  }
}

export default ImageMixer;