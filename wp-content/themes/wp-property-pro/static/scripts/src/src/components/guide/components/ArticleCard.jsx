import React, {Component, PropTypes} from 'react';
import {Lib} from '../../../lib.jsx';
import _ from 'lodash';

class ArticleCard extends Component {
  static propTypes = {
    article: PropTypes.object
  };

  render() {
    return (
      <section className={`${Lib.THEME_CLASSES_PREFIX}article-card ${Lib.THEME_CLASSES_PREFIX}guide-item`}>
        <div className="col-sm-8">
        <header className={Lib.THEME_CLASSES_PREFIX + "article-header"}>
          {
            _.get(this.props.article, 'title', null)
              ? <h2 className={Lib.THEME_CLASSES_PREFIX + "article-title"}>{_.get(this.props.article, 'title')}</h2>
              : null
          }
          {
            _.get(this.props.article, 'excerpt', null)
              ? <p className={Lib.THEME_CLASSES_PREFIX + "article-excerpt"}>{_.get(this.props.article, 'excerpt')}</p>
              : null
          }
        </header>
        </div>
        {
          _.get(this.props.article, 'image_src', null)
            ? <div className={`col-sm-4 ${Lib.THEME_CLASSES_PREFIX}guide-item-img`}
                   style={{background: `url(${_.get(this.props.article, 'image_src')})`}}></div>
            : null
        }
      </section>
    )
  }
}

export default ArticleCard;
