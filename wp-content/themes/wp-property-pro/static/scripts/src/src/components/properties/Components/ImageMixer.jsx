import {Lib} from '../../../lib.jsx';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import LoadingCircle from '../../LoadingCircle.jsx';
import Lightbox from 'react-images';
import Preload from 'react-preload';

function imageSizeNameAppended(image, width, height) {
  let strArr = image.split('.');
  // '- 2' gets you the actual path
  let path = strArr[strArr.length - 2];
  let newPath = path + '-' + width + 'x' + height;
  strArr[strArr.length - 2] = newPath;
  return strArr.join('.');
}

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

  handleImageLoadError() {
    console.warn('error loading images');
  }

  handleImageLoadSuccess() {
    console.warn('successful loading');
  }

  render() {
    let {
      images
    } = this.props;
    let LightboxImages = images.map(i => ({
      src: i
    }));
    let imagesSubset = images.slice(0, 5);
    imagesSubset[0] = imageSizeNameAppended(imagesSubset[0], 600, 600);
    let loadingContainer = (<LoadingCircle containerHeight="600px" verticallyCentered={true} />);
    return (
      <Preload
        autoResolveDelay={3000}
        loadingIndicator={loadingContainer}
        images={imagesSubset}
        onError={this.handleImageLoadError}
        onSuccess={this.handleImageLoadSuccess}
        resolveOnError={true}
        mountChildren={true}
        >
          <div className={`d-flex flex-row ${Lib.THEME_CLASSES_PREFIX}image-mixer`} onClick={this.imageMixerClicked.bind(this)}>
            <div className={`${Lib.THEME_CLASSES_PREFIX}img-container-height-600`}>
              <img src={imagesSubset[0] || ""} />
            </div>
            <div>
              <div className={`${Lib.THEME_CLASSES_PREFIX}img-container-height-300`}>
                <img src={imagesSubset[1] || ""} />
              </div>
              <div className={`${Lib.THEME_CLASSES_PREFIX}img-container-height-300`}>
                <img src={imagesSubset[2] || ""} />
              </div>
            </div>
            <div className={`${Lib.THEME_CLASSES_PREFIX}img-container-height-300`}>
              <img src={imagesSubset[3] || ""} />
              <img src={imagesSubset[4] || ""} />
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
      </Preload>
    )
  }
}

export default ImageMixer;