import React, {Component, PropTypes} from 'react';
import Util from '../../Util.jsx';
import {Lib} from '../../../lib.jsx';
import _ from 'lodash';

class ArticleCard extends Component {
  static propTypes = {
    article: PropTypes.object
  };

  render() {
    return (
      <section className={`${Lib.THEME_CLASSES_PREFIX}article-card ${Lib.THEME_CLASSES_PREFIX}guide-item`}>
        <div className="row">
        <div className="col-sm-8">
          <header className={Lib.THEME_CLASSES_PREFIX + "article-header"}>
            {
              _.get(this.props.article, 'title', null)
                ? <h2 className={Lib.THEME_CLASSES_PREFIX + "article-title"}><a
                  href={_.get(this.props.article, 'url', '')} onClick={(eve) => {
                  eve.preventDefault();
                  Util.goToUrl(_.get(this.props.article, 'relative_url', ''));
                }}>{_.get(this.props.article, 'title')}</a></h2>
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
            ? <div className="col-sm-4">
              <img className={Lib.THEME_CLASSES_PREFIX + "guide-item-img"} src={_.get(this.props.article, 'image_src')}
                   alt={_.get(this.props.article, 'title', '')}/>
            </div>
            : null
        }
        </div>
      </section>
    )
  }
}

export default ArticleCard;
