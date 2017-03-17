import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import {browserHistory} from 'react-router';
import {Lib} from '../../lib.jsx';

class HeaderSearch extends Component {
  static propTypes = {
    searchTerm: PropTypes.string
  };
  render() {
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
              <a href="#">Rent <i className="fa fa-caret-down"></i></a>
            </span>
            <div className={Lib.THEME_CLASSES_PREFIX+"search-box-wrap"}>
              <form method="get" className="clearfix hidden-md-down">
                <div className={Lib.THEME_CLASSES_PREFIX+"bs-tags-box"}>
                  <div className={Lib.THEME_CLASSES_PREFIX+"bs-tags-input"}>
                    <span className={`${Lib.THEME_CLASSES_PREFIX}tag badge badge-default`}><span><i className="fa fa-times"></i></span> {this.props.searchTerm}</span>
                    <span className={`${Lib.THEME_CLASSES_PREFIX}tag badge badge-default ${Lib.THEME_CLASSES_PREFIX}addfilter`}><a href="#"><span>+</span> Bedroom</a></span>
                    <span className={`${Lib.THEME_CLASSES_PREFIX}tag badge badge-default ${Lib.THEME_CLASSES_PREFIX}addfilter`}><a href="#"><span>+</span> Price</a></span>
                    <span className={`${Lib.THEME_CLASSES_PREFIX}tag badge badge-default ${Lib.THEME_CLASSES_PREFIX}addfilter`}><a href="#"><span>+</span> More Filters</a></span>
                    <input type="text" size="1" placeholder="" />
                  </div>
                </div>
                <input type="text" defaultValue="Raleigh,Raleigh2" data-role="tagsinput" className={Lib.THEME_CLASSES_PREFIX+"tagsinput"} />
                <i className="fa fa-search"></i>
              </form>
            </div>
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
