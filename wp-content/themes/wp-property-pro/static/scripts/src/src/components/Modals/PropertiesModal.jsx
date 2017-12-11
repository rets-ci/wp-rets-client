import FilterBar from './components/FilterBar.jsx';
import React, {Component} from 'react';
import {Lib} from '../../lib.jsx';
import Price from '../properties/Filters/Price.jsx';
import PropTypes from 'prop-types';
import {
  bathroom as bathroomOptions,
  bedroom as bedroomOptions,
  defaultPropertyFilters as defaultFiltervalues
} from '../staticFilters.js';

import BuyIcon from 'public_assets/icon-residential-house.svg';
import RentIcon from 'public_assets/icon-residential-apartment.svg';
import CommercialIcon from 'public_assets/icon-commercial-retail.svg';
import LandIcon from 'public_assets/icon-land-wooded.svg';

import difference from 'lodash/difference';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

import LocationModal from './LocationModal.jsx';

import SQFT from '../properties/Filters/SQFT.jsx';
import LotSize from '../properties/Filters/LotSize.jsx';
import GroupTransition from '../GroupTransition.jsx';

import qs from 'qs';
import URI from 'urijs';
import Util from '../Util.jsx';

let convertToSearchParamObject = obj => {
  let searchObject = {};
  for (var k in obj) {
    searchObject[Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + "[" + k + "]"] = obj[k];
  }
  return searchObject;
};

function removeDefaultFilters(filters, defaults) {
  var finalObj = {};
  for (var k in filters) {
    if (!defaults[k] || !isEqual(defaults[k], filters[k])) {
      finalObj[k] = filters[k];
    }
  }
  return finalObj;
}

function displayedOnFilterBar(filters, defaults) {
  return removeDefaultFilters(filters, defaults)
}

