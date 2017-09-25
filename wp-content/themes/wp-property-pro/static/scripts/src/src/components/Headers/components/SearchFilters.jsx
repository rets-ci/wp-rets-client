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


let mobileViewCheck = () => window.innerWidth < Lib.MOBILE_WIDTH;

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

    this.state = {
      isMobileView: mobileViewCheck()
    };
  }

  componentDidMount() {
    this.updateDisplayFlag();
    window.addEventListener('resize', this.updateDisplayFlag);
  }

  componentWillReceiveProps() {
    this.updateDisplayFlag();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDisplayFlag);
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

  updateDisplayFlag = () => {
    this.setState({
      isMobileView: mobileViewCheck()
    })
  }

  updateURLWithQueryParam(queryParam) {
    this.props.history.push(window.location.pathname + decodeURIComponent(queryParam))
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
        <FilterTag handleRemoveFilter={this.handleBathroomsFilterRemove.bind(this)} display={bathroomsFilter + `+ Baths`} value={bathroomsFilter} />
      );
    } else if (staticFilters['bathrooms']) {
      bathroomsElement = (<span className={`${Lib.THEME_CLASSES_PREFIX}tag badge badge-default ${Lib.THEME_CLASSES_PREFIX}addfilter`}>
        <span>+</span> Bathroom
      </span>);
    }

    if (bedroomsFilter) {
      bedroomsElement = (
        <FilterTag handleRemoveFilter={this.handleBedroomsFilterRemove.bind(this)} display={bedroomsFilter + `+ Beds`} value={bedroomsFilter} />
      );
    } else if (staticFilters['bedrooms']) {
      bedroomsElement = (<span className={`${Lib.THEME_CLASSES_PREFIX}tag badge badge-default ${Lib.THEME_CLASSES_PREFIX}addfilter`}>
        <span>+</span> Bedroom
      </span>);
    }

    if (priceFilter) {
      priceElement = (
        <FilterTag handleRemoveFilter={this.handlePriceFilterRemove.bind(this)} display={Util.priceFilterSearchTagText(priceFilter)} value={priceFilter} />
      );
    } else if (staticFilters['price']) {
      priceElement = (<span className={`${Lib.THEME_CLASSES_PREFIX}tag badge badge-default ${Lib.THEME_CLASSES_PREFIX}addfilter`}>
        <span>+</span> Price
      </span>);
    }

    if (lotSizeFilter) {
      lotSizeElement = (
        <FilterTag handleRemoveFilter={this.handleLotSizefilterRemove.bind(this)} display={Util.lotSizeFilterSearchTagText(lotSizeFilter)} value={lotSizeFilter} />
      )
    } else if (staticFilters['lotSize']) {
      lotSizeElement = (<span className={`${Lib.THEME_CLASSES_PREFIX}tag badge badge-default ${Lib.THEME_CLASSES_PREFIX}addfilter`}>
        <span>+</span> Lot Size
      </span>);
    }

    if (sqftFilter) {
      sqftElement = (
        <FilterTag handleRemoveFilter={this.handleSQFTFilterRemove.bind(this)} display={Util.sqftFilterSearchTagText(sqftFilter)} value={sqftFilter} />
      );
    } else if (staticFilters['sqft']) {
      sqftElement = (<span className={`${Lib.THEME_CLASSES_PREFIX}tag badge badge-default ${Lib.THEME_CLASSES_PREFIX}addfilter`}>
        <span>+</span> SQFT
      </span>);
    }

    let termFilter = filters['term'];
    let termFilterElement;
    let termFilters = termFilter.map(t => {
      return {tax: Object.keys(t)[0], value: Object.values(t)[0]}
    });
    if (this.state.isMobileView) {
      termFilters = termFilters.slice(0, 1);
    }
    if (termFilters && termFilters.length) {
      if (termFilters.length === 1) {
        termFilterElement = <FilterTag key={JSON.stringify(termFilters[0])} handleRemoveFilter={this.props.openLocationModal} display={termFilters[0].value} value={termFilters[0].value} />;
      } else {
        termFilterElement = termFilters.map((t, i) =>
          <FilterTag key={JSON.stringify(t)} handleRemoveFilter={() => this.handleTermFilterRemove.bind(this)(t)} display={t.value} value={t.value} />
        );
      }
    }
    return (
      <form method="get" className="clearfix" onClick={() => this.props.openPropertiesModal(true)}>
        <div className="gradient-overlay"></div>
        <div className={Lib.THEME_CLASSES_PREFIX+"bs-tags-box"}>
          <div className={Lib.THEME_CLASSES_PREFIX+"bs-tags-input"}>
            {termFilterElement}
            {bathroomsElement}
            {bedroomsElement}
            {priceElement}
            {lotSizeElement}
            {sqftElement}
            <span className={`${Lib.THEME_CLASSES_PREFIX}tag badge badge-default ${Lib.THEME_CLASSES_PREFIX}addfilter`}>
              <span>+</span>
              More Filters
            </span>
          </div>
        </div>
        <input type="text" defaultValue="Raleigh,Raleigh2" data-role="tagsinput" className={Lib.THEME_CLASSES_PREFIX+"tagsinput"} />
        {/* <i className="fa fa-search"></i> */}
      </form>
    );
  }
};

export default withRouter(connect(
  null,
  mapDispatchToProps
)(searchFilters));
