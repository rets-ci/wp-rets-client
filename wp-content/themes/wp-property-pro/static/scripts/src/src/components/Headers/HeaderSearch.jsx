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
      <div>
        {/* <div className={`row ${Lib.THEME_CLASSES_PREFIX}sale-type-selection`} style={{backgroundColor: '#d03528'}}>
          <div className="col-md-3">
            <img src={bundle.static_images_url + "buy-icon.svg"} alt="Buy"/>
      			<p>Buy</p>
          </div>
          <div className="col-md-3">
            <img src={bundle.static_images_url + "rent-icon.svg"} alt="Rent"/>
            <p>Rent</p>
          </div>
          <div className="col-md-3">
            <img src={bundle.static_images_url + "commercial-icon.svg"} alt="Commercial"/>
            <p>Commercial</p>
          </div>
          <div className="col-md-3">
            <img src={bundle.static_images_url + "land-icon.svg"} alt="Land"/>
            <p>Land</p>
          </div>
        </div> */}
        <section className={`${Lib.THEME_CLASSES_PREFIX}toolbar ${Lib.THEME_CLASSES_PREFIX}header-search-section row`} >
          <div className={Lib.THEME_CLASSES_PREFIX + "logo col-sm-1"}>
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
          <div className={Lib.THEME_CLASSES_PREFIX + "col-sm-2 hidden-xs-down"}>
            <div className={Lib.THEME_CLASSES_PREFIX + "drop-nav"}>
              <a href="#">{saleType} <i className="fa fa-caret-down"></i></a>
            </div>
          </div>
          <div className={Lib.THEME_CLASSES_PREFIX+"search-box-wrap col-md-6 hidden-sm-down"}>
            <SearchFilters filters={searchFilters}/>
          </div>
          <div className={Lib.THEME_CLASSES_PREFIX + "top-nav-bar col-md-3"}>
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
        </section>
      </div>
    );
  }
}

export default HeaderSearch;
