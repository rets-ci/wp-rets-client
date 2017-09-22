import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Lib} from '../../../lib.jsx';
import get from 'lodash/get';

class ArticleCard extends Component {
  static propTypes = {
    article: PropTypes.object,
    historyPush: PropTypes.func.isRequired,
    last: PropTypes.bool
  };

  render() {

    let sectionClasses = `${Lib.THEME_CLASSES_PREFIX}article-card ${Lib.THEME_CLASSES_PREFIX}guide-item`;

    if (this.props.last) {
      sectionClasses += ` ${Lib.THEME_CLASSES_PREFIX}last`;
    }

    return (
      <section className={sectionClasses}>
        <div className="container-fluid p-0">
          <div className="row no-gutters">
            <div className="col-sm-8">
              <div className={Lib.THEME_CLASSES_PREFIX + "article-card-content"}>
                <header className={Lib.THEME_CLASSES_PREFIX + "article-header"}>
                  {
                    get(this.props.article, 'title', null)
                      ? <h2 className={Lib.THEME_CLASSES_PREFIX + "article-title"}><a
                        href={get(this.props.article, 'url', '')} onClick={(eve) => {
                        eve.preventDefault();
                        historyPush(get(this.props.article, 'relative_url', ''));
                      }}>{get(this.props.article, 'title')}</a></h2>
                      : null
                  }
                  {
                    get(this.props.article, 'excerpt', null)
                      ? <p
                        className={Lib.THEME_CLASSES_PREFIX + "article-excerpt"}>{get(this.props.article, 'excerpt')}</p>
                      : null
                  }
                </header>
              </div>
            </div>
            <div className="col-sm-4">
              {
                get(this.props.article, 'image_src', null)
                  ?
                  <div style={{
                    background: "url(" + get(this.props.article, 'image_src') + ") 50% 50% no-repeat"
                  }} className={Lib.THEME_CLASSES_PREFIX + "guide-item-img"}></div>
                  : null
              }
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default ArticleCard;
