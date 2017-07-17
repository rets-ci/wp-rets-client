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
    let imagesSubset = images.slice(0, 8);
    imagesSubset[0] = imageSizeNameAppended(imagesSubset[0], 460, 460);
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
          <div className={`${Lib.THEME_CLASSES_PREFIX}image-mixer`} onClick={this.imageMixerClicked.bind(this)}>
            <div className={`${Lib.THEME_CLASSES_PREFIX}large-img-container`}>
              <img src={imagesSubset[0] || ""} width="600" height="600" />
            </div>
            <div className={`${Lib.THEME_CLASSES_PREFIX}wrap`}>
              {imagesSubset.slice(1, 8).map(i =>
                <div className={`${Lib.THEME_CLASSES_PREFIX}image-mixer-box`}>
                  <div className={`${Lib.THEME_CLASSES_PREFIX}image-mixer-boxInner`}>
                    <img src={i} width="460" height="460" />
                  </div>
                </div>
              )}
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