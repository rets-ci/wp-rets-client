import FilterBar from './components/FilterBar.jsx';
import {deletePropertiesModalSingleLocalFilter, deletePropertiesModalTermLocalFilter, openLocationModal, openPropertiesModal, setPropertiesModalLocalFilter, updatePropertiesModalLocalFilter} from '../../actions/index.jsx';
import {connect} from 'react-redux';
import {isEqual} from 'lodash';
import {Lib} from '../../lib.jsx';
import Price from '../properties/Filters/Price.jsx';
import SQFT from '../properties/Filters/SQFT.jsx';
import LotSize from '../properties/Filters/LotSize.jsx';
import React, {Component, PropTypes} from 'react';
import {browserHistory} from 'react-router';
import URI from 'urijs';
import Util from '../Util.jsx';
import qs from 'qs';

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

let bathroomOptions =[
  {name: '0+', value: '0'},
  {name: '1+', value: '1'},
  {name: '2+', value: '2'},
  {name: '3+', value: '3'},
  {name: '4+', value: '4'},
  {name: '5+', value: '5'},
  {name: '6+', value: '6'}
];

let bedroomOptions = [
  {name: '0+', value: '0'},
  {name: '1+', value: '1'},
  {name: '2+', value: '2'},
  {name: '3+', value: '3'},
  {name: '4+', value: '4'},
  {name: '5+', value: '5'},
  {name: '6+', value: '6'}
];

let defaultFiltervalues = {
  bedrooms: '0',
  bathrooms: '0',
  price: {
    start: 'No Min',
    to: 'No Max'
  },
  sqft: {
    start: 'No Min',
    to: 'No Max'
  },
  lotsize: {
    start: 'No Min',
    to: 'No Max'
  }
};

let propertyTypeOptions = [
  {name: 'House', value: 'house'},
  {name: 'Townhouse', value: 'townhouse'},
  {name: 'Condo', value: 'condo'},
  {name: 'Manufactured', value: 'manufactured'}
];

