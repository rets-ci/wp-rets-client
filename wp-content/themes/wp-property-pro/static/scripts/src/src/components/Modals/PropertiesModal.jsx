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

import BuyIcon from '../../../../../images/src/buy-icon-standard.svg';
import RentIcon from '../../../../../images/src/rent-icon-standard.svg';
import CommercialIcon from '../../../../../images/src/commercial-icon-standard.svg';
import LandIcon from '../../../../../images/src/land-icon-standard.svg';

import {difference, isEqual} from 'lodash';

import LocationModal from './LocationModal.jsx';

import SQFT from '../properties/Filters/SQFT.jsx';
import LotSize from '../properties/Filters/LotSize.jsx';

import {browserHistory} from 'react-router';

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
    closeModal: PropTypes.func.isRequired,
    closeLocationModal: PropTypes.func.isRequired,
    doSearch: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    openLocationModal: PropTypes.func.isRequired,
    resultCount: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    resultCountButtonLoading: PropTypes.bool.isRequired,
    propertyTypeOptions: PropTypes.object.isRequired,
    searchFilters: PropTypes.object.isRequired,
    turnOnPropertiesModalModeInLocationModal: PropTypes.func,
    turnOffPropertiesModalModeInLocationModal: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      filters: {},
      locationModalOpen: false,
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
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open !== this.props.open) {
      if (nextProps.open) {
        this.props.turnOnPropertiesModalModeInLocationModal();
        this.setInitialFilters(this.props.searchFilters, defaultFiltervalues);
        let filters = removeDefaultFilters(Object.assign({}, this.state.filters), defaultFiltervalues);
        this.props.doSearch(Object.assign({}, filters));
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
    return !!filters['bathrooms'] || !!filters['sqft'] || !!filters['lotSize'];
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

  handleSearchTypeSelect = (searchType, propertyTypeOptions) => {
    let modifiedSearchType = searchType === 'Buy' ? 'Sale' : searchType;
    let options = propertyTypeOptions[modifiedSearchType];
    let filter = {
      property_type: _.get(options, '[0].property_types'),
      sale_type: _.get(options, '[0].sale_type'),
      search_type: searchType
    };
    let filters = Object.assign({}, this.state.filters, filter);
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

  handleLotSizeSelect = (start, to) => {
    let filter = {
      lotSize: {
        start: start,
        to: to
      }
    };
    let filters = Object.assign({}, this.state.filters, filter);
    this.setState({filters: filters});
  }

  handlePropertyTypeToggle = val => {
    let filters = Object.assign({}, this.state.filters);
    // we check whether property_type exists for cases where all property types have been removed by the user
    let propertyTypeArray = filters.property_type ? filters.property_type.slice(0) : [];
    if (propertyTypeArray.indexOf(val) >= 0) {
      propertyTypeArray = difference(propertyTypeArray, [val]);
    } else {
      propertyTypeArray.push(val);
    }
    filters.property_type = propertyTypeArray;
    this.setState({filters: filters});
    
  }

  handleTermFilterRemove = filter => {
    let filterToRemove = {[filter.tax]: filter.value};
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
    let searchResultURL = '/' + _.get(wpp, 'instance.settings.configuration.base_slug');
    let url = new URI();
    // reset URL search to not carry forward curent query params
    url.search("");
    let filters = removeDefaultFilters(this.state.filters, defaultFiltervalues);
    let searchFilters = convertToSearchParamObject(filters);
    let otherFilters = Util.withoutSearchFilters(window.location.href);
    let allFilters = Object.assign({}, otherFilters, searchFilters);
    let queryParam = decodeURIComponent(qs.stringify(allFilters))
    url.setSearch(queryParam);
    this.props.closeModal();
    browserHistory.push(decodeURIComponent(searchResultURL + url.search()));
    
  }

  showFilterBasedOnSaleType(searchType, filter) {
    let filtersSaleTypeMap = {
      'Buy': ['bedrooms', 'bathrooms', 'location', 'lotSize', 'price', 'property_type', 'sqft'],
      'Commercial': ['location', 'lotSize', 'price', 'property_type', 'sqft'],
      'Rent': ['bathrooms', 'bedrooms', 'location', 'lotSize', 'price', 'property_type', 'sqft'],
      'Land': ['location', 'lotSize', 'price', 'property_type']
    };
    if (!filtersSaleTypeMap[searchType]) {
      return false;
    }
    return filtersSaleTypeMap[searchType].indexOf(filter) >= 0;
  }

  toggleViewAllFilters = () => {
    this.setState({
      showAllFilters: !this.state.showAllFilters
    });
  }

  render() {
    let {
      open,
      propertyTypeOptions
    } = this.props;

    let {
      filters: {
        bedrooms,
        bathrooms,
        lotSize,
        price,
        property_type,
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

    let termFilters = [];
    let termFilterElement;
    let termFilter = term;
    if (termFilter && termFilter.length) {
      termFilters = termFilter.map(t => {
        return {tax: Object.keys(t)[0], value: Object.values(t)[0]}
      });
      if (termFilters.length === 1) {
        termFilterElement = <span key={termFilters[0].value} className={`${Lib.THEME_CLASSES_PREFIX}filter-section-button btn btn-primary selected`}>
          <i className="fa fa-times" onClick={() => this.handleLastTermRemove({[termFilters[0].tax]: termFilters[0].value})}></i>
          <span>{termFilters[0].value}</span>
        </span>;
      } else {
        termFilterElement = termFilters.map((t, i) =>
          <span key={t.value} className={`${Lib.THEME_CLASSES_PREFIX}filter-section-button btn btn-primary selected`}>
            <i className="fa fa-times" onClick={() => this.handleTermFilterRemove({[t.tax]: t.value})}></i>
            <span>{t.value}</span>
          </span>
        );
      }
    }

    let modifiedSearchType = search_type === 'Buy' ? 'Sale' : search_type;
    let property_types_options = Object.values(_.get(propertyTypeOptions, `[${modifiedSearchType}].property_types`, {})).map(d => ({
      slug: d.slug,
      title: d.title,
      selected: property_type && property_type.indexOf(d.slug) >= 0
    }));
    return (
      <div>
        <LocationModal
          onTermSelect={this.handleTermSelection}
          closeModal={this.handleLocationModalClose}
        />
        <div
          className={`modal ${Lib.THEME_CLASSES_PREFIX}search-modal ${Lib.THEME_CLASSES_PREFIX}advanced-filter ${open ? Lib.THEME_CLASSES_PREFIX + "display" : Lib.THEME_CLASSES_PREFIX + "hide"}`}>
          <div className={`modal-dialog ${Lib.THEME_CLASSES_PREFIX}modal-dialog m-0`} role="document">
            <div className="modal-content">
              <div className={`modal-header ${Lib.THEME_CLASSES_PREFIX}modal-header hidden-md-down`}>
                <div className="container">
                  <div className="d-flex flex-row">
                    <div className="p-2 my-auto">
                      <i className="fa fa-search"></i>
                    </div>
                    <div className="p-2 col-xl-8 col-lg-8 my-auto">
                      <FilterBar
                        deleteSingleLocalFilter={(filterKey) => this.handleSingleFilterRemove(filterKey, defaultFiltervalues)}
                        deleteLocalFilterTerm={this.handleTermFilterRemove}
                        filters={displayedOnFilterBar(this.state.filters, defaultFiltervalues)}
                        deleteLastLocalFilterTerm={this.handleLastTermRemove}
                      />
                    </div>
                    <div className="p-2 my-auto">
                      <a href="#" className="btn-reset" onClick={this.resetFilters}>Reset</a>
                    </div>
                    <div className="p-2 my-auto">
                      <a
                        href="#"
                        className={`btn btn-primary ${Lib.THEME_CLASSES_PREFIX}button ${Lib.THEME_CLASSES_PREFIX}primary-button ${this.props.resultCountButtonLoading ? 'disabled' : ''}`}
                        onClick={this.saveFilters}>
                          {this.props.resultCount ? "View " + this.props.resultCount + " Properties" : "View Properties"}
                      </a>
                    </div>
                    <div className="p-2 my-auto">
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
                </div>
              </div>
              <div className="modal-body p-0">
                <div className={`${Lib.THEME_CLASSES_PREFIX}search-filter-nav hidden-lg-up`}>
                  <div className="row">
                    <div className="card col-3">
                      <div className="card-img-top mt-4 text-center">
                      <BuyIcon className={`icon-group ${search_type === 'Buy' ? 'selected' : ''}`} onClick={() => this.handleSearchTypeSelect('Buy', this.props.propertyTypeOptions)} />
                      </div>
                      <div className="card-block">
                        <h3 className={`card-text text-center ${Lib.THEME_CLASSES_PREFIX}sale-selection-text`}>Buy</h3>
                      </div>
                    </div>
                    <div className="card col-3">
                      <div className="card-img-top mt-4 text-center">
                        <RentIcon className={`icon-group ${search_type === 'Rent' ? 'selected' : ''}`} onClick={() => this.handleSearchTypeSelect('Rent', this.props.propertyTypeOptions)} />
                      </div>
                      <div className="card-block">
                        <h3 className={`card-text text-center ${Lib.THEME_CLASSES_PREFIX}sale-selection-text`}>Rent</h3>
                      </div>
                    </div>
                    <div className="card col-3">
                      <div className="card-img-top mt-4 text-center">
                        <CommercialIcon className={`icon-group ${search_type === 'Commercial' ? 'selected' : ''}`} onClick={() => this.handleSearchTypeSelect('Commercial', this.props.propertyTypeOptions)} />
                      </div>
                      <div className="card-block">
                        <h3 className={`card-text text-center ${Lib.THEME_CLASSES_PREFIX}sale-selection-text`}>Commercial</h3>
                      </div>
                    </div>
                    <div className="card col-3">
                      <div className="card-img-top mt-4 text-center">
                        <LandIcon className={`icon-group ${search_type === 'Land' ? 'selected' : ''}`} onClick={() => this.handleSearchTypeSelect('Land', this.props.propertyTypeOptions)} />
                      </div>
                      <div className="card-block">
                        <h3 className={`card-text text-center ${Lib.THEME_CLASSES_PREFIX}sale-selection-text`}>Land</h3>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={Lib.THEME_CLASSES_PREFIX + "search-modal-box"}>
                  <div className="container">
                    {this.showFilterBasedOnSaleType(search_type, 'location') ?
                      <div className="row">
                        <div className={`col-12 ${Lib.THEME_CLASSES_PREFIX}filter-section`}>
                          <h3>Location <span>(City, School, Neighborhood, Zip)</span></h3>
                          <div className="filter-type">
                            {termFilterElement}
                            <a href="#" className={`${Lib.THEME_CLASSES_PREFIX}filter-section-button btn btn-primary`}
                              onClick={this.props.openLocationModal}>+ More Locations</a>
                          </div>
                        </div>
                      </div>
                    : null}
                    {this.showFilterBasedOnSaleType(search_type, 'bedrooms') ?
                      <div className="row">
                        <div className={`col-12 ${Lib.THEME_CLASSES_PREFIX}filter-section`}>
                          <h3>Bedrooms <span>(Minimum)</span></h3>
                          {bedroomElements.map(d =>
                            <a key={d.value} href="#"
                              className={`btn btn-primary ${Lib.THEME_CLASSES_PREFIX}filter-section-button ${(d.selected ? "selected" : null)}`}
                              onClick={() => this.handleBedroomSelect(d.value)}>{d.name}</a>
                          )}
                        </div>
                      </div>
                    : null}
                    {this.showFilterBasedOnSaleType(search_type, 'price') ?
                      <div className="row">
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
                    : null}
                    {this.showFilterBasedOnSaleType(search_type, 'bathrooms') ?
                      <div className="row">
                        <div className={`col-12 ${Lib.THEME_CLASSES_PREFIX}filter-section`}
                            style={{display: showAllFilters ? 'block' : 'none'}}>
                          <h3>Bathrooms <span>(Minimum)</span></h3>
                          {bathroomElements.map(d =>
                            <a key={d.value} href="#"
                              className={`${Lib.THEME_CLASSES_PREFIX}filter-section-button btn btn-primary ${(d.selected ? "selected" : null)}`}
                              onClick={() => this.handleBathroomSelect(d.value)}>{d.name}</a>
                          )}
                        </div>
                      </div>
                    : null}
                    {this.showFilterBasedOnSaleType(search_type, 'sqft') ?
                      <div className="row">
                        <div
                          className={`col-12 ${Lib.THEME_CLASSES_PREFIX}filter-section ${Lib.THEME_CLASSES_PREFIX}filter-slider ${Lib.THEME_CLASSES_PREFIX}filter-section-total-size`}
                          style={{display: showAllFilters ? 'block' : 'none'}}>
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
                    : null}
                    {this.showFilterBasedOnSaleType(search_type, 'lotSize') ?
                      <div className="row">
                        <div
                          className={`col-12 ${Lib.THEME_CLASSES_PREFIX}filter-section ${Lib.THEME_CLASSES_PREFIX}filter-slider ${Lib.THEME_CLASSES_PREFIX}filter-section-total-size`}
                          style={{display: showAllFilters ? 'block' : 'none'}}>
                          <h3>Lot Size <span>(Acres)</span></h3>
                          <div>
                            {search_type && lotSize.start && lotSize.to ?
                              <LotSize saleType={search_type} start={lotSize.start}
                                      to={lotSize.to} handleOnClick={this.handleLotSizeSelect}/>
                              : null}
                          </div>
                          <input id="priceSlider" className={`${Lib.THEME_CLASSES_PREFIX}hidden-input bs-hidden-input`}/>
                        </div>
                      </div>
                    : null}
                    {this.showFilterBasedOnSaleType(search_type, 'property_type') ?
                      <div className="row">
                        <div
                          className={`col-12 ${Lib.THEME_CLASSES_PREFIX}filter-section`}
                          style={{display: showAllFilters ? 'block' : 'none'}}>
                          <h3>Type</h3>
                          <div className="filter-type">
                            {property_types_options.map(d =>
                              <a
                                key={d.slug}
                                href="#"
                                className={`${Lib.THEME_CLASSES_PREFIX}filter-section-button btn btn-primary ${(d.selected ? "selected" : "")}`}
                                onClick={() => this.handlePropertyTypeToggle(d.slug)}>{d.title}</a>
                            )}
                          </div>
                        </div>
                      </div>
                    : null}
                    <div className="row">
                      {showAllFilters ?
                        <div className="col-7">
                          <a href="#" className={Lib.THEME_CLASSES_PREFIX + "view-link"}
                            onClick={this.toggleViewAllFilters}>- View Less Filters</a>
                        </div>
                        :
                        <div className="col-7">
                          <a href="#" className={Lib.THEME_CLASSES_PREFIX + "view-link"}
                            onClick={this.toggleViewAllFilters}>+ View More Filters</a>
                        </div>
                      }
                    </div>
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