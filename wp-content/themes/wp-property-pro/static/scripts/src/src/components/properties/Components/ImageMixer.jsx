import {Lib} from '../../../lib.jsx';
import React, {Component, PropTypes} from 'react';
import Lightbox from 'react-images';

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
  
  imageMixerClicked() {
    this.setState({
      lightboxIsOpen: true
    });
  }

  closeLightbox() {
    this.setState({
      lightboxIsOpen: false
    });
  }

  gotoNext() {
    this.setState({
			currentLightboxImage: this.state.currentLightboxImage + 1,
		});
  }

  gotoPrevious () {
		this.setState({
			currentLightboxImage: this.state.currentLightboxImage - 1,
		});
	}

  render() {
    let {
      images
    } = this.props;
    let LightboxImages = images.map(i => ({
      src: i
    }));
    return (
      <div className={`d-flex flex-row ${Lib.THEME_CLASSES_PREFIX}image-mixer`} onClick={this.imageMixerClicked.bind(this)}>
        <div className={`${Lib.THEME_CLASSES_PREFIX}img-container-height-600`}>
          <img src={images[0] || ""} />
        </div>
        <div>
          <div className={`${Lib.THEME_CLASSES_PREFIX}img-container-height-300`}>
            <img src={images[1] || ""} />
          </div>
          <div className={`${Lib.THEME_CLASSES_PREFIX}img-container-height-300`}>
            <img src={images[2] || ""} />
          </div>
        </div>
        <div className={`${Lib.THEME_CLASSES_PREFIX}img-container-height-300`}>
          <img src={images[3] || ""} />
          <img src={images[4] || ""} />
        </div>
        <Lightbox
          currentImage={this.state.currentLightboxImage}
          images={LightboxImages}
          isOpen={this.state.lightboxIsOpen}
          onClickNext={this.gotoNext.bind(this)}
					onClickPrev={this.gotoPrevious.bind(this)}
          onClose={this.closeLightbox.bind(this)}
        />
      </div>
    )
  }
}

export default ImageMixer;