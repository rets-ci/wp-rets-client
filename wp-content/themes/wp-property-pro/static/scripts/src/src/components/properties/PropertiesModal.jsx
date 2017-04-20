import {openPropertiesModal} from '../../actions/index.jsx';
import {connect} from 'react-redux';
import {isEqual} from 'lodash';
import {Lib} from '../../lib.jsx';
import Price from './Filters/Price.jsx';
import SQFT from './Filters/SQFT.jsx';
import LotSize from './Filters/LotSize.jsx';
import React, {Component, PropTypes} from 'react';
import {browserHistory} from 'react-router';
import URI from 'urijs';
import Util from '../Util.jsx';

let bathroomOptions =[
  {name: '1+', value: '1'},
  {name: '2+', value: '2'},
  {name: '3+', value: '3'},
  {name: '4+', value: '4'}
];

let bedroomOptions = [
  {name: '1+', value: '1'},
  {name: '2+', value: '2'},
  {name: '3+', value: '3'},
  {name: '4+', value: '4'}
];

const mapStateToProps = (state, ownProps) => {
  let searchFiltersFormatted = Util.getQS(window.location.href, ownProps.searchFilters)[Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX];
  return {
    bedroomOptions: bedroomOptions,
    bathroomSelected: searchFiltersFormatted.bathrooms || null,
    bedroomSelected: searchFiltersFormatted.bedrooms || null,
    priceSelected: searchFiltersFormatted.price || {},
    sqftSelected: searchFiltersFormatted.sqft || {},
    lotSizeSelected: searchFiltersFormatted.lotSize || {},
    searchFiltersFormatted: searchFiltersFormatted
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    openPropertiesModal: open => {
      dispatch(openPropertiesModal(open));
    }
  }
};

