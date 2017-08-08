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
  
  imageMixerClicked = () => {
    this.setState({ lightboxIsOpen: true });
  }

  closeLightbox = () => {
    this.setState({ lightboxIsOpen: false });
  }

  gotoNext = () => {
    this.setState({ currentLightboxImage: this.state.currentLightboxImage + 1 });
  }

  gotoPrevious = () => {
		this.setState({ currentLightboxImage: this.state.currentLightboxImage - 1 });
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

    const desktopSwiper = (
      <Swiper {...desktopSwiperParams}>
        <div className="swiper-slide" key={0}>
          <div
            className="swiper-lazy img-lg"
            style={{ backgroundImage: `url(${images[0]})` }}
          >
            <div className="swiper-lazy-preloader"></div>
          </div>
        </div>
        { smImagesSet.map((subset, index) => (
            <div className="swiper-slide" key={index + 1}>
              <div
                className="swiper-lazy img-sm"
                style={{ backgroundImage: `url(${subset[0]})` }}
              />
              <div
                className="swiper-lazy img-sm"
                style={{ backgroundImage: `url(${subset[1]})` }}
              />
            </div>
          ))
        }
      </Swiper>
    );


    return (
      <div className={`${Lib.THEME_CLASSES_PREFIX}image-mixer`}>
        {
          desktopSwiper
        }
        
        <Lightbox
          currentImage={this.state.currentLightboxImage}
          images={LightboxImages}
          isOpen={this.state.lightboxIsOpen}
          onClickNext={this.gotoNext}
          onClickPrev={this.gotoPrevious}
          onClose={this.closeLightbox}
        />
      </div>
    )
  }
}

export default ImageMixer;