class PropertiesModal extends Component {
  static propTypes = {
    availableSubTypes: PropTypes.array,
    closeModal: PropTypes.func.isRequired,
    closeLocationModal: PropTypes.func.isRequired,
    doSearch: PropTypes.func.isRequired,
    errorMessage: PropTypes.string,
    getAvailablePropertySubTypes: PropTypes.func.isRequired,
    historyPush: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    openLocationModal: PropTypes.func.isRequired,
    resultCount: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    resultCountButtonLoading: PropTypes.bool.isRequired,
    propertySubTypes: PropTypes.array.isRequired,
    propertyTypeOptions: PropTypes.array.isRequired,
    searchFilters: PropTypes.object.isRequired,
    turnOnPropertiesModalModeInLocationModal: PropTypes.func,
    turnOffPropertiesModalModeInLocationModal: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      filters: {},
      showAllFilters: false
    };
  }

  componentDidMount() {
    let {
      searchFilters
    } = this.props;
    let showAllFilters = this.displayAllFilters(searchFilters);
    this.setInitialFilters(searchFilters, defaultFiltervalues);
    this.setState({
      showAllFilters
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.open) {
      if (!isEqual(prevState.filters, this.state.filters)) {
        let filters = removeDefaultFilters(Object.assign({}, this.state.filters), defaultFiltervalues);
        this.props.doSearch(filters);
        this.props.getAvailablePropertySubTypes(Object.assign({}, filters));
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open !== this.props.open) {
      if (nextProps.open) {
        this.props.turnOnPropertiesModalModeInLocationModal();
        this.setInitialFilters(this.props.searchFilters, defaultFiltervalues);
        let filters = removeDefaultFilters(Object.assign({}, this.state.filters), defaultFiltervalues);

        // @TODO Don't send requests in case if just was changed property_type and filters contain old property_type value
        // Maybe issue should be fixed at another place
        // fq.jony@UD
        if(get(this.props, 'searchFilters.property_type') === get(filters, 'property_type')){
          this.props.doSearch(Object.assign({}, filters));
          this.props.getAvailablePropertySubTypes(Object.assign({}, filters));
        }

        let showAllFilters = this.displayAllFilters(this.props.searchFilters);
        this.setState({
          showAllFilters
        });
      } else {
        this.props.turnOffPropertiesModalModeInLocationModal();
      }
    }
  }

  componentWillUnmount() {
    this.props.turnOffPropertiesModalModeInLocationModal();
  }

  displayAllFilters(filters) {
    return !!filters['bathrooms'] || !!filters['sqft'] || !!filters['acres'] || !!filters['property_subtype'];
  }

  setInitialFilters(searchFilters, defaultFiltervalues) {
    // if a filter is not set, use it's default.
    let filters = Object.assign({}, defaultFiltervalues, searchFilters);
    this.setState({
      initialFilters: filters,
      filters: filters
    });
  }

  handleBathroomSelect = val => {
    let filter = {"bathrooms": val};
    let filters = Object.assign({}, this.state.filters, filter);
    this.setState({filters: filters});
  }

  handleBedroomSelect = val => {
    let filter = {"bedrooms": val};
    let filters = Object.assign({}, this.state.filters, filter);
    this.setState({filters: filters});
  }

  handleCancel = () => {
    this.resetFilters();
    this.props.closeModal();
  }

  handleDeleteSubPropertyTypeFilter = slug => {
    let filters = Object.assign({}, this.state.filters);
    filters['property_subtype'] = filters['property_subtype'].filter(d => d.slug !== slug);

    // remove property_subtype if none exists
    if (!filters['property_subtype'].length) {
      delete filters['property_subtype'];
    }
    this.setState({filters: filters});
  }


  handlePriceSelect = (start, to) => {
    let filter = {
      price: {
        start: start,
        to: to
      }
    };
    let filters = Object.assign({}, this.state.filters, filter);
    this.setState({filters: filters});
  }

  handleSaleTypeFilterRemove = saleType => {
    let filters = Object.assign({}, this.state.filters);
    filters['sale_type'] = filters['sale_type'].filter(d => d !== saleType);
    this.setState({filters: filters});
  }

  handleSearchTypeSelect = (searchType) => {
    let searchOptions = Util.getSearchDataFromPropertyTypeOptionsBySearchType(searchType, this.props.propertyTypeOptions);
    let property_type = searchOptions.property_type;
    let sale_type = searchOptions.sale_type;
    let searchTypeArray = Util.createSearchTypeArrayParams(property_type, sale_type);
    let searchTypeObject = searchTypeArray.reduce((a, b) => { a[b.key] = b.values[0]; return a; }, {});
    let filters = Object.assign({}, this.state.filters, searchTypeObject);
    this.setState({filters: filters});
  }

  handleSingleFilterRemove = (filterKey, defaults) => {
    let filters = Object.assign({}, this.state.filters);
    if (defaults[filterKey]) {
      filters[filterKey] = defaults[filterKey];
    } else {
      delete filters[filterKey];
    }
    this.setState({filters: filters});
  }

  handleSQFTSelect = (start, to) => {
    let filter = {
      sqft: {
        start: start,
        to: to
      }
    };
    let filters = Object.assign({}, this.state.filters, filter);
    this.setState({filters: filters});
  }

  handleLocationModalClose = () => {
    if (!this.state.filters.term.length) {
      // if all terms were removed, undo the last change
      let filters = Object.assign({}, this.state.filters);
      filters.term.push(this.lastTermFilter);
      this.setState({
        filters: filters
      });
    }

    this.props.closeLocationModal();
  }

  handleAcresSelect = (start, to) => {
    let filter = {
      acres: {
        start: start,
        to: to
      }
    };
    let filters = Object.assign({}, this.state.filters, filter);
    this.setState({filters: filters});
  }

  handlePropertySubTypeToggle = filter => {
    let filters = Object.assign({}, this.state.filters);
    // we check whether property_type exists for cases where all property types have been removed by the user
    let propertySubTypeArray = filters.property_subtype ? filters.property_subtype.slice(0) : [];
    if (propertySubTypeArray.map(d => d.slug).indexOf(filter.slug) >= 0) {
      propertySubTypeArray = propertySubTypeArray.filter(d => d.slug !== filter.slug);
    } else {
      propertySubTypeArray.push(filter);
    }

    // if nothing is left in the filter, delete it
    if (propertySubTypeArray.length) {
      filters.property_subtype = propertySubTypeArray;
    } else {
      delete filters.property_subtype;
    }

    this.setState({filters: filters});

  }

  handleSaleTypeToggle = filter => {
    let filters = Object.assign({}, this.state.filters);
    let saleArray;
    if (!filters.sale_type) {
      saleArray = [];
    } else {
      saleArray = filters.sale_type.slice(0);
    }
    if (saleArray.indexOf(filter.value) >= 0) {
      saleArray = difference(saleArray, [filter.value]);
    } else {
      saleArray.push(filter.value);
    }
    filters.sale_type = saleArray;
    this.setState({filters: filters});
  }

  handleTermFilterRemove = filter => {
    let filters = Object.assign({}, this.state.filters);
    let termFilter = filters.term.slice(0);
    termFilter = termFilter.filter(t => {
      return !isEqual(t, filter);
    });
    filters.term = termFilter;
    this.setState({
      filters: filters
    });
  }

  handleLastTermRemove = filter => {
    this.handleTermFilterRemove(filter);
    // this is for when the last filter is deleted and the location modal, which would be opened as a result, is also closed without choosing another term filter
    this.lastTermFilter = filter;
    this.props.openLocationModal();
  }

  handleTermSelection = filter => {
    let filters = Object.assign({}, this.state.filters);
    // if the term filter is new and it's not one that we already had, then set it
    if (!filters.term.length || filters.term.filter(t => !isEqual(t, filter)).length) {
      let termFilter = filters.term.slice(0);
      termFilter.push(filter);
      filters.term = termFilter;
      this.setState({
        filters: filters
      });
    }
    this.props.closeLocationModal();
  }

  resetFilters = () => {
    this.setState({
      filters: Object.assign({}, this.state.initialFilters)
    });
  }

  saveFilters = () => {
    let filters = Object.assign({}, this.state.filters);
    if (filters['property_subtype']) {
      filters['property_subtype'] = filters['property_subtype'].map(d => d.slug);
    }
    filters = removeDefaultFilters(filters, defaultFiltervalues);
    let reddoorTermObjects = Util.reddoorConvertToURLTerms(filters.term.slice(0));
    delete filters.term;
    delete filters['selected_property'];
    delete filters[Lib.BOTTOM_RIGHT_URL_PREFIX];
    delete filters[Lib.TOP_LEFT_URL_PREFIX];
    delete filters['search_type'];
    filters = Util.customFormatToSearchObject(filters);
    let collection = Util.searchObjectToCollection(filters);
    collection = collection.concat(reddoorTermObjects);
    let searchURL = Util.createSearchURL('/search', collection.map(a => Object.assign({}, a)));
    this.props.closeModal();
    this.props.historyPush(searchURL);
  }

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate = (
      !isEqual(nextProps.availableSubTypes, this.props.availableSubTypes) ||
      !isEqual(nextProps.errorMessage, this.props.errorMessage) ||
      !isEqual(nextProps.open, this.props.open) ||
      !isEqual(nextProps.resultCount, this.props.resultCount) ||
      !isEqual(nextProps.resultCountButtonLoading, this.props.resultCountButtonLoading) ||
      !isEqual(nextProps.propertySubTypes, this.props.propertySubTypes) ||
      !isEqual(nextProps.propertyTypeOptions, this.props.propertyTypeOptions) ||
      !isEqual(nextProps.searchFilters, this.props.searchFilters) ||
      !isEqual(nextState.filters, this.state.filters) ||
      !isEqual(nextState.showAllFilters, this.state.showAllFilters)
    );
    return shouldUpdate;
  }

  showFilterBasedOnSearchType(searchType, filter) {
    let filtersSearchTypeMap = {
      'Buy': ['bedrooms', 'bathrooms', 'location', 'acres', 'price', 'property_subtype', 'sqft'],
      'Commercial': ['location', 'acres', 'price', 'property_subtype', 'sale_type', 'sqft'],
      'Rent': ['bathrooms', 'bedrooms', 'location', 'acres', 'price', 'property_subtype'],
      'Land': ['location', 'acres', 'price', 'property_subtype', 'sale_type']
    };
    if (!filtersSearchTypeMap[searchType]) {
      return false;
    }
    return filtersSearchTypeMap[searchType].indexOf(filter) >= 0;
  }

  toggleViewAllFilters = () => {
    this.setState({
      showAllFilters: !this.state.showAllFilters
    });
  }

  render() {
    let {
      availableSubTypes,
      open,
      propertySubTypes,
      propertyTypeOptions
    } = this.props;

    let {
      filters: {
        acres,
        bedrooms,
        bathrooms,
        price,
        property_subtype,
        sale_type,
        search_type,
        sqft,
        term
      },
      showAllFilters
    } = this.state;
    let bathroomElements = bathroomOptions.map(d => ({
      name: d.name,
      selected: d.value === bathrooms,
      value: d.value
    }));

    let bedroomElements = bedroomOptions.map(d => ({
      name: d.name,
      selected: d.value === bedrooms,
      value: d.value
    }));
    let saleType = sale_type;
    let saleTypeOptions = [];
    if (['Commercial', 'Land'].indexOf(search_type) >= 0) {
      saleTypeOptions = [{
        selected: saleType && saleType.indexOf('sale') >= 0,
        title: 'Sale',
        value: 'sale'
      }, {
        selected: saleType && saleType.indexOf('rent') >= 0,
        title: 'Rent',
        value: 'rent'
      }];
    }

    let termFilters = term;
    let termFilterElement;
    if (termFilters && termFilters.length) {
      if (termFilters.length === 1) {
        termFilterElement = <span key={JSON.stringify(termFilters[0])} className={`${Lib.THEME_CLASSES_PREFIX}filter-section-button btn btn-primary selected`}>
          <i className="fa fa-times" onClick={() => this.handleLastTermRemove(termFilters[0])}></i>
          <span>{termFilters[0].text || 'loading...'}</span>
        </span>;
      } else {
        termFilterElement = termFilters.map((t, i) =>
          <span key={JSON.stringify(t)} className={`${Lib.THEME_CLASSES_PREFIX}filter-section-button btn btn-primary selected`}>
            <i className="fa fa-times" onClick={() => this.handleTermFilterRemove(t)}></i>
            <span>{t.text || 'loading...'}</span>
          </span>
        );
      }
    }
    let propertySubtypeOptions = propertySubTypes.map(d => ({
      count: !availableSubTypes ? null : (availableSubTypes.filter(e => e.key === d.slug).length ? availableSubTypes.filter(e => e.key === d.slug)[0].count : 0),
      disabled: !availableSubTypes ? null : availableSubTypes.map(e => e.key).indexOf(d.slug) < 0,
      slug: d.slug,
      title: d.title,
      selected: property_subtype && property_subtype.map(e => e.slug).indexOf(d.slug) >= 0
    }));

    // keep DOM elements of filter options, to be rendered in transition group
    let modalBody = [];
    if (this.showFilterBasedOnSearchType(search_type, 'location')) {
      modalBody.push(
        <div className="row" key="location">
          <div className={`col-12 ${Lib.THEME_CLASSES_PREFIX}filter-section`}>
            <h3>Location <span>(City, School, Neighborhood, Zip)</span></h3>
            <div className="filter-type">
              {termFilterElement}
              <a href="#" className={`${Lib.THEME_CLASSES_PREFIX}filter-section-button btn btn-primary`}
                onClick={this.props.openLocationModal}>+ More Locations</a>
            </div>
          </div>
        </div>
      );
    }
    if (this.showFilterBasedOnSearchType(search_type, 'bedrooms')) {
      modalBody.push(
        <div className="row" key="bedrooms">
          <div className={`col-12 ${Lib.THEME_CLASSES_PREFIX}filter-section`}>
            <h3>Bedrooms <span>(Minimum)</span></h3>
            {bedroomElements.map(d =>
              <a key={d.value} href="#"
                className={`btn btn-primary ${Lib.THEME_CLASSES_PREFIX}filter-section-button ${(d.selected ? "selected" : null)}`}
                onClick={() => this.handleBedroomSelect(d.value)}>{d.name}</a>
            )}
          </div>
        </div>
      );
    }
    if (this.showFilterBasedOnSearchType(search_type, 'price')) {
      modalBody.push(
        <div className="row" key="price">
          <div
            className={`col-12 ${Lib.THEME_CLASSES_PREFIX}filter-section ${Lib.THEME_CLASSES_PREFIX}filter-slider ${Lib.THEME_CLASSES_PREFIX}filter-section-price`}>
            <h3>Price <span>(Range)</span></h3>
            <div>
              {search_type && price.start && price.to ?
                <Price saleType={search_type} start={price.start}
                      to={price.to}
                      handleOnClick={this.handlePriceSelect.bind(this)}/>
                : null}
            </div>
            <input id="priceSlider" className={`${Lib.THEME_CLASSES_PREFIX}hidden-input bs-hidden-input`}/>
          </div>
        </div>
      );
    }
    if (showAllFilters && this.showFilterBasedOnSearchType(search_type, 'bathrooms')) {
      modalBody.push(
        <div className="row" key="bathrooms">
          <div className={`col-12 all-filters ${Lib.THEME_CLASSES_PREFIX}filter-section`}>
            <h3>Bathrooms <span>(Minimum)</span></h3>
            {bathroomElements.map(d =>
              <a key={d.value} href="#"
                className={`${Lib.THEME_CLASSES_PREFIX}filter-section-button btn btn-primary ${(d.selected ? "selected" : null)}`}
                onClick={() => this.handleBathroomSelect(d.value)}>{d.name}</a>
            )}
          </div>
        </div>
      );
    }
    if (showAllFilters && this.showFilterBasedOnSearchType(search_type, 'sqft')) {
      modalBody.push(
        <div className="row" key="total-size">
          <div
            className={`col-12 all-filters ${Lib.THEME_CLASSES_PREFIX}filter-section ${Lib.THEME_CLASSES_PREFIX}filter-slider ${Lib.THEME_CLASSES_PREFIX}filter-section-total-size`}>
            <h3>Total Size <span>(SQFT)</span></h3>
            <div>
              {search_type && sqft.start && sqft.to ?
                <SQFT saleType={search_type} start={sqft.start}
                      to={sqft.to}
                      handleOnClick={this.handleSQFTSelect}/>
                : null}
            </div>
            <input id="priceSlider" className={`${Lib.THEME_CLASSES_PREFIX}hidden-input bs-hidden-input`}/>
          </div>
        </div>
      );
    }
    if (showAllFilters && this.showFilterBasedOnSearchType(search_type, 'acres')) {
      modalBody.push(
        <div className="row" key="lot-size">
          <div
            className={`col-12 all-filters ${Lib.THEME_CLASSES_PREFIX}filter-section ${Lib.THEME_CLASSES_PREFIX}filter-slider ${Lib.THEME_CLASSES_PREFIX}filter-section-total-size`}>
            <h3>Lot Size <span>(Acres)</span></h3>
            <div>
              {search_type && acres.start && acres.to ?
                <LotSize saleType={search_type} start={acres.start}
                        to={acres.to} handleOnClick={this.handleAcresSelect}/>
                : null}
            </div>
            <input id="priceSlider" className={`${Lib.THEME_CLASSES_PREFIX}hidden-input bs-hidden-input`}/>
          </div>
        </div>
      );
    }

    if (showAllFilters && this.showFilterBasedOnSearchType(search_type, 'sale_type')) {
      modalBody.push(
        <div className="row" key="sale_type">
          <div
            className={`col-12 all-filters ${Lib.THEME_CLASSES_PREFIX}filter-section`}>
            <h3>Sale Type</h3>
            <div className="filter-type">
              {saleTypeOptions.map(d => {
                let title = d.title === 'Sale' ? 'Buy' : d.title;
                return (
                  <a
                    key={d.value}
                    href="#"
                    className={`${Lib.THEME_CLASSES_PREFIX}filter-section-button btn btn-primary ${(d.selected ? "selected" : "")}`}
                    onClick={() => this.handleSaleTypeToggle(d)}>{title}</a>
                );
              }
              )}
            </div>
          </div>
        </div>
      );
    }

    if (showAllFilters && this.showFilterBasedOnSearchType(search_type, 'property_subtype')) {
      modalBody.push(
        <div className="row" key="type">
          <div
            className={`col-12 all-filters ${Lib.THEME_CLASSES_PREFIX}filter-section`}>
            <h3>Property Type</h3>
            <div className="filter-type">
              {propertySubtypeOptions.map(d =>
                <a
                  key={d.slug}
                  href="#"
                  className={`${Lib.THEME_CLASSES_PREFIX}filter-section-button btn btn-primary ${(d.selected ? "selected" : (d.disabled !== null && d.disabled ? "disabled" : ""))}`}
                  onClick={() => this.handlePropertySubTypeToggle(d)}>
                    {d.title}
                    {d.count !== null &&
                      <span> ({d.count})</span>
                    }
                  </a>
              )}
            </div>
          </div>
        </div>
      );
    }

    modalBody.push(
      <div className="row" key="view-more">
        <div className={`col-7 ${Lib.THEME_CLASSES_PREFIX}filter-section`}>
          <a href="#" className={Lib.THEME_CLASSES_PREFIX + "view-link"}
            onClick={this.toggleViewAllFilters}>
            { showAllFilters
              ? '- View Less Filters'
              : '+ View More Filters'
            }
          </a>
        </div>
      </div>
    );

    return (
      <div>
        <LocationModal
          terms={get(this, 'state.filters.term', [])}
          onTermSelect={this.handleTermSelection}
          closeModal={this.handleLocationModalClose}
        />
        <div
          className={`modal ${Lib.THEME_CLASSES_PREFIX}search-modal ${Lib.THEME_CLASSES_PREFIX}advanced-filter ${open ? "active" : "remove"}`}>
          <div className={`modal-dialog ${Lib.THEME_CLASSES_PREFIX}modal-dialog m-0`} role="document">
            <div className="modal-content">
              <div className={`modal-header ${Lib.THEME_CLASSES_PREFIX}toolbar ${Lib.THEME_CLASSES_PREFIX}modal-header hidden-md-down`}>
                <div className={`${Lib.THEME_CLASSES_PREFIX}logo`}>
                  <a href={get(bundle, 'site_url', '')}>
                    <img src={bundle.logos.square_logo} alt={get(bundle, 'site_name', '')}
                         className={`${Lib.THEME_CLASSES_PREFIX}logo ${Lib.THEME_CLASSES_PREFIX}square-logo`}/>
                  </a>
                </div>

                <div className={`${Lib.THEME_CLASSES_PREFIX}drop-nav hidden-sm-down`}>
                  <a href="#">{ search_type }</a>
                </div>
                <div className="px-4">
                  <i className="fa fa-search"></i>
                </div>
                <div className={ `${Lib.THEME_CLASSES_PREFIX}flex-wrapper` }>
                  <FilterBar
                    deleteSingleLocalFilter={(filterKey) => this.handleSingleFilterRemove(filterKey, defaultFiltervalues)}
                    deleteLocalFilterTerm={this.handleTermFilterRemove}
                    deleteSubPropertyTypeFilter={this.handleDeleteSubPropertyTypeFilter}
                    filters={displayedOnFilterBar(this.state.filters, defaultFiltervalues)}
                    deleteLastLocalFilterTerm={this.handleLastTermRemove}
                    deleteSaleTypeFilter={this.handleSaleTypeFilterRemove}
                  />
                </div>
                <div className="px-4">
                  <a href="#" className="btn-reset" onClick={this.resetFilters}>Reset</a>
                </div>
                <div>
                  <a
                    href="#"
                    className={`btn btn-primary ${Lib.THEME_CLASSES_PREFIX}button ${Lib.THEME_CLASSES_PREFIX}primary-button ${this.props.resultCountButtonLoading || this.props.errorMessage ? 'disabled' : ''}`}
                    onClick={this.saveFilters}>
                      {this.props.resultCount ? "View " + this.props.resultCount + " Properties" : "View Properties"}
                  </a>
                </div>
                <div className="px-4">
                  <button
                    aria-label="Close"
                    className={`close ${Lib.THEME_CLASSES_PREFIX}close-panel my-auto hidden-md-down`}
                    type="button"
                    onClick={this.handleCancel}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
              </div>
              <div className="modal-body p-0">
                <div className={`${Lib.THEME_CLASSES_PREFIX}search-filter-nav hidden-lg-up`}>
                  <div className="row">
                    <div className="card col-3">
                      <div className="card-img-top mt-4 text-center">
                      <BuyIcon className={`icon-group ${search_type === 'Buy' ? 'selected' : ''}`} onClick={() => this.handleSearchTypeSelect('Buy')} />
                      </div>
                      <div className="card-block">
                        <h3 className={`card-text text-center ${Lib.THEME_CLASSES_PREFIX}sale-selection-text`}>Buy</h3>
                      </div>
                    </div>
                    <div className="card col-3">
                      <div className="card-img-top mt-4 text-center">
                        <RentIcon className={`icon-group ${search_type === 'Rent' ? 'selected' : ''}`} onClick={() => this.handleSearchTypeSelect('Rent')} />
                      </div>
                      <div className="card-block">
                        <h3 className={`card-text text-center ${Lib.THEME_CLASSES_PREFIX}sale-selection-text`}>Rent</h3>
                      </div>
                    </div>
                    <div className="card col-3">
                      <div className="card-img-top mt-4 text-center">
                        <CommercialIcon className={`icon-group ${search_type === 'Commercial' ? 'selected' : ''}`} onClick={() => this.handleSearchTypeSelect('Commercial')} />
                      </div>
                      <div className="card-block">
                        <h3 className={`card-text text-center ${Lib.THEME_CLASSES_PREFIX}sale-selection-text`}>Commercial</h3>
                      </div>
                    </div>
                    <div className="card col-3">
                      <div className="card-img-top mt-4 text-center">
                        <LandIcon className={`icon-group ${search_type === 'Land' ? 'selected' : ''}`} onClick={() => this.handleSearchTypeSelect('Land')} />
                      </div>
                      <div className="card-block">
                        <h3 className={`card-text text-center ${Lib.THEME_CLASSES_PREFIX}sale-selection-text`}>Land</h3>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={Lib.THEME_CLASSES_PREFIX + "search-modal-box"}>
                  <div className="container">
                  { open &&
                      <GroupTransition fromFilterModal>
                      { modalBody }
                      </GroupTransition>
                  }
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <div className={`${Lib.THEME_CLASSES_PREFIX}filter-footernav hidden-lg-up`}>
                  <div className="container">
                    <button
                      className={`${Lib.THEME_CLASSES_PREFIX}button-reset btn btn-reset`}
                      onClick={this.resetFilters}
                      >Reset</button>
                    <span className={`${Lib.THEME_CLASSES_PREFIX}filter-footernav-item-right nav-item-right`}>
                    <a
                      href="#"
                      className="btn-cancel"
                      onClick={this.handleCancel}>Cancel</a>
                        <i>|</i>
                    <a href="#" className="btn-apply" onClick={this.saveFilters}>Apply</a>
                  </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  }
};

export default PropertiesModal;