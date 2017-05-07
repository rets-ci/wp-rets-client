import {openPropertiesModal} from '../../../actions/index.jsx';
import FilterTag from '../../FilterTag.jsx';
import {Lib} from '../../../lib.jsx';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Util from '../../Util.jsx';
import {isEqual} from 'lodash';
import qs from 'qs';

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    openPropertiesModal: open => {
      dispatch(openPropertiesModal(open));
    }
  }
};

class searchFilters extends Component {
  static propTypes = {
    filters: PropTypes.object.isRequired
  }

  handleBathroomsFilterRemove(bathroomsFilter) {
    let filter = {
      [Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + '[bathrooms]']: bathroomsFilter
    };
    let queryParam = Util.updateQueryFilter(window.location.href, filter, 'remove', false);
    this.updateURLWithQueryParam(queryParam);
  }

  handleBedroomsFilterRemove(bedroomFilter) {
    let filter = {
      [Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + '[bedrooms]']: bedroomFilter
    };
    let queryParam = Util.updateQueryFilter(window.location.href, filter, 'remove', false);
    this.updateURLWithQueryParam(queryParam);
  }

  handleLotSizefilterRemove(lotSizeFilter) {
    let filter = {
      [Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + "[lotSize][start]"]: lotSizeFilter.start,
      [Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + "[lotSize][to]"]: lotSizeFilter.to,
    };
    let queryParam = Util.updateQueryFilter(window.location.href, filter, 'remove', false);
    this.updateURLWithQueryParam(queryParam);
  }

  handlePriceFilterRemove(priceFilter) {
    let filter = {
      [Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + "[price][start]"]: priceFilter.start,
      [Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + "[price][to]"]: priceFilter.to,
    };
    let queryParam = Util.updateQueryFilter(window.location.href, filter, 'remove', false);
    this.updateURLWithQueryParam(queryParam);
  }

  handlePropertyTypeRemove(propertyFilter) {
    let filter = {
      [Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + '[propertyFilter]']: propertyFilter
    };
    let queryParam = Util.updateQueryFilter(window.location.href, filter, 'remove', false);
    this.updateURLWithQueryParam(queryParam);
  }

  handleSQFTFilterRemove(sqftFilter) {
    let filter = {
      [Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + "[sqft][start]"]: sqftFilter.start,
      [Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + "[sqft][to]"]: sqftFilter.to,
    };
    let queryParam = Util.updateQueryFilter(window.location.href, filter, 'remove', false);
    this.updateURLWithQueryParam(queryParam);
  }

  handleTermFilterRemove(termFilter) {
    let filterToRemove = {[termFilter.tax]: termFilter.value};
    let currentQueryParam = window.location.search.replace('?', '');
    var parsedQs = qs.parse(currentQueryParam);
    var currentTermFilter = parsedQs[Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX]['term'];
    var updatedTermFilter = currentTermFilter.filter(t => {
      return !isEqual(t, filterToRemove);
    })
    parsedQs[Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX]['term'] = updatedTermFilter;
    let updatedQueryParam = qs.stringify(parsedQs);
    this.updateURLWithQueryParam('?' + updatedQueryParam);
  }

  updateURLWithQueryParam(queryParam) {
    Util.goToUrl(window.location.pathname + decodeURIComponent(queryParam));
  }

  render() {
    let {
      filters
    } = this.props;
    let bathroomsElement;
    let bathroomsFilter = filters['bathrooms'];
    let bedroomsFilter = filters['bedrooms'];
    let bedroomsElement;
    let lotSizeElement;
    let lotSizeFilter = filters['lotSize'];
    let priceFilter = filters['price'];
    let priceElement;
    let propertyTypeFilter = filters['propertyType'];
    let propertyTypeElement;
    let sqftFilter = filters['sqft'];
    let sqftElement;

    if (bathroomsFilter) {
      bathroomsElement = (
        <FilterTag handleRemoveFilter={this.handleBathroomsFilterRemove.bind(this)} display={bathroomsFilter + `+ Baths`} value={bathroomsFilter} />
      );
    }

    if (bedroomsFilter) {
      bedroomsElement = (
        <FilterTag handleRemoveFilter={this.handleBedroomsFilterRemove.bind(this)} display={bedroomsFilter + `+ Beds`} value={bedroomsFilter} />
      );
    } else {
      bedroomsElement = (<span className={`${Lib.THEME_CLASSES_PREFIX}tag badge badge-default ${Lib.THEME_CLASSES_PREFIX}addfilter`}>
        <a href="#" onClick={() => this.props.openPropertiesModal(true)}>
          <span>+</span> Bedroom
        </a>
      </span>);
    }

    if (lotSizeFilter) {
      lotSizeElement = (
        <FilterTag handleRemoveFilter={this.handleLotSizefilterRemove.bind(this)} display={Util.lotSizeFilterSearchTagText(lotSizeFilter)} value={lotSizeFilter} />
      )
    }

    if (priceFilter) {
      priceElement = (
        <FilterTag handleRemoveFilter={this.handlePriceFilterRemove.bind(this)} display={Util.priceFilterSearchTagText(priceFilter)} value={priceFilter} />
      );
    } else {
      priceElement = (<span className={`${Lib.THEME_CLASSES_PREFIX}tag badge badge-default ${Lib.THEME_CLASSES_PREFIX}addfilter`}>
        <a href="#" onClick={() => this.props.openPropertiesModal(true)}>
          <span>+</span> Price
        </a>
      </span>);
    }
    if (propertyTypeFilter) {
      propertyTypeElement = (
        <FilterTag handleRemoveFilter={this.handlePropertyTypeRemove.bind(this)} display={propertyFilter} value={propertyFilter} />
      );
    }

    if (sqftFilter) {
      sqftElement = (
        <FilterTag handleRemoveFilter={this.handleSQFTFilterRemove.bind(this)} display={Util.sqftFilterSearchTagText(sqftFilter)} value={sqftFilter} />
      );
    }

    let termFilter = filters['term'];
    let termFilterElement;
    let termFilters = termFilter.map(t => {
      return {tax: Object.keys(t)[0], value: Object.values(t)[0]}
    });
    if (termFilters && termFilters.length) {
      termFilterElement = termFilters.map((t, i) =>
        <FilterTag key={JSON.stringify(t)} handleRemoveFilter={i !== 0 ? (() => this.handleTermFilterRemove.bind(this)(t)) : null} display={t.value} value={t.value} />
      );
    }

    return (
      <form method="get" className="clearfix">
        <div className={Lib.THEME_CLASSES_PREFIX+"bs-tags-box"}>
          <div className={Lib.THEME_CLASSES_PREFIX+"bs-tags-input"}>
            {termFilterElement}
            {bathroomsElement}
            {bedroomsElement}
            {priceElement}
            {sqftElement}
            {lotSizeElement}
            {propertyTypeElement}
            <span className={`${Lib.THEME_CLASSES_PREFIX}tag badge badge-default ${Lib.THEME_CLASSES_PREFIX}addfilter`}>
              <a href="#" onClick={() => this.props.openPropertiesModal(true)}>
                <span>+</span>
                More Filters
              </a>
            </span>
          </div>
        </div>
        <input type="text" defaultValue="Raleigh,Raleigh2" data-role="tagsinput" className={Lib.THEME_CLASSES_PREFIX+"tagsinput"} />
        {/* <i className="fa fa-search"></i> */}
      </form>
    );
  }
};

export default connect(
  null,
  mapDispatchToProps
)(searchFilters);
