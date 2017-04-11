 import {openPropertiesModal} from '../../actions/index.jsx';
import {connect} from 'react-redux';
import {isEqual} from 'lodash';
import {Lib} from '../../lib.jsx';
import Price from './Filters/Price.jsx';
import React, {Component, PropTypes} from 'react';
import {browserHistory} from 'react-router';
import URI from 'urijs';
import Util from '../Util.jsx';

let bedroomOptions = [
  {name: '1+', value: '1'},
  {name: '2+', value: '2'},
  {name: '3+', value: '3'},
  {name: '4+', value: '4'}
];

const mapStateToProps = (state, ownProps) => {
  return {
    bedroomOptions: bedroomOptions,
    bedroomSelected: ownProps.searchFilters.bedrooms || null
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
    bedroomSelected: PropTypes.string,
    searchFilters: PropTypes.object.isRequired,
    standardSearch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      bedroomSelected: props.bedroomSelected,
      updatedFilters: Object.assign({}, props.searchFilters)
    };
  }

  handleBedroomSelect(val) {
    let filter = this.updateFilter('bedrooms', val);
    this.setState({
      bedroomSelected: val,
      updatedFilters: filter
    });
  }

  handlePriceSelect(min, max) {
    //TODO: handle filtering on price filter here
  }

  updateFilter(property, val) {
    let changeToSet = {[Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + "[" + property + "]"]: val};
    let url = new URI(window.location.href);
    url.setSearch(changeToSet);
    return url.search(true);
  }

  saveFilters() {
    let url = new URI(window.location.href);
    url.setSearch(this.state.updatedFilters);
    this.props.openPropertiesModal(false);
    browserHistory.push(decodeURIComponent(url.pathname() + url.search()));
  }

  resetFilters() {
    this.setState({
      bedroomSelected: this.props.bedroomSelected,
      updatedFilters: Object.assign({}, this.props.searchFilters)
    })
  }

  render() {
    let {
      bedroomOptions,
      searchFilters
    } = this.props;
    let {
      bedroomSelected,
      updatedFilters
    } = this.state;
    let bedroomElements = bedroomOptions.map(d => ({
      name: d.name,
      selected: d.value === bedroomSelected,
      value: d.value
    }));
    let anyFilterChange = !isEqual(searchFilters, updatedFilters);
    let termFilter = searchFilters['term'];
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
                   <h3>Price</h3>
                   <div>
                     <Price handleOnClick={this.handlePriceSelect.bind(this)} />
                   </div>
                   <input id="priceSlider" className="bs-hidden-input" />
                 </div>

                 <a href="#" className={Lib.THEME_CLASSES_PREFIX+"view-link"}>+ View More Filters</a>
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
