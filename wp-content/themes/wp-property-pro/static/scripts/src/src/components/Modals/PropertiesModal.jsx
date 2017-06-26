import Api from '../../containers/Api.jsx';
import FilterBar from './components/FilterBar.jsx';
import {
  deletePropertiesModalSingleLocalFilter,
  deletePropertiesModalTermLocalFilter,
  openLocationModal,
  openPropertiesModal,
  setPropertiesModalLocalFilter,
  setPropertiesModalResultCountLoading,
  setSearchType,
  updatePropertiesModalLocalFilter,
  updatePropertiesModalResultCount,
  toggleLocationModalSearchMode
} from '../../actions/index.jsx';
import {connect} from 'react-redux';
import {isEqual} from 'lodash';
import {Lib} from '../../lib.jsx';
import Price from '../properties/Filters/Price.jsx';
import {
  bathroom as bathroomOptions,
  bedroom as bedroomOptions,
  defaultPropertyFilters as defaultFiltervalues,
  property_type as propertyTypeOptions
} from '../staticFilters.js';
import SQFT from '../properties/Filters/SQFT.jsx';
import LotSize from '../properties/Filters/LotSize.jsx';
import React, {Component, PropTypes} from 'react';
import {browserHistory} from 'react-router';
import URI from 'urijs';
import Util from '../Util.jsx';
import qs from 'qs';

import BuyIcon from '../../../../../images/src/buy-icon-standard.svg';
import RentIcon from '../../../../../images/src/rent-icon-standard.svg';
import CommercialIcon from '../../../../../images/src/commercial-icon-standard.svg';
import LandIcon from '../../../../../images/src/land-icon-standard.svg';

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

const mapStateToProps = (state, ownProps) => {
  let localFilters = state.propertiesModal.localFilters;
  return {
    bathroomSelected: localFilters.bathrooms || defaultFiltervalues['bathrooms'],
    bedroomSelected: localFilters.bedrooms || defaultFiltervalues['bedrooms'],
    priceSelected: localFilters.price || defaultFiltervalues['price'],
    propertyTypeSelected: localFilters.property_type || '',
    resultCount: state.propertiesModal.resultCount,
    resultCountButtonLoading: state.propertiesModal.resultCountButtonLoading,
    searchMode: state.locationModal.searchMode,
    sqftSelected: localFilters.sqft || defaultFiltervalues['sqft'],
    lotSizeSelected: localFilters.lotSize || defaultFiltervalues['lotsize'],
    localFilters: localFilters
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    disableLocationModalSearchMode() {
      dispatch(toggleLocationModalSearchMode(false));
    },

    enableLocationModalSearchMode() {
      dispatch(toggleLocationModalSearchMode(true));
    },

    openLocationModal(modifyType) {
      // dispatch(openPropertiesModal(false));
      dispatch(openLocationModal(true, modifyType));
    },

    openPropertiesModal(open) {
      dispatch(openPropertiesModal(open));
    },

    deleteLocalFilterTerm(termFilter) {
      dispatch(deletePropertiesModalTermLocalFilter(termFilter));
    },

    deleteSingleLocalFilter(filterKey) {
      dispatch(deletePropertiesModalSingleLocalFilter(filterKey));
    },

    removeLastLocationFilter() {
      // TODO: this function is not pure, make it so by removing its dependency on window
      let {
        labels,
        saleTypes,
        propertyTypes
      } = Util.getSearchTypeParameters(window.bundle);

      dispatch(setSearchType({
        searchType: labels.length ? labels[0] : '',
        saleType: saleTypes.length ? saleTypes[0] : '',
        propertyTypes: propertyTypes.length ? propertyTypes[0] : ''
      }));
      dispatch(openLocationModal(true, 'replace'));
    },

    setLocalFilters(filter) {
      dispatch(setPropertiesModalLocalFilter(filter));
    },

    updatePropertiesModalLocalFilter(filter) {
      // run an ES query and when completed, update the total number of properties
      dispatch(updatePropertiesModalLocalFilter(filter));
    },

    updateResultCount(filters) {
      dispatch(setPropertiesModalResultCountLoading(true));
      Api.makeStandardPropertySearch(filters, (query, response) => {
        dispatch(setPropertiesModalResultCountLoading(false));
        dispatch(updatePropertiesModalResultCount(_.get(response, 'hits.total', null)));
      });
    }
  }
};

