import {Lib} from '../../../lib.jsx';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import qs from 'qs';
import URI from 'urijs';
import Util from '../../Util.jsx';

class SaleTypeHeaderSelection extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    closePanel: PropTypes.func.isRequired,
    locationTerm: PropTypes.string
  }

  handleSaleSelectionItemClick = (currentURL, locationTerm, searchType, propertyTypeOptions) => {
    let searchOptions = Util.getSearchDataFromPropertyTypeOptionsBySearchType(searchType === 'Buy' ? 'Sale' : searchType, propertyTypeOptions);
    if (searchOptions.error) {
      // TODO: better handle these types of error
      console.log('%c ' + searchOptions.msg, 'color: #ff0000');
      return;
    }

    let {
      propertyTypes,
      saleType
    } = searchOptions;

    let searchResultURL = '/' + _.get(wpp, 'instance.settings.configuration.base_slug');
    
    let url;

    if (currentURL) {
      url = new URI(currentURL);
    } else {
      url = new URI();
    }
    // reset setSearch
    url.search('');

    let modifiedQueryParams;

    if (currentURL) {
      let allQueryParams = Util.getQS(currentURL, url.search(true));
      modifiedQueryParams = Object.assign({}, allQueryParams);
      // only keep term for now
      modifiedQueryParams[Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX] = _.pickBy(allQueryParams[Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX], (a, b) => {
        return b.includes('term');
      });
    } else {
      modifiedQueryParams = {[Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX]: {}};
    }
    // only keep term for now
    modifiedQueryParams[Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX]['sale_type'] = saleType;
    modifiedQueryParams[Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX]['search_type'] = searchType;
    if (locationTerm) {
      modifiedQueryParams[Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX]['term'] = [{'wpp_location': locationTerm}];
    }
    modifiedQueryParams[Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX]['property_type'] = propertyTypes;
    
    let queryParam = decodeURIComponent(qs.stringify(modifiedQueryParams));
    url.setSearch(queryParam);
    this.props.closePanel();
    browserHistory.push(decodeURIComponent(searchResultURL + url.search()));
  }

  render() {
    let {
      locationTerm,
      open,
      propertyTypeOptions
    } = this.props;

    let containerClasses = `row ${Lib.THEME_CLASSES_PREFIX}sale-type-selection hidden-sm-down`;
    if (!open) {
      containerClasses += ` ${Lib.THEME_CLASSES_PREFIX}sale-type-selection-hide`;
    }
    return (
      <div className={containerClasses}>
        <div className={`col-md-3 ${Lib.THEME_CLASSES_PREFIX}selection-container`}>
          <a href="#" onClick={event => { event.preventDefault(); this.handleSaleSelectionItemClick(this.props.currentURL, locationTerm, 'Buy', propertyTypeOptions)}}>
            <img src={bundle.static_images_url + "buy-icon-red.svg"} alt="Buy"/>
            <span>Buy</span>
          </a>
        </div>
        <div className={`col-md-3 ${Lib.THEME_CLASSES_PREFIX}selection-container`}>
          <a href="#" onClick={event => { event.preventDefault(); this.handleSaleSelectionItemClick(this.props.currentURL, locationTerm, 'Rent', propertyTypeOptions) }}>
            <img src={bundle.static_images_url + "rent-icon-red.svg"} alt="Rent"/>
            <span>Rent</span>
          </a>
        </div>
        <div className={`col-md-3 ${Lib.THEME_CLASSES_PREFIX}selection-container`}>
          <a href="#" onClick={event => { event.preventDefault(); this.handleSaleSelectionItemClick(this.props.currentURL, locationTerm, 'Commercial', propertyTypeOptions); }}>
            <img src={bundle.static_images_url + "commercial-icon-red.svg"} alt="Commercial"/>
            <span>Commercial</span>
          </a>
        </div>
        <div className={`col-md-3 ${Lib.THEME_CLASSES_PREFIX}selection-container`}>
          <a href="#" onClick={event => { event.preventDefault(); this.handleSaleSelectionItemClick(this.props.currentURL, locationTerm, 'Land', propertyTypeOptions); }}>
            <img src={bundle.static_images_url + "land-icon-red.svg"} alt="Land"/>
            <span>Land</span>
          </a>
        </div>
      </div>
    );
  }
}

export default SaleTypeHeaderSelection;