import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import qs from 'qs';
import URI from 'urijs';

import Api from '../../containers/Api.jsx';
import {
  openPropertiesModal,
  openLocationModal,
  raiseErrorMessage,
  receiveSearchResultsPosts,
  requestSearchResultsPostsResetFetching,
  requestSearchResultsPosts,
  setPropertiesModalResultCountLoading,
  toggleMapSearchResultsLoading,
  togglePropertiesModalModeInLocationModal,
  updatePropertiesModalResultCount
} from '../../actions/index.jsx';
import Util from '../Util.jsx';
import { Lib } from '../../lib.jsx';
import ErrorMessage from '../ErrorMessage.jsx';
import PropertiesModal from '../Modals/PropertiesModal.jsx';
import LocationModal from '../Modals/LocationModal.jsx';
import Map from './Map.jsx';
import SearchResultListing from './SearchResultListing.jsx';
import SearchFilterDescriptionText from './SearchFilterDescriptionText.jsx';
import CarouselOnMap from './CarouselOnMap.jsx';

const isMobile = window.innerWidth < 576;


const mapStateToProps = (state, ownProps) => {
  let allQueryParams = qs.parse(ownProps.location.search.replace('?', ''));
  return {
    allQueryParams: allQueryParams,
    errorMessage: state.errorMessage,
    query: get(state, 'searchResults.query', []),
    isFetching: get(state, 'searchResults.isFetching', []),
    displayedResults: get(state, 'searchResults.displayedResults', []),
    searchQueryParams: allQueryParams[Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX],
    propertiesModalOpen: get(state, 'propertiesModal.open'),
    propertiesModalResultCountButtonLoading: get(state, 'propertiesModal.resultCountButtonLoading'),
    propertiesModalResultCount: get(state, 'propertiesModal.resultCount'),
    propertyTypeOptions: get(state, 'propertyTypeOptions.options'),
    results: get(state, 'searchResults.searchResults', []),
    resultsTotal: get(state, 'searchResults.totalProps', 0),
    saleTypesPanelOpen: get(state, 'headerSearch.saleTypesPanelOpen', false)
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    closeLocationModal: () => {
      dispatch(openLocationModal(false));
    },

    doPropertiesModalSearch: (filters) => {
      dispatch(setPropertiesModalResultCountLoading(true));
      Api.makeStandardPropertySearch(filters, (err, query, response) => {
        // we are ignoring handling the error here intentionally as the error is handled as soon as the modal is closed
        dispatch(setPropertiesModalResultCountLoading(false));
        dispatch(updatePropertiesModalResultCount(get(response, 'hits.total', null)));
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
        dispatch(receiveSearchResultsPosts(query, get(response, 'hits.hits', []), get(response, 'hits.total', 0), append));
      });
    },

    openPropertiesModal: open => {
      dispatch(openPropertiesModal(open));
    },

    openLocationModal: () => {
      dispatch(openLocationModal(true));
    },

    resetSearchResults: () => {
      dispatch(receiveSearchResultsPosts({}, [], 0));
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
        dispatch(receiveSearchResultsPosts(query, get(response, 'hits.hits', []), get(response, 'hits.total', 0), false));
      });
    },

    togglePropertiesModalModeInLocationModal: on => {
      dispatch(togglePropertiesModalModeInLocationModal(on));
    }
  };
};

