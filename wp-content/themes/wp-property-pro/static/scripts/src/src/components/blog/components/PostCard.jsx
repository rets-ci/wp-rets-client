import React, {Component, PropTypes} from 'react';
import Util from '../../Util.jsx';
import {Lib} from '../../../lib.jsx';
import _ from 'lodash';

export default class PostCard extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  };

  render() {
    let {
      title,
      excerpt,
      image_src,
      image_title,
      image_alt,
      url,
      relative_url
    } = this.props.data;
    return (
      <section className={`${Lib.THEME_CLASSES_PREFIX}post-item col-lg-6`}>
        <div className={Lib.THEME_CLASSES_PREFIX + "post-image"}>
          <a href={url} title={title} onClick={(e) => {
            e.preventDefault();
            Util.goToUrl(relative_url)
          }
          }>
            <img src={image_src} alt={_.isEmpty(image_alt) ? image_title : image_alt} className="img-fluid"/>
          </a>
        </div>
        <header className={Lib.THEME_CLASSES_PREFIX + "post-excerpt"}>
          <h5 className={Lib.THEME_CLASSES_PREFIX + "post-title"}>
            <a href={url} onClick={(e) => {
              e.preventDefault();
              Util.goToUrl(relative_url)
            }
            }>{title}</a>
          </h5>
        </header>
        <p>{excerpt}</p>
      </section>
    );
  }
}
