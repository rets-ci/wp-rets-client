import React, {Component, PropTypes} from 'react';
import Util from '../../Util.jsx';
import {Lib} from '../../../lib.jsx';
import _ from 'lodash';

class CategoryCard extends Component {
  static propTypes = {
    category: PropTypes.object,
    last: PropTypes.bool
  };

  render() {
    let sectionClasses = `${Lib.THEME_CLASSES_PREFIX}category-card ${Lib.THEME_CLASSES_PREFIX}guide-item`;

    if(this.props.last){
      sectionClasses += ` ${Lib.THEME_CLASSES_PREFIX}last`;
    }

    return (
      <section className={sectionClasses}>
        <div className="row no-gutters">
          <div className="col-sm-8">
            <div className={Lib.THEME_CLASSES_PREFIX+"category-card-content"}>
              <header className={Lib.THEME_CLASSES_PREFIX + "category-header"}>
                {
                  _.get(this.props.category, 'title', null)
                    ? <h2 className={Lib.THEME_CLASSES_PREFIX + "category-title"}><a
                      href={_.get(this.props.category, 'url', '')} onClick={(eve) => {
                      eve.preventDefault();
                      Util.goToUrl(_.get(this.props.category, 'relative_url', ''));
                    }}>{_.get(this.props.category, 'title')}</a></h2>
                    : null
                }
              </header>
              {
                _.get(this.props.category, 'children', null)
                  ?
                  <nav className={Lib.THEME_CLASSES_PREFIX + "category-navigation"}>
                    <ul>
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
                    </ul>
                  </nav>
                  : null
              }
            </div>
          </div>
          <div className="col-sm-4">
            {
              _.get(this.props.category, 'image_src', null)
                ? <div style={{
                  background: "url("+_.get(this.props.category, 'image_src')+") 50% 50% no-repeat"
                }} className={Lib.THEME_CLASSES_PREFIX + "guide-item-img"}></div>

                : null
            }
          </div>
        </div>
      </section>
    )
  }
}

export default CategoryCard;