class MapSearchResults extends Component {
  static propTypes = {
    doPropertiesModalSearch: PropTypes.func.isRequired,
    doSearchWithQuery: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
    location: PropTypes.object,
    params: PropTypes.object,
    propertiesModalOpen: PropTypes.bool.isRequired,
    propertiesModalResultCount: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    propertiesModalResultCountButtonLoading: PropTypes.bool.isRequired,
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
    let filters = qs.parse(window.location.search.replace('?', ''));
    if (!isEqual(nextProps.searchQueryParams, this.props.searchQueryParams)) {
      this.applyQueryFilters();
    }

    if (nextProps.displayedResults.length > 0 && !filters.selected_property && isMobile) {
      this.updateSelectedProperty(nextProps.displayedResults[0]._id);
    }
    if (nextProps.searchQueryParams.search_type !== this.props.searchQueryParams.search_type) {
      // this fixes the issue where changing "search_type" would keep the scrolling of the previous search type
      let listingSidebar = this.listingSidebar;
      listingSidebar.scrollTop = 0;
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
    this.setState({
      mapDisplay
    });
  }

  updateSelectedProperty = (propertyId) => {
    let filter = {'selected_property': propertyId};
    let queryParam = Util.updateQueryFilter(window.location.href, filter, 'set', false);
    // TODO: use location passed in
    this.props.history.push(window.location.pathname + decodeURIComponent(queryParam))
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
    this.props.history.push(constructedQuery);
  }

  render() {
    let {
      allQueryParams,
      errorMessage,
      displayedResults,
      doPropertiesModalSearch,
      history,
      isFetching,
      location,
      openPropertiesModal,
      propertiesModalOpen,
      propertiesModalResultCount,
      propertiesModalResultCountButtonLoading,
      propertyTypeOptions,
      results,
      resultsTotal
    } = this.props;
    let filters = qs.parse(window.location.search.replace('?', ''));
    let searchFilters = filters[Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX];
    const captionElement = (this.state.noticeDisplay && displayedResults.length > 0)
      ? (
          <div className={Lib.THEME_CLASSES_PREFIX + "caption"}>
            <span className={Lib.THEME_CLASSES_PREFIX + "caption-content"}>
              Showing {displayedResults.length} of {resultsTotal} listings. Browse to load more or adjust filters.
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
        currentGeoBounds={searchFilters.geoCoordinates ? Util.elasticsearchGeoFormatToGoogle(searchFilters.geoCoordinates) : null} 
        historyPush={history.push}
        location={this.props.location}
        properties={displayedResults}
        searchByCoordinates={this.updateURIGeoCoordinates.bind(this)}
        selectedProperty={filters.selected_property}
      />
    );

    const sliderElement = (
      <CarouselOnMap
        properties={displayedResults}
        selectedProperty={filters.selected_property}
        onChangeSlide={this.updateSelectedProperty}
      />
    );


    let elementToShow = (
      <div className={`${Lib.THEME_CLASSES_PREFIX}search-map`}>

        <PropertiesModal
          closeLocationModal={this.props.closeLocationModal}
          closeModal={() => openPropertiesModal(false)}
          doSearch={doPropertiesModalSearch}
          historyPush={history.push}
          open={propertiesModalOpen}
          openLocationModal={this.props.openLocationModal}
          propertyTypeOptions={propertyTypeOptions}
          resultCount={propertiesModalResultCount}
          resultCountButtonLoading={propertiesModalResultCountButtonLoading}
          searchFilters={omit(searchFilters, ['geoCoordinates'])}
          turnOffPropertiesModalModeInLocationModal={() => this.props.togglePropertiesModalModeInLocationModal(false)}
          turnOnPropertiesModalModeInLocationModal={() => this.props.togglePropertiesModalModeInLocationModal(true)}
        />

        <section className={`${Lib.THEME_CLASSES_PREFIX}search-map-section row no-gutters h-100`}>
          <div className={`col-sm-6 col-lg-4 h-100 ${Lib.THEME_CLASSES_PREFIX}listing-map ${!this.state.mapDisplay? 'hidden-xs-down': ''}`}>
            { captionElement }
            { mapElement }
            { isMobile && sliderElement }
          </div>

          { (!isMobile || !this.state.mapDisplay) &&
            <div className={`col-sm-6 col-lg-8 h-100 ${Lib.THEME_CLASSES_PREFIX}listing-sidebar`} ref={(r) => this.listingSidebar = r}>
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
          }

          { isMobile && mobileNavigatorElement }

        </section>
      </div>
    );
    return (
      <div className={Lib.THEME_CLASSES_PREFIX + "search-map-container h-100"}>
        {elementToShow}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapSearchResults);