const mapStateToProps = (state, ownProps) => {
  let localFilters = state.propertiesModal.localFilters;
  return {
    bathroomSelected: localFilters.bathrooms || defaultFiltervalues['bathrooms'],
    bedroomSelected: localFilters.bedrooms || defaultFiltervalues['bedrooms'],
    priceSelected: localFilters.price || defaultFiltervalues['price'],
    propertyTypeSelected: localFilters.propertyType || '',
    sqftSelected: localFilters.sqft || defaultFiltervalues['sqft'],
    lotSizeSelected: localFilters.lotSize || defaultFiltervalues['lotsize'],
    localFilters: localFilters
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    openLocationModal() {
      // dispatch(openPropertiesModal(false));
      dispatch(openLocationModal(true));
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

    setLocalFilters(filter) {
      dispatch(setPropertiesModalLocalFilter(filter));
    },

    updatePropertiesModalLocalFilter(filter) {
      dispatch(updatePropertiesModalLocalFilter(filter));
    }
  }
};

class PropertiesModal extends Component {
  static propTypes = {
    bathroomSelected: PropTypes.string,
    bedroomSelected: PropTypes.string,
    openLocationModal: PropTypes.func.isRequired,
    propertyTypeSelected: PropTypes.string,
    localFilters: PropTypes.object.isRequired,
    standardSearch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      bathroomSelected: props.bathroomSelected,
      bedroomSelected: props.bedroomSelected,
      initialFilters: Object.assign({}, props.localFilters),
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
    let showAllFilters = this.displayAllFilters(this.props.localFilters);
    this.setState({
      showAllFilters: showAllFilters
    });
  }

  componentWillReceiveProps(nextProps) {
    let showAllFilters = this.displayAllFilters(nextProps.localFilters);
    this.setState({
      showAllFilters: showAllFilters,
    });
  }

  componentWillUnmount() {
    // reset local filters
    this.props.setLocalFilters({});
  }

  handleBathroomSelect(val) {
    let filter = {"bathrooms": val};
    this.props.updatePropertiesModalLocalFilter(filter);
  }

  handleBedroomSelect(val) {
    let filter = {"bedrooms": val};
    this.props.updatePropertiesModalLocalFilter(filter);
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
    let filter = {"propertyType": val};
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

  handleSQFTSelect(start, to) {
    let filter = {
      sqft: {
        start: start,
        to: to
      }
    };
    this.props.updatePropertiesModalLocalFilter(filter);
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

  displayAllFilters(localFilters) {
    return !!localFilters['bathrooms'] || !!localFilters['sqft'] || !!localFilters['lotSize'];
  }

  resetFilters() {
    let filter = {
      "bathrooms": this.state.bathroomSelected,
      "bedrooms": this.state.bedroomSelected,
      "lotSize": this.state.lotSizeSelected,
      "price": this.state.priceSelected,
      "propertyType": this.state.propertyTypeSelected,
      "sqft": this.state.sqftSelected
    };

    this.props.updatePropertiesModalLocalFilter(filter);
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
      localFilters
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
    let termFilter = localFilters['term'];
    if (termFilter && termFilter.length) {
      termFilters = termFilter.map(t => {
        return {tax: Object.keys(t)[0], value: Object.values(t)[0]}
      });
    }
    return (
      <div
        className={`modal ${Lib.THEME_CLASSES_PREFIX}search-modal ${Lib.THEME_CLASSES_PREFIX}advanced-filter ${this.props.open ? Lib.THEME_CLASSES_PREFIX + "display" : Lib.THEME_CLASSES_PREFIX + "hide"}`}>
        <div className={`modal-dialog ${Lib.THEME_CLASSES_PREFIX}modal-dialog m-0`} role="document">
          <div className="modal-content">
            <div className={`modal-header ${Lib.THEME_CLASSES_PREFIX}modal-header`}>
              <button type="button" className={`close ${Lib.THEME_CLASSES_PREFIX}close-panel my-auto hidden-md-down`}
                      onClick={(e) => {
                        e.preventDefault();
                        this.props.openPropertiesModal(false);
                      }} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <div className="container">
                <div className="row">
                  <form method="get" className="form-inline clearfix hidden-md-down">
                    <i className="fa fa-search"></i>
                    <FilterBar deleteSingleLocalFilter={this.props.deleteSingleLocalFilter} deleteLocalFilterTerm={this.props.deleteLocalFilterTerm} localFilters={localFilters} />
                    <input type="text" value="Raleigh,Raleigh2" data-role="tagsinput"
                           className={Lib.THEME_CLASSES_PREFIX + "tagsinput"} readOnly/>
                    <div className="button-group">
                      <a href="#" className="btn-reset" onClick={() => {}}>Reset</a>
                      <a href="#"
                         className={"btn btn-primary"}
                         onClick={this.saveFilters.bind(this)}>View Properties</a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="modal-body p-0">
              <div className="search-filter-nav hidden-lg-up">
                <div className="container">
                  <ul className="clearfix">
                    <li>
                      <a href="#" title="Buy">
                        <img src={bundle.static_images_url + "buy-icon.svg"} alt="Buy"/>
                        <span>Buy</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" title="Rent">
                        <img src={bundle.static_images_url + "rent-icon.svg"} alt="Rent"/>
                        <span>Rent</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" title="Commercial">
                        <img src={bundle.static_images_url + "commercial-icon.svg"} alt="Commercial"/>
                        <span>Commercial</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" title="Land">
                        <img src={bundle.static_images_url + "land-icon.svg"} alt="Land"/>
                        <span>Land</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className={Lib.THEME_CLASSES_PREFIX + "search-modal-box"}>
                <div className="container">
                  <div className="row">
                    <div className={Lib.THEME_CLASSES_PREFIX + "filter-section"}>
                      <h3>Location <span>(City, School, Neighborhood, Zip)</span></h3>
                      <div className="filter-type">
                        {termFilters.map(t =>
                          <span key={t.value}
                                className={Lib.THEME_CLASSES_PREFIX + "tag badge badge-default selected"}>{t.value}</span>
                        )}
                        <a href="#" className="btn btn-primary" onClick={() => this.props.openLocationModal(true)}>+ More Locations</a>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className={Lib.THEME_CLASSES_PREFIX + "filter-section"}>
                      <h3>Bedrooms <span>(Minimum)</span></h3>
                      {bedroomElements.map(d =>
                        <a key={d.value} href="#" className={`btn btn-primary ${(d.selected ? "selected" : null)}`}
                           onClick={() => this.handleBedroomSelect.bind(this)(d.value)}>{d.name}</a>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div
                      className={`${Lib.THEME_CLASSES_PREFIX}filter-section ${Lib.THEME_CLASSES_PREFIX}filter-section-price`}>
                      <h3>Price <span>(Range)</span></h3>
                      <div>
                        {localFilters.sale_type && priceSelected.start && priceSelected.to ?
                          <Price saleType={localFilters.sale_type} start={priceSelected.start}
                                 to={priceSelected.to}
                                 handleOnClick={this.handlePriceSelect.bind(this)}/>
                        : null}
                      </div>
                      <input id="priceSlider" className="bs-hidden-input"/>
                    </div>
                  </div>
                  <div className="row">
                    <div className={Lib.THEME_CLASSES_PREFIX + "filter-section"}
                         style={{display: showAllFilters ? 'block' : 'none'}}>
                      <h3>Bathrooms <span>(Minimum)</span></h3>
                      {bathroomElements.map(d =>
                        <a key={d.value} href="#" className={`btn btn-primary ${(d.selected ? "selected" : null)}`}
                           onClick={() => this.handleBathroomSelect.bind(this)(d.value)}>{d.name}</a>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div
                      className={`${Lib.THEME_CLASSES_PREFIX}filter-section ${Lib.THEME_CLASSES_PREFIX}filter-section-total-size`}
                      style={{display: showAllFilters ? 'block' : 'none'}}>
                      <h3>Total Size <span>(SQFT)</span></h3>
                      <div>
                        {localFilters.sale_type && sqftSelected.start && sqftSelected.to ?
                          <SQFT saleType={localFilters.sale_type} start={sqftSelected.start}
                                to={sqftSelected.to}
                                handleOnClick={this.handleSQFTSelect.bind(this)}/>
                        : null}
                      </div>
                      <input id="priceSlider" className="bs-hidden-input"/>
                    </div>
                  </div>
                  <div className="row">
                    <div
                      className={`${Lib.THEME_CLASSES_PREFIX}filter-section ${Lib.THEME_CLASSES_PREFIX}filter-section-total-size`}
                      style={{display: showAllFilters ? 'block' : 'none'}}>
                      <h3>Lot Size <span>(Acres)</span></h3>
                      <div>
                        {localFilters.sale_type && lotSizeSelected.start && lotSizeSelected.to ?
                          <LotSize saleType={localFilters.sale_type} start={lotSizeSelected.start} to={lotSizeSelected.to} handleOnClick={this.handleLotSizeSelect.bind(this)} />
                        : null}
                      </div>
                      <input id="priceSlider" className="bs-hidden-input" />
                    </div>
                  </div>
                  <div className="row">
                    <div
                      className={`${Lib.THEME_CLASSES_PREFIX}filter-section`}
                      style={{display: showAllFilters ? 'block' : 'none'}}>
                      <h3>Type</h3>
                      <div className="filter-type">
                        {propertyTypeElements.map(d =>
                          <a key={d.value} href="#" className={`btn btn-primary ${(d.selected ? "selected" : null)}`} onClick={() => this.handlePropertyTypeSelect.bind(this)(d.value)}>{d.name}</a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {showAllFilters ?
                      <a href="#" className={Lib.THEME_CLASSES_PREFIX + "view-link"}
                         onClick={this.toggleViewAllFilters.bind(this)}>- View Less Filters</a>
                      :
                      <a href="#" className={Lib.THEME_CLASSES_PREFIX + "view-link"}
                         onClick={this.toggleViewAllFilters.bind(this)}>+ View More Filters</a>
                    }
                  </div>
                </div>
               </div>
            </div>
            <div className="modal-footer">
              <div className={`${Lib.THEME_CLASSES_PREFIX}filter-footernav hidden-lg-up`}>
                <div className="container">
                  <button className="btn btn-reset">Reset</button>
                  <span className="nav-item-right">
                  <a href="#" className="btn-cancel">Cancel</a> <i>|</i> <a href="#" className="btn-apply">Apply</a>
                </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertiesModal);
