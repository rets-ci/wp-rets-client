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
      <section className={`card ${Lib.THEME_CLASSES_PREFIX}post-item border-0`}>
        <div className={`card-img-top ${Lib.THEME_CLASSES_PREFIX}post-image`}>
          <a href={url} title={title} onClick={(e) => {
            e.preventDefault();
            Util.goToUrl(relative_url);
          }
          }>
            <img src={image_src} alt={_.isEmpty(image_alt) ? image_title : image_alt} className="img-fluid"/>
          </a>
        </div>
        <div className="card-block p-0">
          <header className={Lib.THEME_CLASSES_PREFIX+"post-header"}>
            <h5 className={`card-title ${Lib.THEME_CLASSES_PREFIX}post-title`}>
              <a href={url} onClick={(e) => {
                e.preventDefault();
                Util.goToUrl(relative_url);
              }
              }>{title}</a>
            </h5>
          </header>
          <p className="card-text">{excerpt}</p>
        </div>
      </section>
    );
  }
}
