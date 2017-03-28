import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import {browserHistory} from 'react-router';
import SearchFilters from './components/SearchFilters.jsx';
import {Lib} from '../../lib.jsx';

class HeaderSearch extends Component {
  static propTypes = {
    searchTerm: PropTypes.string,
    searchFilters: PropTypes.object.isRequired
  };
  render() {
    let {
      searchFilters
    } = this.props;
    let saleType = searchFilters['wpp_search[sale_type]'];
    return (
      <section className={Lib.THEME_CLASSES_PREFIX+"top-panel"}>
        <div className="container-fluid">
          <div className="row">
            <div className={Lib.THEME_CLASSES_PREFIX+"logo"}>
              {
                _.get(bundle, 'logos.square_logo', null)
                  ?
                  <a href={bundle.site_url} onClick={(eve) => {eve.preventDefault();browserHistory.push('')}} title={bundle.site_name}>
                    <img src={bundle.logos.square_logo} alt={bundle.site_name} className={`${Lib.THEME_CLASSES_PREFIX}logo ${Lib.THEME_CLASSES_PREFIX}square-logo`} />
                  </a>
                  : null
              }
            </div>
            <span className={Lib.THEME_CLASSES_PREFIX+"drop-nav"}>
              <a href="#">{saleType} <i className="fa fa-caret-down"></i></a>
            </span>
            <SearchFilters filters={searchFilters} />
            <div className={Lib.THEME_CLASSES_PREFIX+"top-nav-bar"}>
              <ul>
                <li><a href="#" title="Favorites" className={Lib.THEME_CLASSES_PREFIX+"favorite"}><i className="fa fa-heart"></i></a></li>
                <li><a href="#" title="Notification" className={Lib.THEME_CLASSES_PREFIX+"notification"}><i className="fa fa-bell"></i> <span className={Lib.THEME_CLASSES_PREFIX+"indicator"}><i className="fa fa-circle"></i></span></a></li>
                <li><a href="#" onClick={this.props.openUserPanel} className={Lib.THEME_CLASSES_PREFIX+"side-navigation"}><span>☰</span></a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default HeaderSearch;
