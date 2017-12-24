import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import Util from 'app_root/components/Util.jsx';
import {Lib} from 'app_root/lib.jsx';


class PostCard extends Component {

  render() {
    const {
      title,
      excerpt,
      image_src,
      image_title,
      image_alt,
      url,
      relative_url
    } = this.props.data;

    const cardClass = classNames(
      Lib.BLOG_CARD_GRID_CLASS,
      'col-12',
      `${Lib.THEME_CLASSES_PREFIX}post-card`,
    )

    const bgStyle = { backgroundImage: `url(${image_src})`}

    return (
      <section className={cardClass}>
        <a className={`${Lib.THEME_CLASSES_PREFIX}post__image`}
          style={bgStyle}
          href={url}
          title={title}
          onClick={(e) => {
            e.preventDefault();
            this.props.history.push(relative_url);
          }}
        />

        <div>
          <a className={`${Lib.THEME_CLASSES_PREFIX}post__title`}
            href={url}
            onClick={(e) => {
              e.preventDefault();
              this.props.history.push(relative_url);
            }}
          >
            {title}
          </a>
          <p className={`${Lib.THEME_CLASSES_PREFIX}post__text`}>{excerpt}</p>
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
