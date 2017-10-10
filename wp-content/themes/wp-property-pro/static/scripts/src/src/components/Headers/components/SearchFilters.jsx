import {
  openLocationModal,
  setSearchType,
  openPropertiesModal
} from '../../../actions/index.jsx';
import FilterTag from '../../FilterTag.jsx';
import {Lib} from '../../../lib.jsx';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import Util from '../../Util.jsx';
import isEqual from 'lodash/isEqual';
import qs from 'qs';


const isMobileView = () => window.innerWidth < Lib.MOBILE_WIDTH;

const mapDispatchToProps = (dispatch, ownProps) => {
  return {

    openPropertiesModal: open => {
      dispatch(openPropertiesModal(open));
    },

    openLocationModal: () => {
      dispatch(openLocationModal(true));
    }
  }
};

class searchFilters extends Component {
  static propTypes = {
    filters: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
  }

  handleBathroomsFilterRemove = () => {
    let searchQueryParamsCollection = Util.URLSearchParse('search', window.location.href);
    searchQueryParamsCollection = searchQueryParamsCollection.filter(d => d.key !== 'bathrooms');
    this.updateURLWithQueryParam(searchQueryParamsCollection);
  }

  handleBedroomsFilterRemove = () => {
    let filters = Object.assign({}, this.props.filters);
    delete filters['bedrooms'];
    let searchCollection = Util.searchObjectToCollection(filters);
    this.updateURLWithQueryParam(searchCollection);
  }

  handleLotSizefilterRemove = () => {
    let filters = Object.assign({}, this.props.filters);
    delete filters['lotSize'];
    let searchCollection = Util.searchObjectToCollection(filters);
    this.updateURLWithQueryParam(searchCollection);
  }

  handlePriceFilterRemove = () => {
    let filters = Object.assign({}, this.props.filters);
    delete filters['price'];
    let searchCollection = Util.searchObjectToCollection(filters);
    this.updateURLWithQueryParam(searchCollection);
  }

  handleSQFTFilterRemove = () => {
    let filters = Object.assign({}, this.props.filters);
    delete filters['sqft'];
    let searchCollection = Util.searchObjectToCollection(filters);
    this.updateURLWithQueryParam(searchCollection);
  }

  handleTermFilterRemove = termFilter => {
    let filters = Object.assign({}, this.props.filters);
    var currentTermFilter = filters.term;
    var updatedTermFilter = currentTermFilter.filter(t => {
      return !isEqual(t, termFilter);
    })
    filters['term'] = updatedTermFilter;
    let searchCollection = Util.searchObjectToCollection(filters);
    this.updateURLWithQueryParam(searchCollection);
  }

  updateURLWithQueryParam(queryParam) {
    let searchURL = Util.createSearchURL('/search', queryParam);
    this.props.history.push(searchURL);
  }

