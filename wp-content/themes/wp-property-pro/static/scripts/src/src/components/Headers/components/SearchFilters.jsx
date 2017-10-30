import {
  openLocationModal,
  setSearchType,
  openPropertiesModal
} from '../../../actions/index.jsx';
import difference from 'lodash/difference';
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
    historyPush: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
  }

  handleBathroomsFilterRemove = () => {
    let filters = Object.assign({}, this.props.filters);
    delete filters['bathrooms'];
    this.updateURLWithQueryParam(filters);
  }

  handleBedroomsFilterRemove = () => {
    let filters = Object.assign({}, this.props.filters);
    delete filters['bedrooms'];
    this.updateURLWithQueryParam(filters);
  }

  handleDeleteSubPropertyTypeFilter = (slug) => {
    let filters = Object.assign({}, this.props.filters);
    filters['property_subtype'] = filters['property_subtype'].filter(d => d.slug !== slug);
    this.updateURLWithQueryParam(filters);
  }

  handleSaleTypeRemove = saleType => {
    let filters = Object.assign({}, this.props.filters);
    filters['sale_type'] = filters['sale_type'].filter(d => d !== saleType);
    if (!filters['sale_type'].length) {
      delete filters['sale_type'];
    }
    this.updateURLWithQueryParam(filters);
  }

  handleLotSizefilterRemove = () => {
    let filters = Object.assign({}, this.props.filters);
    delete filters['lotSize'];
    this.updateURLWithQueryParam(filters);
  }

  handlePriceFilterRemove = () => {
    let filters = Object.assign({}, this.props.filters);
    delete filters['price'];
    this.updateURLWithQueryParam(filters);
  }

  handleSQFTFilterRemove = () => {
    let filters = Object.assign({}, this.props.filters);
    delete filters['sqft'];
    this.updateURLWithQueryParam(filters);
  }

  handleTermFilterRemove = termFilter => {
    let filters = Object.assign({}, this.props.filters);
    var currentTermFilter = filters.term;
    var updatedTermFilter = currentTermFilter.filter(t => {
      return !isEqual(t, termFilter);
    })
    filters['term'] = updatedTermFilter;
    
    this.updateURLWithQueryParam(filters);
  }

  showStaticFilters() {
    let filters = this.props.filters;
    let notCountingFilters = ['geobr', 'geotl', 'property_type', 'search_type', 'selected_property', 'term'];
    if (['Commercial', 'Land'].indexOf(filters.search_type) < 0) {
      notCountingFilters.push('sale_type');
    }
    return !difference(Object.keys(filters), notCountingFilters).length;
  }

  updateURLWithQueryParam = queryParam => {
    queryParam = Object.assign({}, queryParam);
    delete queryParam['search_type']
    if (queryParam['sale_type'] && isEqual(queryParam['sale_type'].sort(), ['Rent', 'Sale'].sort())) {
      delete queryParam['sale_type']
    }
    if (queryParam['property_subtype'] && queryParam['property_subtype'].every(d => d.slug)) {
      queryParam['property_subtype'] = queryParam['property_subtype'].map(d => d.slug);
    }
    queryParam = Util.customFormatToSearchObject(queryParam);
    let searchCollection = Util.searchObjectToCollection(queryParam);
    let searchURL = Util.createSearchURL('/search', searchCollection);
    this.props.historyPush(searchURL);
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
    let saleTypeFilter = filters['sale_type'];
    let saleTypeElement;
    let sqftFilter = filters['sqft'];
    let sqftElement;
    let subPropertyTypeFilter = filters['property_subtype'];
    let subPropertyTypeElement;

    if (bathroomsFilter) {
      bathroomsElement = (
        <FilterTag handleRemoveFilter={this.handleBathroomsFilterRemove} display={bathroomsFilter + `+ Baths`} value={bathroomsFilter} />
      );
    } else if (staticFilters['bathrooms'] && this.showStaticFilters()) {
      bathroomsElement = (<span className={`${Lib.THEME_CLASSES_PREFIX}tag ${Lib.THEME_CLASSES_PREFIX}addfilter`}>
        <span>+</span> Bathroom
      </span>);
    }

    if (bedroomsFilter) {
      bedroomsElement = (
        <FilterTag handleRemoveFilter={this.handleBedroomsFilterRemove} display={bedroomsFilter + `+ Beds`} value={bedroomsFilter} />
      );
    } else if (staticFilters['bedrooms'] && this.showStaticFilters()) {
      bedroomsElement = (<span className={`${Lib.THEME_CLASSES_PREFIX}tag ${Lib.THEME_CLASSES_PREFIX}addfilter`}>
        <span>+</span> Bedroom
      </span>);
    }

    if (priceFilter) {
      priceElement = (
        <FilterTag handleRemoveFilter={this.handlePriceFilterRemove} display={Util.priceFilterSearchTagText(priceFilter)} value={priceFilter} />
      );
    } else if (staticFilters['price'] && this.showStaticFilters()) {
      priceElement = (<span className={`${Lib.THEME_CLASSES_PREFIX}tag ${Lib.THEME_CLASSES_PREFIX}addfilter`}>
        <span>+</span> Price
      </span>);
    }

    if (lotSizeFilter) {
      lotSizeElement = (
        <FilterTag handleRemoveFilter={this.handleLotSizefilterRemove} display={Util.lotSizeFilterSearchTagText(lotSizeFilter)} value={lotSizeFilter} />
      )
    } else if (staticFilters['lotSize'] && this.showStaticFilters()) {
      lotSizeElement = (<span className={`${Lib.THEME_CLASSES_PREFIX}tag ${Lib.THEME_CLASSES_PREFIX}addfilter`}>
        <span>+</span> Lot Size
      </span>);
    }

    if (['Commercial', 'Land'].indexOf(filters.search_type) >= 0 && saleTypeFilter) {
      saleTypeElement = saleTypeFilter.map((s, i) =>
        <FilterTag key={JSON.stringify(s)} handleRemoveFilter={this.handleSaleTypeRemove} display={s} value={s} />
      );
    }

    if (sqftFilter) {
      sqftElement = (
        <FilterTag handleRemoveFilter={this.handleSQFTFilterRemove} display={Util.sqftFilterSearchTagText(sqftFilter)} value={sqftFilter} />
      );
    } else if (staticFilters['sqft'] && this.showStaticFilters()) {
      sqftElement = (<span className={`${Lib.THEME_CLASSES_PREFIX}tag ${Lib.THEME_CLASSES_PREFIX}addfilter`}>
        <span>+</span> SQFT
      </span>);
    }

    if (subPropertyTypeFilter) {
      subPropertyTypeElement = subPropertyTypeFilter.map((s, i) =>
        <FilterTag key={JSON.stringify(s)} handleRemoveFilter={this.handleDeleteSubPropertyTypeFilter} display={s.title} value={s.slug} />
      );
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
          {subPropertyTypeElement}
          {saleTypeElement}
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

export default connect(
  null,
  mapDispatchToProps
)(searchFilters);
