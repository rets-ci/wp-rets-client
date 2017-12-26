import React, {Component} from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import {Lib} from 'app_root/lib.jsx';


class CategoryCard extends Component {
  static propTypes = {
    category: PropTypes.object,
    historyPush: PropTypes.func.isRequired,
    last: PropTypes.bool
  };

  render() {
    let {
      historyPush
    } = this.props;
    let sectionClasses = `${Lib.THEME_CLASSES_PREFIX}category-card ${Lib.THEME_CLASSES_PREFIX}guide-item`;

    if (this.props.last) {
      sectionClasses += ` ${Lib.THEME_CLASSES_PREFIX}last`;
    }

    return (
      <section className={sectionClasses}>
        <div className="container-fluid p-0">
          <div className="row no-gutters">
            <div className="col-sm-8">
              <div className={Lib.THEME_CLASSES_PREFIX + "category-card-content"}>
                <header className={Lib.THEME_CLASSES_PREFIX + "category-header"}>
                  {
                    get(this.props.category, 'title', null)
                      ? <h2 className={Lib.THEME_CLASSES_PREFIX + "category-title"}><a
                        href={get(this.props.category, 'url', '')} onClick={(eve) => {
                        eve.preventDefault();
                        historyPush(get(this.props.category, 'relative_url', ''));
                      }}>{get(this.props.category, 'title')}</a></h2>
                      : null
                  }
                </header>
                {
                  get(this.props.category, 'children', null)
                    ?
                    <nav className={Lib.THEME_CLASSES_PREFIX + "category-navigation"}>
                      <ul className="list-group">
                        {
                          get(this.props.category, 'children', []).map((item, key) =>
                            get(item, 'title', null) && get(item, 'relative_url', null)
                              ? <li className={`list-group-item ${Lib.THEME_CLASSES_PREFIX}category-navigation-item border-0 p-0`} key={key}><a href={get(item, 'relative_url')} onClick={(eve) => {
                                eve.preventDefault();
                                historyPush(get(item, 'relative_url'));
                              }}>{get(item, 'title')}</a></li>
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
                get(this.props.category, 'image_src', null)
                  ? <div style={{
                    background: "url(" + get(this.props.category, 'image_src') + ") 50% 50% no-repeat"
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

export default CategoryCard;
