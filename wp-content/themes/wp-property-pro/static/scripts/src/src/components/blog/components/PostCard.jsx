import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import renderHTML from 'react-render-html';
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
      <div className={cardClass}>
        <Link className={`${Lib.THEME_CLASSES_PREFIX}post__image`}
          style={bgStyle}
          to={relative_url}
        />

        <Link className={`${Lib.THEME_CLASSES_PREFIX}post__title`}
          to={relative_url}
        >
          {title}
        </Link>

        <div className={`${Lib.THEME_CLASSES_PREFIX}post__text`}>
          {renderHTML(excerpt)}
        </div>
      </div>
    );
  }
}

PostCard.propTypes = {
  data: PropTypes.object.isRequired,
};

export default PostCard;
