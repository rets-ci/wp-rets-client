import Api from '../../containers/Api.jsx';
import {
  openPropertiesModal,
  raiseErrorMessage,
  receiveSearchResultsPosts,
  requestSearchResultsPostsResetFetching,
  requestSearchResultsPosts,
  toggleMapSearchResultsLoading
} from '../../actions/index.jsx';
import ErrorMessage from '../ErrorMessage.jsx';
import Map from './Map.jsx';
import PropertiesModal from '../Modals/PropertiesModal.jsx';
import LocationModal from '../Modals/LocationModal.jsx';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import SearchResultListing from './SearchResultListing.jsx';
import SearchFilterDescriptionText from './SearchFilterDescriptionText.jsx';
import Util from '../Util.jsx';
import {Lib} from '../../lib.jsx';
import _ from 'lodash';
import qs from 'qs';
import URI from 'urijs';

const mapStateToProps = (state, ownProps) => {
  let allQueryParams = ownProps.location.query ? qs.parse(ownProps.location.query) : {};
  return {
    allQueryParams: allQueryParams,
    errorMessage: state.errorMessage,
    front_page_post_content: ownProps.front_page_post_content,
    query: _.get(state, 'searchResults.query', []),
    isFetching: _.get(state, 'searchResults.isFetching', []),
    displayedResults: _.get(state, 'searchResults.displayedResults', []),
    searchQueryParams: allQueryParams[Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX],
    mapSearchResultsLoading: state.mapSearchResultsLoading.loading,
    propertiesModalOpen: state.propertiesModal ? state.propertiesModal.open : false,
    results: _.get(state, 'searchResults.searchResults', []),
    resultsTotal: _.get(state, 'searchResults.totalProps', 0),
    saleTypesPanelOpen: _.get(state, 'headerSearch.saleTypesPanelOpen', false)
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    openPropertiesModal: open => {
      dispatch(openPropertiesModal(open));
    },

    standardSearch: (errorMessage, params) => {
      dispatch(requestSearchResultsPosts());
      Api.makeStandardPropertySearch(params, (err, query, response) => {
        if (err) {
          dispatch(requestSearchResultsPostsResetFetching());
          return dispatch(raiseErrorMessage(err));
        }
        if (!err && errorMessage) {
          dispatch(resetErrorMessage());
        }
        dispatch(receiveSearchResultsPosts(query, _.get(response, 'hits.hits', []), _.get(response, 'hits.total', 0), false));
      });
    },

    doSearchWithQuery: (errorMessage, query, append) => {
      let url = Api.getPropertySearchRequestURL();
      dispatch(requestSearchResultsPosts());
      Api.search(url, query, (err, response) => {
        if (err) {
          dispatch(requestSearchResultsPostsResetFetching());
          return dispatch(raiseErrorMessage(err));
        }
        if (!err && errorMessage) {
          dispatch(resetErrorMessage());
        }
        dispatch(receiveSearchResultsPosts(query, _.get(response, 'hits.hits', []), _.get(response, 'hits.total', 0), append));
      });
    },
    resetSearchResults: () => {
      dispatch(receiveSearchResultsPosts({}, [], 0));
    }
  };
};

