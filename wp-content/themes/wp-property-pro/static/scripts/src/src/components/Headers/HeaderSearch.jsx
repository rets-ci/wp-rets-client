import React, {Component, PropTypes} from 'react';
import {browserHistory} from 'react-router';
import SearchFilters from './components/SearchFilters.jsx';
import {Lib} from '../../lib.jsx';
import _ from 'lodash';
import URI from 'urijs';

class HeaderSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      saleSelectionOpened: false
    };
  }

  handleSaleSelectionItemClick(event, saleItem) {
    event.preventDefault();
    console.log('sale selection item clicked ', saleItem);
    let url = new URI(window.location.href);
    url.setSearch({[Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + '[sale_type]']: saleItem});
    this.setState({
      saleSelectionOpened: false
    });
    browserHistory.push(decodeURIComponent(url.pathname() + url.search()));
  }

  handleSaleTypeClick(event) {
    console.log('sale type clicked')
    event.preventDefault();
    this.setState({
      saleSelectionOpened: !this.state.saleSelectionOpened
    });
  }

  static propTypes = {
    searchFilters: PropTypes.object.isRequired,
    openUserPanel: PropTypes.func.isRequired
  };

  render() {
    let {
      searchFilters
    } = this.props;
    let saleSelectionContainer = {
      backgroundColor: '#d03528'
    };
    if (!this.state.saleSelectionOpened) {
      saleSelectionContainer['display'] = 'none';
    }
    let saleType = searchFilters['sale_type'];
    return (
      <div className={Lib.THEME_CLASSES_PREFIX+"header-search-container"}>
        <div className={`row ${Lib.THEME_CLASSES_PREFIX}sale-type-selection hidden-sm-down`} style={saleSelectionContainer}>
          <div className="col-md-3">
            <a href="#" onClick={event => this.handleSaleSelectionItemClick.bind(this)(event, 'Buy')}>
              <img src={bundle.static_images_url + "buy-icon.svg"} alt="Buy"/>
        			<span>Buy</span>
            </a>
          </div>
          <div className="col-md-3">
            <a href="#" onClick={event => this.handleSaleSelectionItemClick.bind(this)(event, 'Rent')}>
              <img src={bundle.static_images_url + "rent-icon.svg"} alt="Rent"/>
              <span>Rent</span>
            </a>
          </div>
          <div className="col-md-3">
            <a href="#" onClick={event => this.handleSaleSelectionItemClick.bind(this)(event, 'Commercial')}>
              <img src={bundle.static_images_url + "commercial-icon.svg"} alt="Commercial"/>
              <span>Commercial</span>
            </a>
          </div>
          <div className="col-md-3">
            <a href="#" onClick={event => this.handleSaleSelectionItemClick.bind(this)(event, 'Land')}>
              <img src={bundle.static_images_url + "land-icon.svg"} alt="Land"/>
              <span>Land</span>
            </a>
          </div>
        </div>
        <div className={`${Lib.THEME_CLASSES_PREFIX}header-search-navigation row`} >
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
              <a href="#" onClick={this.handleSaleTypeClick.bind(this)}>{saleType} <i className="fa fa-caret-down"></i></a>
            </div>
          </div>
          <div className={Lib.THEME_CLASSES_PREFIX+"search-box-wrap col-md-6 col-sm-6"}>
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
        </div>
      </div>
    );
  }
}

export default HeaderSearch;