class PropertiesModal extends Component {
  static propTypes = {
    bathroomSelected: PropTypes.string,
    bedroomSelected: PropTypes.string,
    openLocationModal: PropTypes.func.isRequired,
    propertyTypeSelected: PropTypes.string,
    localFilters: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      bathroomSelected: props.bathroomSelected,
      bedroomSelected: props.bedroomSelected,
      propertyTypeSelected: props.propertyTypeSelected,
      lotSizeSelected: props.lotSizeSelected,
      showAllFilters: false,
      priceSelected: props.priceSelected,
      sqftSelected: props.sqftSelected
    };
  }

  componentDidMount() {
    let allQueryParams = Util.getQS(window.location.href, this.props.localFilters);
    let searchFiltersFormatted = allQueryParams[Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX];
    this.props.setLocalFilters(searchFiltersFormatted);
    this.props.enableLocationModalSearchMode();
    let showAllFilters = this.displayAllFilters(this.props.localFilters);
    this.setState({
      // note that searchFiltersFormatted is the same as localFilters
      initialFilters: Object.assign({}, searchFiltersFormatted),
      showAllFilters: showAllFilters
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.searchMode) {
      this.props.enableLocationModalSearchMode();
    }
    if (nextProps.localFilters !== this.props.localFilters) {
      let filters = removeDefaultFilters(nextProps.localFilters, defaultFiltervalues);
      this.props.updateResultCount(filters);
    }
    let showAllFilters = this.displayAllFilters(nextProps.localFilters);
    this.setState({
      showAllFilters: showAllFilters,
    });
  }

  componentWillUnmount() {
    // reset local filters
    this.props.disableLocationModalSearchMode();
  }

  displayAllFilters(localFilters) {
    return !!localFilters['bathrooms'] || !!localFilters['sqft'] || !!localFilters['lotSize'] || !!localFilters['property_type'];
  }

  handleBathroomSelect(val) {
    let filter = {"bathrooms": val};
    this.props.updatePropertiesModalLocalFilter(filter);
  }

  handleBedroomSelect(val) {
    let filter = {"bedrooms": val};
    this.props.updatePropertiesModalLocalFilter(filter);
  }

  handleCancel(e) {
    e.preventDefault();
      // reset local filters
    // this.props.setLocalFilters({});
    this.props.openPropertiesModal(false);
  }

  handlePriceSelect(start, to) {
    let filter = {
      price: {
        start: start,
        to: to
      }
    }
    this.props.updatePropertiesModalLocalFilter(filter);
  }

  handlePropertyTypeSelect(val) {
    let filter = {"property_type": val};
    this.props.updatePropertiesModalLocalFilter(filter);
  }

  handleLotSizeSelect(start, to) {
    let filter = {
      lotSize: {
        start: start,
        to: to
      }
    };
    this.props.updatePropertiesModalLocalFilter(filter);
  }

  handleSaleTypeSelect(saleType) {
    let filter = {
      sale_type: saleType
    };
    this.props.updatePropertiesModalLocalFilter(filter);
  }

  handleSQFTSelect(start, to) {
    let filter = {
      sqft: {
        start: start,
        to: to
      }
    };
    this.props.updatePropertiesModalLocalFilter(filter);
  }

  handleTermFilterRemove(filter) {
    let filterToRemove = {[filter.tax]: filter.value};
    this.props.deleteLocalFilterTerm(filterToRemove);
  }

  resetFilters() {
    this.props.setLocalFilters(this.state.initialFilters);
  }

  saveFilters() {
    let url = new URI(window.location.host);
    url.pathname(window.location.pathname);
    let filters = removeDefaultFilters(this.props.localFilters, defaultFiltervalues);
    let searchFilters = convertToSearchParamObject(filters);
    let notSearchFilters = Util.withoutSearchFilters(window.location.href);
    let allFilters = Object.assign({}, notSearchFilters, searchFilters);
    let queryParam = decodeURIComponent(qs.stringify(allFilters))
    url.setSearch(queryParam);
    this.props.openPropertiesModal(false);
    browserHistory.push(decodeURIComponent(url.pathname() + url.search()));
  }

  showFilterBasedOnSaleType(saleType, filter) {
    let filtersSaleTypeMap = {
      'Buy': ['bedrooms', 'bathrooms', 'location', 'lotSize', 'price', 'propert_type', 'sqft'],
      'Commercial': ['location', 'lotSize', 'price', 'sqft'],
      'Rent': ['bathrooms', 'bedrooms', 'location', 'lotSize', 'price', 'propert_type', 'sqft'],
      'Land': ['location', 'lotSize', 'price']
    };
    if (!filtersSaleTypeMap[saleType]) {
      console.log(`saletype ${saleType} was not recognized, properties modal filters might work properly`);
      return false;
    }
    return filtersSaleTypeMap[saleType].indexOf(filter) >= 0;

  }

  toggleViewAllFilters() {
    this.setState({
      showAllFilters: !this.state.showAllFilters
    });
  }

  render() {
    let {
      bathroomSelected,
      bedroomSelected,
      lotSizeSelected,
      priceSelected,
      propertyTypeSelected,
      sqftSelected,
      localFilters,
      open
    } = this.props;

    let {
      initialFilters,
      showAllFilters
    } = this.state;

    let bathroomElements = bathroomOptions.map(d => ({
      name: d.name,
      selected: d.value === bathroomSelected,
      value: d.value
    }));

    let bedroomElements = bedroomOptions.map(d => ({
      name: d.name,
      selected: d.value === bedroomSelected,
      value: d.value
    }));

    let propertyTypeElements = propertyTypeOptions.map(d => ({
      name: d.name,
      selected: d.value === propertyTypeSelected,
      value: d.value
    }));

    let filters = removeDefaultFilters(localFilters, defaultFiltervalues);
    let termFilters = [];
    let termFilterElement;
    let termFilter = localFilters['term'];
    if (termFilter && termFilter.length) {
      termFilters = termFilter.map(t => {
        return {tax: Object.keys(t)[0], value: Object.values(t)[0]}
      });
      if (termFilters.length === 1) {
        termFilterElement = <span key={termFilters[0].value} className={`${Lib.THEME_CLASSES_PREFIX}filter-section-button btn btn-primary selected`}>
          <i className="fa fa-times" onClick={() => this.props.removeLastLocationFilter()}></i>
          <span>{termFilters[0].value}</span>
        </span>;
      } else {
        termFilterElement = termFilters.map((t, i) =>
          <span key={t.value} className={`${Lib.THEME_CLASSES_PREFIX}filter-section-button btn btn-primary selected`}>
            <i className="fa fa-times" onClick={() => this.handleTermFilterRemove.bind(this)(t)}></i>
            <span>{t.value}</span>
          </span>
        );
      }
    }
    return (
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
                      deleteSingleLocalFilter={this.props.deleteSingleLocalFilter}
                      deleteLocalFilterTerm={this.props.deleteLocalFilterTerm}
                      localFilters={localFilters}
                      removeLastLocationFilter={this.props.removeLastLocationFilter}
                    />
                  </div>
                  <div className="p-2 my-auto">
                    <a href="#" className="btn-reset" onClick={this.resetFilters.bind(this)}>Reset</a>
                  </div>
                  <div className="p-2 my-auto">
                    <a
                      href="#"
                      className={`btn btn-primary ${Lib.THEME_CLASSES_PREFIX}search-modal-submit-button ${this.props.resultCountButtonLoading ? 'disabled' : null}`}
                      onClick={this.saveFilters.bind(this)}>
                        {this.props.resultCount ? "View " + this.props.resultCount + " Properties" : "View Properties"}
                    </a>
                  </div>
                  <div className="p-2 my-auto">
                    <button
                      aria-label="Close"
                      className={`close ${Lib.THEME_CLASSES_PREFIX}close-panel my-auto hidden-md-down`}
                      type="button"
                      onClick={this.handleCancel.bind(this)}
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
                      <BuyIcon className={`icon-group ${localFilters.sale_type === 'Buy' ? 'selected' : ''}`} onClick={() => this.handleSaleTypeSelect('Buy')} />
                    </div>
                    <div className="card-block">
                      <h3 className={`card-text text-center ${Lib.THEME_CLASSES_PREFIX}sale-selection-text`}>Buy</h3>
                    </div>
                  </div>
                  <div className="card col-3">
                    <div className="card-img-top mt-4 text-center">
                      <RentIcon className={`icon-group ${localFilters.sale_type === 'Rent' ? 'selected' : ''}`} onClick={() => this.handleSaleTypeSelect('Rent')} />
                    </div>
                    <div className="card-block">
                      <h3 className={`card-text text-center ${Lib.THEME_CLASSES_PREFIX}sale-selection-text`}>Rent</h3>
                    </div>
                  </div>
                  <div className="card col-3">
                    <div className="card-img-top mt-4 text-center">
                      <CommercialIcon className={`icon-group ${localFilters.sale_type === 'Commercial' ? 'selected' : ''}`} onClick={() => this.handleSaleTypeSelect('Commercial')} />
                    </div>
                    <div className="card-block">
                      <h3 className={`card-text text-center ${Lib.THEME_CLASSES_PREFIX}sale-selection-text`}>Commercial</h3>
                    </div>
                  </div>
                  <div className="card col-3">
                    <div className="card-img-top mt-4 text-center">
                      <LandIcon className={`icon-group ${localFilters.sale_type === 'Land' ? 'selected' : ''}`} onClick={() => this.handleSaleTypeSelect('Land')} />
                    </div>
                    <div className="card-block">
                      <h3 className={`card-text text-center ${Lib.THEME_CLASSES_PREFIX}sale-selection-text`}>Land</h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className={Lib.THEME_CLASSES_PREFIX + "search-modal-box"}>
                <div className="container">
                  {this.showFilterBasedOnSaleType(localFilters.sale_type, 'location') ?
                    <div className="row">
                      <div className={`col-12 ${Lib.THEME_CLASSES_PREFIX}filter-section`}>
                        <h3>Location <span>(City, School, Neighborhood, Zip)</span></h3>
                        <div className="filter-type">
                          {termFilterElement}
                          <a href="#" className={`${Lib.THEME_CLASSES_PREFIX}filter-section-button btn btn-primary`}
                            onClick={() => this.props.openLocationModal('append')}>+ More Locations</a>
                        </div>
                      </div>
                    </div>
                  : null}
                  {this.showFilterBasedOnSaleType(localFilters.sale_type, 'bedrooms') ?
                    <div className="row">
                      <div className={`col-12 ${Lib.THEME_CLASSES_PREFIX}filter-section`}>
                        <h3>Bedrooms <span>(Minimum)</span></h3>
                        {bedroomElements.map(d =>
                          <a key={d.value} href="#"
                            className={`btn btn-primary ${Lib.THEME_CLASSES_PREFIX}filter-section-button ${(d.selected ? "selected" : null)}`}
                            onClick={() => this.handleBedroomSelect.bind(this)(d.value)}>{d.name}</a>
                        )}
                      </div>
                    </div>
                  : null}
                  {this.showFilterBasedOnSaleType(localFilters.sale_type, 'price') ?
                    <div className="row">
                      <div
                        className={`col-12 ${Lib.THEME_CLASSES_PREFIX}filter-section ${Lib.THEME_CLASSES_PREFIX}filter-section-price`}>
                        <h3>Price <span>(Range)</span></h3>
                        <div>
                          {localFilters.sale_type && priceSelected.start && priceSelected.to ?
                            <Price saleType={localFilters.sale_type} start={priceSelected.start}
                                  to={priceSelected.to}
                                  handleOnClick={this.handlePriceSelect.bind(this)}/>
                            : null}
                        </div>
                        <input id="priceSlider" className={`${Lib.THEME_CLASSES_PREFIX}hidden-input bs-hidden-input`}/>
                      </div>
                    </div>
                  : null}
                  {this.showFilterBasedOnSaleType(localFilters.sale_type, 'bathrooms') ?
                    <div className="row">
                      <div className={`col-12 ${Lib.THEME_CLASSES_PREFIX}filter-section`}
                          style={{display: showAllFilters ? 'block' : 'none'}}>
                        <h3>Bathrooms <span>(Minimum)</span></h3>
                        {bathroomElements.map(d =>
                          <a key={d.value} href="#"
                            className={`${Lib.THEME_CLASSES_PREFIX}filter-section-button btn btn-primary ${(d.selected ? "selected" : null)}`}
                            onClick={() => this.handleBathroomSelect.bind(this)(d.value)}>{d.name}</a>
                        )}
                      </div>
                    </div>
                  : null}
                  {this.showFilterBasedOnSaleType(localFilters.sale_type, 'sqft') ?
                    <div className="row">
                      <div
                        className={`col-12 ${Lib.THEME_CLASSES_PREFIX}filter-section ${Lib.THEME_CLASSES_PREFIX}filter-section-total-size`}
                        style={{display: showAllFilters ? 'block' : 'none'}}>
                        <h3>Total Size <span>(SQFT)</span></h3>
                        <div>
                          {localFilters.sale_type && sqftSelected.start && sqftSelected.to ?
                            <SQFT saleType={localFilters.sale_type} start={sqftSelected.start}
                                  to={sqftSelected.to}
                                  handleOnClick={this.handleSQFTSelect.bind(this)}/>
                            : null}
                        </div>
                        <input id="priceSlider" className={`${Lib.THEME_CLASSES_PREFIX}hidden-input bs-hidden-input`}/>
                      </div>
                    </div>
                  : null}
                  {this.showFilterBasedOnSaleType(localFilters.sale_type, 'lotSize') ?
                    <div className="row">
                      <div
                        className={`col-12 ${Lib.THEME_CLASSES_PREFIX}filter-section ${Lib.THEME_CLASSES_PREFIX}filter-section-total-size`}
                        style={{display: showAllFilters ? 'block' : 'none'}}>
                        <h3>Lot Size <span>(Acres)</span></h3>
                        <div>
                          {localFilters.sale_type && lotSizeSelected.start && lotSizeSelected.to ?
                            <LotSize saleType={localFilters.sale_type} start={lotSizeSelected.start}
                                    to={lotSizeSelected.to} handleOnClick={this.handleLotSizeSelect.bind(this)}/>
                            : null}
                        </div>
                        <input id="priceSlider" className={`${Lib.THEME_CLASSES_PREFIX}hidden-input bs-hidden-input`}/>
                      </div>
                    </div>
                  : null}
                  {this.showFilterBasedOnSaleType(localFilters.sale_type, 'property_type') ?
                    <div className="row">
                      <div
                        className={`col-12 ${Lib.THEME_CLASSES_PREFIX}filter-section`}
                        style={{display: showAllFilters ? 'block' : 'none'}}>
                        <h3>Type</h3>
                        <div className="filter-type">
                          {propertyTypeElements.map(d =>
                            <a key={d.value} href="#"
                              className={`${Lib.THEME_CLASSES_PREFIX}filter-section-button btn btn-primary ${(d.selected ? "selected" : null)}`}
                              onClick={() => this.handlePropertyTypeSelect.bind(this)(d.value)}>{d.name}</a>
                          )}
                        </div>
                      </div>
                    </div>
                  : null}
                  <div className="row">
                    {showAllFilters ?
                      <div className="col-7">
                        <a href="#" className={Lib.THEME_CLASSES_PREFIX + "view-link"}
                          onClick={this.toggleViewAllFilters.bind(this)}>- View Less Filters</a>
                      </div>
                      :
                      <div className="col-7">
                        <a href="#" className={Lib.THEME_CLASSES_PREFIX + "view-link"}
                          onClick={this.toggleViewAllFilters.bind(this)}>+ View More Filters</a>
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
                    onClick={this.resetFilters.bind(this)}
                    >Reset</button>
                  <span className={`${Lib.THEME_CLASSES_PREFIX}filter-footernav-item-right nav-item-right`}>
                  <a
                    href="#"
                    className="btn-cancel"
                    onClick={this.handleCancel.bind(this)}>Cancel</a>
                      <i>|</i>
                  <a href="#" className="btn-apply" onClick={this.saveFilters.bind(this)}>Apply</a>
                </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}
;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertiesModal);
