import PropTypes from 'prop-types';
import React, {Component} from 'react';
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
    front_page_post_content: ownProps.front_page_post_content,
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

let origUrl = null;

class HeaderSearch extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    origUrl = window.location.href;
  }

  handleSaleSelectionItemClick(event, saleItem) {
    event.preventDefault();

    // Set url to original url, because changing search type should remove all filters
    let url = new URI(origUrl);

    let labelsArr = saleItem.split(Lib.STRING_ARRAY_DELIMITER);
    let saLeType = labelsArr[1];
    let propertyTypes = labelsArr.slice(2).join(Lib.STRING_ARRAY_DELIMITER);

    url.setSearch({
      [Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + '[sale_type]']: saLeType,
      [Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + '[property_types]']: propertyTypes
    });
    this.props.doOpenSaleTypesPanel(false);
    browserHistory.push(decodeURIComponent(url.pathname() + url.search()));
  }

  handleSaleTypeClick(event) {
    event.preventDefault();

    this.props.doOpenSaleTypesPanel(!this.props.saleTypesPanelOpen);
  }

  static propTypes = {
    front_page_post_content: PropTypes.array.isRequired,
    searchFilters: PropTypes.object.isRequired,
    openUserPanel: PropTypes.func.isRequired
  };

  render() {
    let {
      front_page_post_content,
      search_options,
      searchFilters
    } = this.props;
    let containerClasses = `row ${Lib.THEME_CLASSES_PREFIX}sale-type-selection hidden-sm-down`;
    if (!this.props.saleTypesPanelOpen) {
      containerClasses += ` ${Lib.THEME_CLASSES_PREFIX}sale-type-selection-hide`;
    }
    let saleType = searchFilters['sale_type'];
    let propertyTypes = searchFilters['property_types'];
    let options = [];
    let currentFilter = [propertyTypes].join(Lib.STRING_ARRAY_DELIMITER);
    let chosen = null;

    // Build options object for dropDown search type filter and detect chosen type for displaying
    for(let option in search_options ){
      let optionPieces = option.split('-');

      if(_.isEmpty(optionPieces)){
        continue;
      }

      //@TODO hack mapping for values
      let origTitle = optionPieces[0];
      if(optionPieces[0] === 'Sale'){
        optionPieces[0] = 'Buy';
      }

      options[optionPieces[0]] = option;

      // found selected value
      if(currentFilter === [_.slice(optionPieces, 2).join(Lib.STRING_ARRAY_DELIMITER)].join(Lib.STRING_ARRAY_DELIMITER)){
        if(_.isEmpty(chosen)){
          chosen = optionPieces[0];
        }else{
          if(saleType === origTitle){
            chosen = optionPieces[0];
          }
        }
      }
    }

    return (
      <div className={Lib.THEME_CLASSES_PREFIX + "header-search-container"}>
        <div className={containerClasses}>
          <div className={`col-md-3 ${Lib.THEME_CLASSES_PREFIX}selection-container`}>
            <a href="#" onClick={event => this.handleSaleSelectionItemClick.bind(this)(event, _.get(options, 'Buy'))}>
              <img src={bundle.static_images_url + "buy-icon-red.svg"} alt="Buy"/>
              <span>Buy</span>
            </a>
          </div>
          <div className={`col-md-3 ${Lib.THEME_CLASSES_PREFIX}selection-container`}>
            <a href="#" onClick={event => this.handleSaleSelectionItemClick.bind(this)(event, _.get(options, 'Rent'))}>
              <img src={bundle.static_images_url + "rent-icon-red.svg"} alt="Rent"/>
              <span>Rent</span>
            </a>
          </div>
          <div className={`col-md-3 ${Lib.THEME_CLASSES_PREFIX}selection-container`}>
            <a href="#" onClick={event => this.handleSaleSelectionItemClick.bind(this)(event, _.get(options, 'Commercial'))}>
              <img src={bundle.static_images_url + "commercial-icon-red.svg"} alt="Commercial"/>
              <span>Commercial</span>
            </a>
          </div>
          <div className={`col-md-3 ${Lib.THEME_CLASSES_PREFIX}selection-container`}>
            <a href="#" onClick={event => this.handleSaleSelectionItemClick.bind(this)(event, _.get(options, 'Land'))}>
              <img src={bundle.static_images_url + "land-icon-red.svg"} alt="Land"/>
              <span>Land</span>
            </a>
          </div>
        </div>
        <div className={`${Lib.THEME_CLASSES_PREFIX}header-search-navigation row`}>
          <div className={`${Lib.THEME_CLASSES_PREFIX}navigation-menu-left col-1 p-0 hidden-md-up d-flex align-items-center`}>
            <UserPanelIcon openUserPanel={this.props.openUserPanel} />
          </div>
          <div className={`${Lib.THEME_CLASSES_PREFIX}logo col-1 col-md-2 col-lg-1 my-auto p-0`}>
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
          <div className={`hidden-sm-down col-md-2 d-flex justify-content-center align-items-center ${Lib.THEME_CLASSES_PREFIX}drop-nav`}>
            <a href="#" onClick={this.handleSaleTypeClick.bind(this)}>{chosen} <i className="fa fa-caret-down"></i></a>
          </div>
          <div className={Lib.THEME_CLASSES_PREFIX + "search-box-wrap col-10 col-md-7 col-lg-8 d-flex align-items-center"}>
            <SearchFilters filters={searchFilters} front_page_post_content={front_page_post_content} />
          </div>
          <div className={Lib.THEME_CLASSES_PREFIX + "top-nav-bar col-0 col-md-1 d-flex align-items-center justify-content-end"}>
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