class PropertiesModal extends Component {
  static propTypes = {
    bathroomSelected: PropTypes.string,
    bedroomSelected: PropTypes.string,
    searchFilters: PropTypes.object.isRequired,
    searchFiltersFormatted: PropTypes.object.isRequired,
    standardSearch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      bathroomSelected: props.bathroomSelected,
      bedroomSelected: props.bedroomSelected,
      localFilters: Object.assign({}, props.searchFilters),
      lotSizeSelected: props.lotSizeSelected,
      showAllFilters: false,
      priceSelected: props.priceSelected,
      sqftSelected: props.sqftSelected
    };
  }

  componentDidMount() {
    let showAllFilters = this.displayAllFilters(this.props.searchFiltersFormatted);
    this.setState({
      showAllFilters: showAllFilters
    });
  }

  componentWillReceiveProps(nextProps) {
    let showAllFilters = this.displayAllFilters(nextProps.searchFiltersFormatted);
    this.setState({
      showAllFilters: showAllFilters
    });
  }

  handleBathroomSelect(val) {
    let filter = {[Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + "[bathrooms]"]: val};
    this.setState({
      bathroomSelected: val,
      localFilters: Object.assign({}, this.state.localFilters, filter)
    });
  }

  handleBedroomSelect(val) {
    let filter = {[Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + "[bedrooms]"]: val};
    this.setState({
      bedroomSelected: val,
      localFilters: Object.assign({}, this.state.localFilters, filter)
    });
  }

  handlePriceSelect(start, to) {
    let filter = {
      [Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + "[price][start]"]: start,
      [Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + "[price][to]"]: to,
    };
    this.setState({
      localFilters: Object.assign({}, this.state.localFilters, filter),
      priceSelected: {start: start, to: to}
    });
  }

  handleLotSizeSelect(start, to) {
    console.log('handleLotSizeSelect');
  }

  handleSQFTSelect(start, to) {
    let filter = {
      [Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + "[sqft][start]"]: start,
      [Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + "[sqft][to]"]: to,
    };
    this.setState({
      localFilters: Object.assign({}, this.state.localFilters, filter),
      sqftSelected: {start: start, to: to}
    });
  }

  saveFilters() {
    let url = new URI(window.location.href);
    let updatedSearchParams = Util.updateQueryFilter(window.location.href, this.state.localFilters, 'set', true);
    url.setSearch(updatedSearchParams);
    this.props.openPropertiesModal(false);
    browserHistory.push(decodeURIComponent(url.pathname() + url.search()));
  }

  displayAllFilters(searchFiltersFormatted) {
    return !!searchFiltersFormatted['bathrooms'] || !!searchFiltersFormatted['sqft'];
  }

  resetFilters() {
    this.setState({
      bedroomSelected: this.props.bedroomSelected,
      priceSelected: this.props.priceSelected,
      sqftSelected: this.props.sqftSelected,
      localFilters: Object.assign({}, this.props.searchFilters)
    });
  }

  toggleViewAllFilters() {
    this.setState({
      showAllFilters: !this.state.showAllFilters
    });
  }

  render() {
    let {
      bedroomOptions,
      searchFilters,
      searchFiltersFormatted
    } = this.props;

    let {
      bathroomSelected,
      bedroomSelected,
      localFilters,
      lotSizeSelected,
      priceSelected,
      showAllFilters,
      sqftSelected
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
    let anyFilterChange = !isEqual(searchFilters, localFilters);
    let termFilter = searchFiltersFormatted['term'];
    let termFilters = Object.keys(termFilter).map(t => {
      return {tax: t, value: termFilter[t]}
    });
    return (
      <div>
        {this.props.open ?
          <div className={Lib.THEME_CLASSES_PREFIX + "search-modal" + " " + Lib.THEME_CLASSES_PREFIX + "advanced-filter"}>
            <a onClick={() => this.props.openPropertiesModal(false)} href="#" className={Lib.THEME_CLASSES_PREFIX + "close-panel" + " hidden-md-down"}>
              <i className="fa fa-times"></i>
            </a>
            <form method="get" className="clearfix hidden-md-down">
              <div className="container">
                <i className="fa fa-search"></i>
                <div className={Lib.THEME_CLASSES_PREFIX + "bs-tags-box"}>
                   <div className={Lib.THEME_CLASSES_PREFIX + "bs-tags-input"}>
                     {termFilters.map(t =>
                       <span key={t.value} className={Lib.THEME_CLASSES_PREFIX + "tag badge badge-default"}><span><i className="fa fa-times"></i></span> {t.value}</span>
                      )}
                      {!termFilters.length &&
                        <input type="text" size="1" placeholder="Select bedroom type, amenities" />
                      }
                   </div>
                </div>
                  <input type="text" value="Raleigh,Raleigh2" data-role="tagsinput" className={Lib.THEME_CLASSES_PREFIX + "tagsinput"} readOnly />
                <div className="button-group">
                   <a href="#" className="btn-reset" onClick={this.resetFilters.bind(this)}>Reset</a>
                   <a href="#" className={"btn btn-primary " + (!anyFilterChange ? "propertypro-btn-disabled" : null)} onClick={anyFilterChange ? this.saveFilters.bind(this) : null}>View Properties</a>
                </div>
              </div>
            </form>
            <div className="search-filter-nav hidden-lg-up">
              <div className="container">
                <ul className="clearfix">
                  <li>
                    <a href="#" title="Buy">
                      <img src="img/buy-icon.svg" alt="Buy" />
                      <span>Buy</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" title="Rent">
                      <img src="img/rent-icon.svg" alt="Rent" />
                      <span>Rent</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" title="Commercial">
                      <img src="img/commercial-icon.svg" alt="Commercial" />
                      <span>Commercial</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" title="Land">
                      <img src="img/land-icon.svg" alt="Land" />
                      <span>Land</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className={Lib.THEME_CLASSES_PREFIX + "search-modal-box"}>
               <div className="container">
                 <div className="filter-section">
                   <h3>Location <span>(City, School, Neighborhood, Zip)</span></h3>
                   <div className="filter-type">
                     {termFilters.map(t =>
                       <span key={t.value} className={Lib.THEME_CLASSES_PREFIX + "tag badge badge-default selected"}>{t.value}</span>
                     )}
                     <a href="#" className="btn btn-primary">+ More Locations</a>
                   </div>
                 </div>
                 <div className="filter-section">
                   <h3>Bedrooms <span>(Minimum)</span></h3>
                   {bedroomElements.map(d =>
                     <a key={d.value} href="#" className={`btn btn-primary ${(d.selected ? "selected" : null)}`} onClick={() => this.handleBedroomSelect.bind(this)(d.value)}>{d.name}</a>
                   )}
                 </div>
                 <div className="filter-section">
                   <h3>Price <span>(Range)</span></h3>
                   <div>
                     <Price saleType={searchFiltersFormatted.sale_type} start={priceSelected.start} to={priceSelected.to} handleOnClick={this.handlePriceSelect.bind(this)} />
                   </div>
                   <input id="priceSlider" className="bs-hidden-input" />
                 </div>

                <div className="filter-section" style={{display: showAllFilters ? 'block' : 'none'}}>
                  <h3>Bathrooms <span>(Minimum)</span></h3>
                  {bathroomElements.map(d =>
                    <a key={d.value} href="#" className={`btn btn-primary ${(d.selected ? "selected" : null)}`} onClick={() => this.handleBathroomSelect.bind(this)(d.value)}>{d.name}</a>
                  )}
                </div>
                <div className="filter-section" style={{display: showAllFilters ? 'block' : 'none'}}>
                  <h3>Total Size <span>(SQFT)</span></h3>
                  <div>
                    <SQFT saleType={searchFiltersFormatted.sale_type} start={sqftSelected.start} to={sqftSelected.to} handleOnClick={this.handleSQFTSelect.bind(this)} />
                  </div>
                  <input id="priceSlider" className="bs-hidden-input" />
                </div>
                {/* <div className="filter-section" style={{display: showAllFilters ? 'block' : 'none'}}>
                  <h3>Lot Size <span>(Acres)</span></h3>
                  <div>
                    <LotSize saleType={searchFiltersFormatted.sale_type} start={lotSizeSelected.start} to={lotSizeSelected.to} handleOnClick={this.handleLotSizeSelect.bind(this)} />
                  </div>
                  <input id="priceSlider" className="bs-hidden-input" />
                </div> */}
                {showAllFilters ?
                  <a href="#" className={Lib.THEME_CLASSES_PREFIX+"view-link"} onClick={this.toggleViewAllFilters.bind(this)}>- View Less Filters</a>
                :
                  <a href="#" className={Lib.THEME_CLASSES_PREFIX+"view-link"} onClick={this.toggleViewAllFilters.bind(this)}>+ View More Filters</a>
                }
               </div>
            </div>
            <div className={`${Lib.THEME_CLASSES_PREFIX}filter-footernav hidden-lg-up`}>
              <div className="container">
                <button className="btn btn-reset">Reset</button>
                <span className="nav-item-right">
                  <a href="#" className="btn-cancel">Cancel</a> <i>|</i> <a href="#" className="btn-apply">Apply</a>
                </span>
              </div>
            </div>
         </div>
        : null}
      </div>
    )
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertiesModal);
