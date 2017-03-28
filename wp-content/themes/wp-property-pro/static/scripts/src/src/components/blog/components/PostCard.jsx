import React, {Component, PropTypes} from 'react';
import Util from '../../Util.jsx';
import {Lib} from '../../../lib.jsx';

export default class PostCard extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  };

  render() {
    let {
      title,
      excerpt,
      image_src,
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
            <img src={image_src} alt={title} className="img-fluid"/>
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
