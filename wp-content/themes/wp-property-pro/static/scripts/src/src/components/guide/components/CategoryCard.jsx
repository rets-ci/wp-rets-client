import React, {Component, PropTypes} from 'react';
import Util from '../../Util.jsx';
import {Lib} from '../../../lib.jsx';
import _ from 'lodash';

class CategoryCard extends Component {
  static propTypes = {
    category: PropTypes.object
  };

  render() {
    return (
      <section className={`${Lib.THEME_CLASSES_PREFIX}category-card ${Lib.THEME_CLASSES_PREFIX}guide-item`}>
        <div className="col-sm-8">
          <header className={Lib.THEME_CLASSES_PREFIX + "category-header"}>
            {
              _.get(this.props.category, 'title', null)
                ? <h2 className={Lib.THEME_CLASSES_PREFIX + "category-title"}><a
                  href={_.get(this.props.category, 'url', '')} onClick={(eve) => {
                  eve.preventDefault();
                  Util.goToUrl(_.get(this.props.category, 'url', ''));
                }}>{_.get(this.props.category, 'title')}</a></h2>
                : null
            }
          </header>
          {
            _.get(this.props.category, 'children', null)
              ?
              <nav className={Lib.THEME_CLASSES_PREFIX + "category-navigation"}>
                <ol>
                  {
                    _.get(this.props.category, 'children', []).map((item, key) =>
                      _.get(item, 'title', null) && _.get(item, 'relative_url', null)
                        ? <li key={key}><a href={_.get(item, 'relative_url')} onClick={(eve) => {
                          eve.preventDefault();
                          Util.goToUrl(_.get(item, 'relative_url'));
                        }}>{_.get(item, 'title')}</a></li>
                        : null
                    )
                  }
                </ol>
              </nav>
              : null
          }
        </div>
        {
          _.get(this.props.category, 'image_src', null)
            ? <div className={`col-sm-4 ${Lib.THEME_CLASSES_PREFIX}guide-item-img`}
                   style={{background: `url(${_.get(this.props.category, 'image_src')})`}}></div>
            : null
        }
      </section>
    )
  }
}

export default CategoryCard;
