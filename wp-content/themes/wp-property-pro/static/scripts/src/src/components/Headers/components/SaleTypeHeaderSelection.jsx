import {Lib} from '../../../lib.jsx';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import qs from 'qs';
import URI from 'urijs';
import Util from '../../Util.jsx';
import get from 'lodash/get';
import pickBy from 'lodash/pickBy';

class SaleTypeHeaderSelection extends Component {
  static propTypes = {
    historyPush: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    closePanel: PropTypes.func.isRequired,
    locationTerm: PropTypes.string,
    termFilters: PropTypes.array
  }

  handleSaleSelectionItemClick = (currentURL, termFilters, locationTerm, searchType, propertyTypeOptions, historyPush) => {
    let searchOptions = Util.getSearchDataFromPropertyTypeOptionsBySearchType(searchType, propertyTypeOptions);
    if (searchOptions.error) {
      // TODO: better handle these types of error
      console.log('%c ' + searchOptions.msg, 'color: #ff0000');
      return;
    }

    let {
      propertyTypes,
      saleType
    } = searchOptions;

    let params = [
      {
        key: 'sale',
        values: [saleType]
      },
      {
        key: 'search',
        values: [searchType]
      },
      ...propertyTypes.map(p => ({key: 'property', values: [p.slug]}))
    ];

    if (locationTerm) {
      //TODO: this need to be handled but we we can't do it without the term type
      // params[Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX]['term'] = [{'wpp_location': locationTerm}];
    } else if (termFilters) {
      params = params.concat(termFilters.map(d => ({key: d.term, values: [d.slug]})));
    }

    let searchURL = Util.createSearchURL('/search', params);
    historyPush(searchURL);
    this.props.closePanel();
  }

  render() {
    let {
      historyPush,
      locationTerm,
      open,
      propertyTypeOptions,
      termFilters
    } = this.props;

    let containerClasses = `${Lib.THEME_CLASSES_PREFIX}sale-type-selection hidden-sm-down`;
    if (!open) {
      containerClasses += ` ${Lib.THEME_CLASSES_PREFIX}remove`;
    }
    return (
      <div className={containerClasses}>
        <div className="container d-flex justify-content-center">
          <div className={`${Lib.THEME_CLASSES_PREFIX}selection-container`}>
            <a href="#" onClick={event => { event.preventDefault(); this.handleSaleSelectionItemClick(this.props.currentURL, termFilters, locationTerm, 'Buy', propertyTypeOptions, historyPush)}}>
              <img src={bundle.static_images_url + "buy-icon-red.svg"} alt="Buy"/>
              <span>Buy</span>
            </a>
          </div>
          <div className={`${Lib.THEME_CLASSES_PREFIX}selection-container`}>
            <a href="#" onClick={event => { event.preventDefault(); this.handleSaleSelectionItemClick(this.props.currentURL, termFilters, locationTerm, 'Rent', propertyTypeOptions, historyPush) }}>
              <img src={bundle.static_images_url + "rent-icon-red.svg"} alt="Rent"/>
              <span>Rent</span>
            </a>
          </div>
          <div className={`${Lib.THEME_CLASSES_PREFIX}selection-container`}>
            <a href="#" onClick={event => { event.preventDefault(); this.handleSaleSelectionItemClick(this.props.currentURL, termFilters, locationTerm, 'Commercial', propertyTypeOptions, historyPush); }}>
              <img src={bundle.static_images_url + "commercial-icon-red.svg"} alt="Commercial"/>
              <span>Commercial</span>
            </a>
          </div>
          <div className={`${Lib.THEME_CLASSES_PREFIX}selection-container`}>
            <a href="#" onClick={event => { event.preventDefault(); this.handleSaleSelectionItemClick(this.props.currentURL, termFilters, locationTerm, 'Land', propertyTypeOptions, historyPush); }}>
              <img src={bundle.static_images_url + "land-icon-red.svg"} alt="Land"/>
              <span>Land</span>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default SaleTypeHeaderSelection;