  render() {
    let {
      filters
    } = this.props;
    let staticFilters = {
      'bedrooms': false,
      'lotSize': false,
      'price': false,
      'sqft': false
    };

    switch (filters.search_type) {
      case 'Buy':
        staticFilters['bedrooms'] = true;
        staticFilters['price'] = true;
        break;
      case 'Rent':
        staticFilters['bedrooms'] = true;
        staticFilters['price'] = true;
        break;
      case 'Commercial':
        staticFilters['sqft'] = true;
        staticFilters['price'] = true;
        break;
      case 'Land':
        staticFilters['lotSize'] = true
        staticFilters['price'] = true;
    }

    let bathroomsElement;
    let bathroomsFilter = filters['bathrooms'];
    let bedroomsFilter = filters['bedrooms'];
    let bedroomsElement;
    let lotSizeElement;
    let lotSizeFilter = filters['lotSize'];
    let priceFilter = filters['price'];
    let priceElement;
    let sqftFilter = filters['sqft'];
    let sqftElement;

    if (bathroomsFilter) {
      bathroomsElement = (
        <FilterTag handleRemoveFilter={this.handleBathroomsFilterRemove} display={bathroomsFilter + `+ Baths`} value={bathroomsFilter} />
      );
    } else if (staticFilters['bathrooms']) {
      bathroomsElement = (<span className={`${Lib.THEME_CLASSES_PREFIX}tag ${Lib.THEME_CLASSES_PREFIX}addfilter`}>
        <span>+</span> Bathroom
      </span>);
    }

    if (bedroomsFilter) {
      bedroomsElement = (
        <FilterTag handleRemoveFilter={this.handleBedroomsFilterRemove} display={bedroomsFilter + `+ Beds`} value={bedroomsFilter} />
      );
    } else if (staticFilters['bedrooms']) {
      bedroomsElement = (<span className={`${Lib.THEME_CLASSES_PREFIX}tag ${Lib.THEME_CLASSES_PREFIX}addfilter`}>
        <span>+</span> Bedroom
      </span>);
    }

    if (priceFilter) {
      priceElement = (
        <FilterTag handleRemoveFilter={this.handlePriceFilterRemove} display={Util.priceFilterSearchTagText(priceFilter)} value={priceFilter} />
      );
    } else if (staticFilters['price']) {
      priceElement = (<span className={`${Lib.THEME_CLASSES_PREFIX}tag ${Lib.THEME_CLASSES_PREFIX}addfilter`}>
        <span>+</span> Price
      </span>);
    }

    if (lotSizeFilter) {
      lotSizeElement = (
        <FilterTag handleRemoveFilter={this.handleLotSizefilterRemove} display={Util.lotSizeFilterSearchTagText(lotSizeFilter)} value={lotSizeFilter} />
      )
    } else if (staticFilters['lotSize']) {
      lotSizeElement = (<span className={`${Lib.THEME_CLASSES_PREFIX}tag ${Lib.THEME_CLASSES_PREFIX}addfilter`}>
        <span>+</span> Lot Size
      </span>);
    }

    if (sqftFilter) {
      sqftElement = (
        <FilterTag handleRemoveFilter={this.handleSQFTFilterRemove} display={Util.sqftFilterSearchTagText(sqftFilter)} value={sqftFilter} />
      );
    } else if (staticFilters['sqft']) {
      sqftElement = (<span className={`${Lib.THEME_CLASSES_PREFIX}tag ${Lib.THEME_CLASSES_PREFIX}addfilter`}>
        <span>+</span> SQFT
      </span>);
    }

    let termFilter = filters['term'];
    let termFilterElement;
    let termFilters = termFilter;
    if (isMobileView()) {
      termFilters = termFilters.slice(0, 1);
    }
    if (termFilters && termFilters.length) {
      if (termFilters.length === 1) {
        termFilterElement = <FilterTag key={JSON.stringify(termFilters[0])} handleRemoveFilter={this.props.openLocationModal} display={termFilters[0].text || 'loading...'} value={termFilters[0].text || 'loading...'} />;
      } else {
        termFilterElement = termFilters.map((t, i) =>
          <FilterTag key={JSON.stringify(t)} handleRemoveFilter={() => this.handleTermFilterRemove(t)} display={t.text || 'loading...'} value={t.text || 'loading...'} />
        );
      }
    }
    return (
      <div className={`${Lib.THEME_CLASSES_PREFIX}search-filters d-flex align-items-center`} onClick={() => this.props.openPropertiesModal(true)}>
        <div className={`${Lib.THEME_CLASSES_PREFIX}bs-tags-box`}><div>
          {termFilterElement}
          {bathroomsElement}
          {bedroomsElement}
          {priceElement}
          {lotSizeElement}
          {sqftElement}
          <span className={`${Lib.THEME_CLASSES_PREFIX}tag ${Lib.THEME_CLASSES_PREFIX}addfilter`}>
            <span>+</span>
            More Filters
          </span>
        </div></div>
        <a href="#" onClick={e => e.preventDefault()} className={`${Lib.THEME_CLASSES_PREFIX}navbar-navigation-icon px-2`}>
          <span className="fa fa-search"></span>
        </a>
      </div>
    );
  }
};

export default withRouter(connect(
  null,
  mapDispatchToProps
)(searchFilters));
