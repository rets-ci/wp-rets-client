import Api from '../../containers/Api.jsx';
import {setSearchResults} from '../../actions/index.jsx';
import LoadingCircle from '../LoadingCircle.jsx';
import Map from './Map.jsx';
import PropertiesModal from './PropertiesModal.jsx';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import SearchResultListing from './SearchResultListing.jsx';
import Util from '../Util.jsx';
import {Lib} from '../../lib.jsx';
import _ from 'lodash';

const mapStateToProps = (state, ownProps) => {
  return {
    query: _.get(state, 'searchResults.query', []),
    displayedResults: _.get(state, 'searchResults.displayedResults', []),
    queryParams: ownProps.location.query,
    propertiesModalOpen: state.propertiesModal ? state.propertiesModal.open : false,
    results: _.get(state, 'searchResults.searchResults', []),
    resultsTotal: _.get(state, 'searchResults.totalProps', 0)
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    standardSearch: (params) => {
      let {
        locationFilter,
        property_types,
        geoCoordinates
      } = params;
      let pt = property_types.split(Lib.STRING_ARRAY_DELIMITER);
      let searchParams = {
        ...params,
        bottomRight: geoCoordinates ? geoCoordinates.bottomRight : null,
        locationFilter: locationFilter || false,
        property_types: pt,
        size: Lib.PROPERTY_PER_PAGE,
        topLeft: geoCoordinates ? geoCoordinates.topLeft : null
      };
      let query = Api.createESSearchQuery(searchParams);
      Api.search(query, function (response) {
        if (_.get(response, 'hits.total', null)) {
          dispatch(setSearchResults(query, _.get(response, 'hits.hits', []), _.get(response, 'hits.total', 0), false));
        } else {
          console.log('query with params returned no data');
        }
      });
    },
    doSearchWithQuery: (query, append) => {
      Api.search(query, response => {
        if (_.get(response, 'hits.total', null)) {
          dispatch(setSearchResults(query, _.get(response, 'hits.hits', []), _.get(response, 'hits.total', 0), append));
        } else {
          console.log('query with standard query returned no data');
        }
      });
    },
    resetSearchResults: () => {
      dispatch(setSearchResults({}, [], 0));
    }
  };
};

class MapSearchResults extends Component {
  static propTypes = {
    doSearchWithQuery: PropTypes.func.isRequired,
    location: PropTypes.object,
    params: PropTypes.object,
    resetSearchResults: PropTypes.func.isRequired,
    results: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.displayedProperties = [];
  }

  componentDidMount() {
    this.applyQueryFilters();
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.queryParams, this.props.queryParams)) {
      this.props.resetSearchResults();
      this.applyQueryFilters();
    }

  }

  seeMoreHandler() {
    let modifiedQuery = this.props.query;
    modifiedQuery.from = this.props.displayedResults.length;
    this.props.doSearchWithQuery(modifiedQuery, true);
  }

  applyQueryFilters() {
    let searchFiltes = Util.getSearchFiltersFromURL(window.location.href);
    this.props.standardSearch(searchFiltes);
  }

  render() {
    let {
      sale,
      tax,
      term
    } = this.props.params;
    let {
      displayedResults,
      location,
      propertiesModalOpen,
      results
    } = this.props;
    let propertyTypes = location.query['wpp_search[property_types]'];
    let searchFilters = Util.getSearchFiltersFromURL(window.location.href);
    return (
      <div>
        {displayedResults.length ?
          <div>
            <PropertiesModal searchFilters={searchFilters} standardSearch={this.props.standardSearch}
                             open={propertiesModalOpen}/>
            <section className={`container-fluid ${Lib.THEME_CLASSES_PREFIX}search-map-container`}>
              <div className={Lib.THEME_CLASSES_PREFIX + "listing-map"}>
                <div className={Lib.THEME_CLASSES_PREFIX + "caption"}>
                  <span>Only showing {displayedResults.length}
                    listings. Zoom in, or use filters to narrow your search.</span>
                </div>
                <Map properties={displayedResults}
                     searchByCoordinates={(locationFilter, geoCoordinates) => this.props.standardSearch({
                       ...Util.getSearchFiltersFromURL(window.location.href),
                       locationFilter: locationFilter,
                       geoCoordinates: geoCoordinates
                     })}/>
              </div>
              <div className={Lib.THEME_CLASSES_PREFIX + "listing-sidebar"}>
                <div className={Lib.THEME_CLASSES_PREFIX + "headtitle"}>
                  <h1>{term} Homes for {sale}</h1>
                  <p>There are {this.props.resultsTotal} homes for sale that are priced between $250,000 and $500,00
                    with three to five betweens and two to three bathrooms.</p>
                </div>
                <SearchResultListing allowPagination={this.props.resultsTotal > this.props.displayedResults.length}
                                     properties={displayedResults} seeMoreHandler={this.seeMoreHandler.bind(this)}/>
              </div>
            </section>
          </div>
          : <LoadingCircle additionalClass={Lib.THEME_CLASSES_PREFIX + "search-result-loading"}/>}
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapSearchResults);
