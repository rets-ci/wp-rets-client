import {Lib} from '../../../lib.jsx';
import React, {Component, PropTypes} from 'react';

class ImageMixer extends Component {
  static propTypes = {
    images: PropTypes.array
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let {
      images
    } = this.props;
    return (
      <div className={`d-flex flex-row ${Lib.THEME_CLASSES_PREFIX}image-mixer`}>
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
      </div>
    )
  }
}

export default ImageMixer;