class MapSearchResults extends Component {
  static propTypes = {
    doSearchWithQuery: PropTypes.func.isRequired,
    front_page_post_content: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    location: PropTypes.object,
    mapSearchResultsLoading: PropTypes.bool.isRequired,
    params: PropTypes.object,
    resetSearchResults: PropTypes.func.isRequired,
    results: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      mapDisplay: true,
      noticeDisplay: true,
    };
    this.displayedProperties = [];
  }

  componentDidMount() {
    this.applyQueryFilters();
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.searchQueryParams, this.props.searchQueryParams)) {
      this.applyQueryFilters();
    }
  }

  componentWillUnmount() {
    this.props.resetSearchResults();
  }

  dismissNotice = () => {
    this.setState({ noticeDisplay: false })
  }

  seeMoreHandler = () => {
    let modifiedQuery = this.props.query;
    modifiedQuery.from = this.props.displayedResults.length;
    this.props.doSearchWithQuery(this.props.errorMessage, modifiedQuery, true);
  }

  applyQueryFilters() {
    let searchFilters = Util.getSearchFiltersFromURL(window.location.href, true);
    this.props.standardSearch(this.props.errorMEssage, searchFilters);
  }

  clickMobileSwitcherHandler(mapDisplay) {
    let state = this.state;
    state.mapDisplay = mapDisplay;
    this.setState({
      state
    });
  }

  updateURIGeoCoordinates(geoCoordinates) {
    //TODO: this should be refactored to use the URL related functions in Util.jsx
    // update URL
    let url = new URI(window.location.href);
    let queryParam = window.location.search.replace('?', '');
    let currentFilters = qs.parse(queryParam);
    // remove any current geoCorrdinates before adding additional ones
    delete currentFilters[Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX]['geoCoordinates'];
    // remove selected property as well
    delete currentFilters['selected_property'];
    currentFilters[Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX]['geoCoordinates'] = geoCoordinates;
    let newSearchQuery = '?' + qs.stringify(currentFilters);
    let constructedQuery = decodeURIComponent(url.pathname() + newSearchQuery);
    browserHistory.push(constructedQuery);
  }

  render() {
    let {
      allQueryParams,
      errorMessage,
      displayedResults,
      front_page_post_content,
      isFetching,
      location,
      mapSearchResultsLoading,
      openPropertiesModal,
      propertiesModalOpen,
      results
    } = this.props;

    let filters = qs.parse(window.location.search.replace('?', ''));
    let searchFilters = filters[Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX];

    const captionElement = (this.state.noticeDisplay && displayedResults.length > 0)
      ? (
          <div className={Lib.THEME_CLASSES_PREFIX + "caption"}>
            <span className={Lib.THEME_CLASSES_PREFIX + "caption-content"}>
              Only showing {displayedResults.length} listings. Explore the map, or use filters to narrow your search.
            </span>
            <span className={Lib.THEME_CLASSES_PREFIX + "caption-dismiss"} onClick={this.dismissNotice}>x</span>
          </div>
        )
      : null

    const mobileNavigatorElement = (
      <div className={`${Lib.THEME_CLASSES_PREFIX}mobile-bottom-navbar fixed-bottom hidden-sm-up d-flex`}>
        <div className={`${Lib.THEME_CLASSES_PREFIX}mobile-bottom-navbar-left`}>
          <span onClick={ () => openPropertiesModal(true) }>
            Filter
          </span>
          <span className="separator">|</span>
          <span onClick={ () => this.clickMobileSwitcherHandler.bind(this)(!this.state.mapDisplay) }>
            {this.state.mapDisplay ? 'List' : 'Map'}
          </span>
        </div>
        <div className={`${Lib.THEME_CLASSES_PREFIX}mobile-bottom-navbar-right`}>
        </div>
      </div>
    );

    const mapElement = (
      <Map
        properties={displayedResults}
        currentGeoBounds={searchFilters.geoCoordinates ? Util.elasticsearchGeoFormatToGoogle(searchFilters.geoCoordinates) : null} 
        searchByCoordinates={this.updateURIGeoCoordinates.bind(this)}
        selectedProperty={filters.selected_property}
      />
    );

    let elementToShow = (
      <div className={`${Lib.THEME_CLASSES_PREFIX}search-map h-100`}>

        <LocationModal />

        <PropertiesModal
          open={propertiesModalOpen}
          front_page_post_content={front_page_post_content}
        />

        <section className={`${Lib.THEME_CLASSES_PREFIX}search-map-section row no-gutters h-100`}>
          <div className={`col-sm-4 h-100 ${Lib.THEME_CLASSES_PREFIX}listing-map ${!this.state.mapDisplay? 'hidden-xs-down': ''}`}>
            { captionElement }
            { mapElement }
          </div>

          <div className={`col-sm-8 h-100 ${Lib.THEME_CLASSES_PREFIX}listing-sidebar ${this.state.mapDisplay? 'hidden-xs-down': ''}`}>
            <SearchFilterDescriptionText
              bathrooms={searchFilters.bathrooms}
              bedrooms={searchFilters.bedrooms}
              price={searchFilters.price}
              saleType={searchFilters.sale_type}
              total={this.props.resultsTotal}
            />
            
            { this.props.displayedResults.length > 0
              ?
                <SearchResultListing
                  allowPagination={this.props.resultsTotal > this.props.displayedResults.length}
                  isFetching={isFetching}
                  properties={displayedResults}
                  seeMoreHandler={this.seeMoreHandler}
                  selectedProperty={filters.selected_property}
                  total={this.props.resultsTotal}
                />
              :
                (errorMessage
                  ?
                    <ErrorMessage message={errorMessage} />
                  :
                    (
                      !isFetching ?
                        <p className={`${Lib.THEME_CLASSES_PREFIX}gentle-error`}>Nothing to show. Please try adjusting the search parameters</p>
                      : 
                      null
                    )
                )
            }
          </div>

          { mobileNavigatorElement }

        </section>
      </div>
    );

    return (
      <div className={Lib.THEME_CLASSES_PREFIX + "search-map-container h-100"}>
        {elementToShow}
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapSearchResults);
