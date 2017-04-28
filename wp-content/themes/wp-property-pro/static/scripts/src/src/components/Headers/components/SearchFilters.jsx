import {openPropertiesModal} from '../../../actions/index.jsx';
import FilterTag from '../../FilterTag.jsx';
import {Lib} from '../../../lib.jsx';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Util from '../../Util.jsx';

const mapStateToProps = (state, ownProps) => {
  return {
    filters: ownProps.filters
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {

    openPropertiesModal: open => {
      dispatch(openPropertiesModal(open));
    },

    removeSearchFilter(filter) {
      let queryParam = Util.updateQueryFilter(window.location.href, filter, 'remove', false);
      Util.goToUrl(window.location.pathname + decodeURIComponent(queryParam));
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
    this.props.removeSearchFilter(filter);
  }

  handleBedroomsFilterRemove(bedroomFilter) {
    let filter = {
      [Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + '[bedrooms]']: bedroomFilter
    };
    this.props.removeSearchFilter(filter);
  }

  handlePriceFilterRemove(priceFilter) {
    let filter = {
      [Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + "[price][start]"]: priceFilter.start,
      [Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + "[price][to]"]: priceFilter.to,
    };
    this.props.removeSearchFilter(filter);
  }

  handleSQFTFilterRemove(sqftFilter) {
    let filter = {
      [Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + "[sqft][start]"]: sqftFilter.start,
      [Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX + "[sqft][to]"]: sqftFilter.to,
    };
    this.props.removeSearchFilter(filter);
  }

  render() {
    let {
      filters
    } = this.props;
    let bathroomsElement;
    let bathroomsFilter = filters['bathrooms'];
    let bedroomsFilter = filters['bedrooms'];
    let bedroomsElement;
    let priceFilter = filters['price'];
    let priceElement;
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

    if (sqftFilter) {
      sqftElement = (
        <FilterTag handleRemoveFilter={this.handleSQFTFilterRemove.bind(this)} display={Util.sqftFilterSearchTagText(sqftFilter)} value={sqftFilter} />
      );
    }

    let termFilter = filters['term'];
    let termFilters = Object.keys(termFilter).map(t => {
      return {tax: t, value: termFilter[t]}
    });
    return (
      <div className={Lib.THEME_CLASSES_PREFIX+"search-box-wrap"}>
        <form method="get" className="clearfix hidden-md-down">
          <div className={Lib.THEME_CLASSES_PREFIX+"bs-tags-box"}>
            <div className={Lib.THEME_CLASSES_PREFIX+"bs-tags-input"}>
              {termFilters.map(t =>
                <span key={t.value} className={`${Lib.THEME_CLASSES_PREFIX}tag badge badge-default`}>
                  <span>
                    <i className="fa fa-times" onClick={() => this.props.openPropertiesModal(true)}></i>
                  </span>
                  {t.value}
                </span>
              )}
              {bathroomsElement}
              {bedroomsElement}
              {priceElement}
              {sqftElement}
              <span className={`${Lib.THEME_CLASSES_PREFIX}tag badge badge-default ${Lib.THEME_CLASSES_PREFIX}addfilter`}>
                <a href="#" onClick={() => this.props.openPropertiesModal(true)}>
                  <span>+</span>
                  More Filters
                </a>
              </span>
            </div>
          </div>
          <input type="text" defaultValue="Raleigh,Raleigh2" data-role="tagsinput" className={Lib.THEME_CLASSES_PREFIX+"tagsinput"} />
          <i className="fa fa-search"></i>
        </form>
      </div>
    );
  }
};

export default connect(
  null,
  mapDispatchToProps
)(searchFilters);
