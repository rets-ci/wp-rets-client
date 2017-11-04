import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router';
import Util from '../../Util.jsx';
import {Lib} from '../../../lib.jsx';
import isEmpty from 'lodash/isEmpty';

class PostCard extends Component {

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
            this.props.history.push(relative_url);
          }
          }>
            <img src={image_src} alt={isEmpty(image_alt) ? image_title : image_alt} className="img-fluid"/>
          </a>
        </div>
        <div className="card-block p-0">
          <header className={Lib.THEME_CLASSES_PREFIX+"post-header"}>
            <h5 className={`card-title ${Lib.THEME_CLASSES_PREFIX}post-title`}>
              <a href={url} onClick={(e) => {
                e.preventDefault();
                this.props.history.push(relative_url);
              }
              }>{title}</a>
            </h5>
          </header>
          <p className={`card-text ${Lib.THEME_CLASSES_PREFIX}post-card-text`}>{excerpt}</p>
        </div>
      </section>
    );
  }
}

PostCard.propTypes = {
  data: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(PostCard);
