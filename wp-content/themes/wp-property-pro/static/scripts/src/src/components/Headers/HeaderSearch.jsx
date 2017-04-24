import React, {Component, PropTypes} from 'react';
import {browserHistory} from 'react-router';
import SearchFilters from './components/SearchFilters.jsx';
import {Lib} from '../../lib.jsx';
import _ from 'lodash';

class HeaderSearch extends Component {
  static propTypes = {
    searchFilters: PropTypes.object.isRequired,
    openUserPanel: PropTypes.func.isRequired
  };

  render() {
    let {
      searchFilters
    } = this.props;
    let saleType = searchFilters['sale_type'];
    return (
      <div className="container-fluid">
        <div className="row">
          <div className={Lib.THEME_CLASSES_PREFIX + "logo"}>
            {
              _.get(bundle, 'logos.square_logo', null)
                ?
                <a href={_.get(bundle, 'site_url', '')} onClick={(eve) => {
                  eve.preventDefault();
                  browserHistory.push('')
                }} title={_.get(bundle, 'site_name', '')}>
                  <img src={bundle.logos.square_logo} alt={_.get(bundle, 'site_name', '')}
                       className={`${Lib.THEME_CLASSES_PREFIX}logo ${Lib.THEME_CLASSES_PREFIX}square-logo`}/>
                </a>
                : null
            }
          </div>
          <span className={Lib.THEME_CLASSES_PREFIX + "drop-nav"}>
              <a href="#">{saleType} <i className="fa fa-caret-down"></i></a>
            </span>
          <SearchFilters filters={searchFilters}/>
          <div className={Lib.THEME_CLASSES_PREFIX + "top-nav-bar"}>
            <ul>
              <li><a href="#" title="Favorites" className={Lib.THEME_CLASSES_PREFIX + "favorite"}><i
                className="fa fa-heart"></i></a></li>
              <li><a href="#" title="Notification" className={Lib.THEME_CLASSES_PREFIX + "notification"}><i
                className="fa fa-bell"></i> <span className={Lib.THEME_CLASSES_PREFIX + "indicator"}><i
                className="fa fa-circle"></i></span></a></li>
              <li><a href="#" onClick={this.props.openUserPanel}
                     className={Lib.THEME_CLASSES_PREFIX + "side-navigation"}><span>☰</span></a></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default HeaderSearch;
