import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import SearchFilters from './components/SearchFilters.jsx';
import {Lib} from '../../lib.jsx';
import {openSaleTypesPanel} from '../../actions/index.jsx';
import _ from 'lodash';
import NavigationIcons from './components/NavigationIcons.jsx';
import URI from 'urijs';
import UserPanelIcon from './components/UserPanelIcon.jsx';

const mapStateToProps = (state, ownProps) => {
  return {
    saleTypesPanelOpen: _.get(state, 'headerSearch.saleTypesPanelOpen', false)
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    doOpenSaleTypesPanel: (open) => {
      dispatch(openSaleTypesPanel(open));
    }
  };
};

class HeaderSearch extends Component {
  constructor(props) {
    super(props);
  }

  handleSaleSelectionItemClick(event, saleItem) {
    event.preventDefault();
    console.log('sale selection item clicked ', saleItem);
    let url = new URI(window.location.href);
    url.setSearch({[Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + '[sale_type]']: saleItem});
    this.props.doOpenSaleTypesPanel(false);
    browserHistory.push(decodeURIComponent(url.pathname() + url.search()));
  }

  handleSaleTypeClick(event) {
    console.log('sale type clicked')
    event.preventDefault();

    this.props.doOpenSaleTypesPanel(!this.props.saleTypesPanelOpen);
  }

  static propTypes = {
    searchFilters: PropTypes.object.isRequired,
    openUserPanel: PropTypes.func.isRequired
  };

  render() {
    let {
      searchFilters
    } = this.props;
    let containerClasses = `row ${Lib.THEME_CLASSES_PREFIX}sale-type-selection hidden-sm-down`;
    if (!this.props.saleTypesPanelOpen) {
      containerClasses += ` ${Lib.THEME_CLASSES_PREFIX}sale-type-selection-hide`;
    }
    let saleType = searchFilters['sale_type'];
    return (
      <div className={Lib.THEME_CLASSES_PREFIX + "header-search-container container-fluid"}>
        <div className={containerClasses}>
          <div className={`col-md-3 ${Lib.THEME_CLASSES_PREFIX}selection-container`}>
            <a href="#" onClick={event => this.handleSaleSelectionItemClick.bind(this)(event, 'Buy')}>
              <img src={bundle.static_images_url + "buy-icon-red.svg"} alt="Buy"/>
              <span>Buy</span>
            </a>
          </div>
          <div className={`col-md-3 ${Lib.THEME_CLASSES_PREFIX}selection-container`}>
            <a href="#" onClick={event => this.handleSaleSelectionItemClick.bind(this)(event, 'Rent')}>
              <img src={bundle.static_images_url + "rent-icon-red.svg"} alt="Rent"/>
              <span>Rent</span>
            </a>
          </div>
          <div className={`col-md-3 ${Lib.THEME_CLASSES_PREFIX}selection-container`}>
            <a href="#" onClick={event => this.handleSaleSelectionItemClick.bind(this)(event, 'Commercial')}>
              <img src={bundle.static_images_url + "commercial-icon-red.svg"} alt="Commercial"/>
              <span>Commercial</span>
            </a>
          </div>
          <div className={`col-md-3 ${Lib.THEME_CLASSES_PREFIX}selection-container`}>
            <a href="#" onClick={event => this.handleSaleSelectionItemClick.bind(this)(event, 'Land')}>
              <img src={bundle.static_images_url + "land-icon-red.svg"} alt="Land"/>
              <span>Land</span>
            </a>
          </div>
        </div>
        <div className={`${Lib.THEME_CLASSES_PREFIX}header-search-navigation row`}>
          <div className={`col-1 hidden-md-up ${Lib.THEME_CLASSES_PREFIX}navigation-menu-left`}>
            <UserPanelIcon openUserPanel={this.props.openUserPanel} />
          </div>
          <div className={`${Lib.THEME_CLASSES_PREFIX}logo col-2 col-md-2 col-lg-1 my-auto`}>
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
          <div className={`hidden-sm-down col-md-2 ${Lib.THEME_CLASSES_PREFIX}drop-nav`}>
            <a href="#" onClick={this.handleSaleTypeClick.bind(this)}>{saleType} <i className="fa fa-caret-down"></i></a>
          </div>
          <div className={Lib.THEME_CLASSES_PREFIX + "search-box-wrap col-7 col-md-6 col-lg-7"}>
            <SearchFilters filters={searchFilters} />
          </div>
          <div className={Lib.THEME_CLASSES_PREFIX + "top-nav-bar col-2 col-md-2"}>
            <NavigationIcons openUserPanel={this.props.openUserPanel} />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderSearch);
