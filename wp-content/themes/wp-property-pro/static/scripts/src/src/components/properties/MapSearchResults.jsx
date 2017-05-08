import Api from '../../containers/Api.jsx';
import {setSearchResults, toggleMapSearchResultsLoading} from '../../actions/index.jsx';
import LoadingCircle from '../LoadingCircle.jsx';
import Map from './Map.jsx';
import PropertiesModal from '../Modals/PropertiesModal.jsx';
import LocationModal from '../Modals/LocationModal.jsx';
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
    mapSearchResultsLoading: state.mapSearchResultsLoading.loading,
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
      dispatch(toggleMapSearchResultsLoading(true));
      Api.search(query, function (response) {
        dispatch(toggleMapSearchResultsLoading(false));
        if (_.get(response, 'hits.total', null)) {
          dispatch(setSearchResults(query, _.get(response, 'hits.hits', []), _.get(response, 'hits.total', 0), false));
        } else {
          console.log('query with params returned no data');
        }
      });
    },
    doSearchWithQuery: (query, append) => {
      // dispatch(toggleMapSearchResultsLoading(true));
      Api.search(query, response => {
        // dispatch(toggleMapSearchResultsLoading(false));
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
    mapSearchResultsLoading: PropTypes.bool.isRequired,
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
    let searchFilters = Util.getSearchFiltersFromURL(window.location.href, true);
    this.props.standardSearch(searchFilters);
  }

  render() {
    let {
      displayedResults,
      location,
      mapSearchResultsLoading,
      propertiesModalOpen,
      results
    } = this.props;
    let propertyTypes = location.query['wpp_search[property_types]'];
    let searchFilters = Util.getSearchFiltersFromURL(window.location.href, false);

    let elementToShow;
    if (mapSearchResultsLoading) {
      elementToShow = (<LoadingCircle additionalClass={Lib.THEME_CLASSES_PREFIX + "search-result-loading"}/>);
    } else {
      elementToShow = (
        <div className={Lib.THEME_CLASSES_PREFIX+"search-map row"}>
          <LocationModal />
          <PropertiesModal searchFilters={searchFilters} standardSearch={this.props.standardSearch}
                           open={propertiesModalOpen}/>
          <section className={`${Lib.THEME_CLASSES_PREFIX}search-map-container row no-gutters`}>
            <div className="col-lg-4 col-xl-3">
              <div className={Lib.THEME_CLASSES_PREFIX + "listing-map"}>
                <div className={Lib.THEME_CLASSES_PREFIX + "caption"}>
            <span className={Lib.THEME_CLASSES_PREFIX + "caption-content"}>Only showing {displayedResults.length}
              listings. Zoom in, or use filters to narrow your search.</span>
                </div>
                {displayedResults.length &&
                <Map properties={displayedResults}
                     searchByCoordinates={(locationFilter, geoCoordinates) => this.props.standardSearch({
                       ...Util.getSearchFiltersFromURL(window.location.href, true),
                       locationFilter: locationFilter,
                       geoCoordinates: geoCoordinates
                     })}/>
                }
              </div>
            </div>
            <div className="col-lg-8 col-xl-9 hidden-md-down">
              {displayedResults.length ?
                <div className={Lib.THEME_CLASSES_PREFIX + "listing-sidebar"}>
                  <div className={Lib.THEME_CLASSES_PREFIX + "headtitle"}>
                    <h1>Homes for {searchFilters.sale_type}</h1>
                    <p>There are {this.props.resultsTotal} homes for {searchFilters.sale_type} that are priced
                      between
                      $250,000 and $500,00
                      with three to five betweens and two to three bathrooms.</p>
                  </div>
                  <SearchResultListing
                    allowPagination={this.props.resultsTotal > this.props.displayedResults.length}
                    properties={displayedResults} seeMoreHandler={this.seeMoreHandler.bind(this)}/>
                </div>
                :
                <div className={Lib.THEME_CLASSES_PREFIX + "listing-sidebar"}>
                  <div className={Lib.THEME_CLASSES_PREFIX + "headtitle"}>
                    <h1>No results to show. Please adjust the filters to select a different range of properties</h1>
                  </div>
                </div>
              }
            </div>
            <div className={`${Lib.THEME_CLASSES_PREFIX}search-map-mobile-navigation hidden-lg-up`}>
              <nav className="navbar navbar-toggleable-md">
                <div className={Lib.THEME_CLASSES_PREFIX + "search-map-mobile-navigation-items"}>
                  <ul className={`${Lib.THEME_CLASSES_PREFIX}search-map-mobile-navigation-switchers navbar-nav mr-auto`}>
                    <li className="nav-item"><a className="btn" href="#">Filter</a></li>
                    <li className="nav-item"><a className="btn" href="#">List</a></li>
                  </ul>
                  <a href="#" className="btn">Search</a>
                </div>
              </nav>
            </div>
          </section>
        </div>
      );
    }
    return (
      <div>
        {elementToShow}
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapSearchResults);
