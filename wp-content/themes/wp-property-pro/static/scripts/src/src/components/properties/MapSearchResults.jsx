import ErrorMessageModal from '../ErrorMessageModal.jsx';
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
  receivePropertiesModalResultCount,
  receivePropertiesModalResultCountFetchingError,
  requestPropertiesModalResultCount,
  receiveSearchResultsPosts,
  receiveSearchResultsPostsError,
  requestSearchResultsPosts,
  receiveTermDetails,
  toggleMapSearchResultsLoading,
  togglePropertiesModalModeInLocationModal,
} from '../../actions/index.jsx';
import Util from '../Util.jsx';
import { Lib } from '../../lib.jsx';
import ErrorMessage from '../ErrorMessage.jsx';
import HeaderSearch from '../Headers/HeaderSearch.jsx';
import PropertiesModal from '../Modals/PropertiesModal.jsx';
import LocationModal from '../Modals/LocationModal.jsx';
import Map from './Map.jsx';
import SearchResultListing from './SearchResultListing.jsx';
import SearchFilterDescriptionText from './SearchFilterDescriptionText.jsx';
import CarouselOnMap from './CarouselOnMap.jsx';
import PropertyPanelOnMap from 'app_root/components/properties/Components/PropertyPanelOnMap.jsx';

const isMobile = window.innerWidth < 576;


const mapStateToProps = (state, ownProps) => {

  let searchQueryParamsCollection = Util.URLSearchParse('search', window.location.href);
  let searchQueryObject = Util.searchCollectionToObject(searchQueryParamsCollection);
  let termDetails = Util.reddoorTermDetailsFromSearchParam(searchQueryParamsCollection);
  searchQueryObject = Util.searchObjectToCustomFormat(searchQueryObject);
  searchQueryObject['term'] = termDetails;
  for (var key in searchQueryObject) {
    if (termDetails.map(d => d.term).indexOf(key) >= 0) {
      delete searchQueryObject[key];
    }
  }
  
  return {
    errorMessage: state.errorMessage,
    query: get(state, 'searchResults.query', []),
    isFetching: get(state, 'searchResults.isFetching', []),
    displayedResults: get(state, 'searchResults.displayedResults', []),
    propertiesModalOpen: get(state, 'propertiesModal.open'),
    propertiesModalResultCountErrorMessage: get(state, 'propertiesModal.errorMessage'),
    propertiesModalResultCountIsFetching: get(state, 'propertiesModal.isFetching'),
    propertiesModalResultCount: get(state, 'propertiesModal.resultCount'),
    propertyTypeOptions: get(state, 'propertyTypeOptions.options'),
    results: get(state, 'searchResults.searchResults', []),
    resultsTotal: get(state, 'searchResults.totalProps', 0),
    propertyOnPanel: state.singleProperty.propertyOnPanel,
    panelOnMapShown: state.singleProperty.panelOnMapShown,
    saleTypesPanelOpen: get(state, 'headerSearch.saleTypesPanelOpen', false),
    searchQueryParams: searchQueryObject,
    searchResultsErrorMessage: get(state, 'searchResults.errorMessage'),
    termDetails: get(state, 'termDetails.terms')
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    closeLocationModal: () => {
      dispatch(openLocationModal(false));
    },

    doPropertiesModalSearch: (filters) => {
      dispatch(requestPropertiesModalResultCount());
      Api.makeStandardPropertySearch(filters, (err, query, response) => {
        if (err) { return dispatch(receivePropertiesModalResultCountFetchingError(err)); }
        dispatch(receivePropertiesModalResultCount(get(response, 'hits.total', null)));
      });
    },

    doSearchWithQuery: (query, currentTermDetails, append) => {
      let url = Api.getPropertySearchRequestURL();
      dispatch(requestSearchResultsPosts());
      Api.search(url, query, (err, response) => {
        if (err) {
          return dispatch(receiveSearchResultsPostsError(err));
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

    standardSearch: p => {
      dispatch(requestSearchResultsPosts());
      let params = Object.assign({}, p);
      // params.aggregations = Util.getTermLookupAggregationQuery(params['term']);
      if (p[Lib.BOTTOM_RIGHT_URL_PREFIX] && p[Lib.TOP_LEFT_URL_PREFIX]) {
        params.geoCoordinates = {
          bottomRight: [p[Lib.BOTTOM_RIGHT_URL_PREFIX][0], p[Lib.BOTTOM_RIGHT_URL_PREFIX][1]],
          topLeft: [p[Lib.TOP_LEFT_URL_PREFIX][0], p[Lib.TOP_LEFT_URL_PREFIX][1]]
        };
      }
      
      Api.makeStandardPropertySearch(params, (err, query, response) => {
        if (err) {
          return dispatch(receiveSearchResultsPostsError(err));
        }
        dispatch(receiveSearchResultsPosts(query, get(response, 'hits.hits', []), get(response, 'hits.total', 0), false));
      });
      Api.termDetailsLookupQuery(params['term'], (err, response) => {
        if (err) {
          //TODO: handle the error
          console.log('error thrown')
        }
        let terms = [];
        if (response.aggregations) {
          terms = params['term'].map(d => {
            let termText = get(response, 'aggregations[' + d.slug + '.inside.buckets[0].key');
            return {
              ...d,
              text: termText
            }
          });
        }
        dispatch(receiveTermDetails(terms))
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
    propertiesModalResultCountErrorMessage: PropTypes.string,
    propertiesModalResultCountIsFetching: PropTypes.bool.isRequired,
    resetSearchResults: PropTypes.func.isRequired,
    results: PropTypes.array.isRequired,
    searchResultsErrorMessage: PropTypes.string,
    searchQueryParams: PropTypes.object.isRequired,
    termDetails: PropTypes.array.isRequired
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
    this.applyQueryFilters(this.props.searchQueryParams);
  }

  componentWillReceiveProps(nextProps) {
    let filters = nextProps.searchQueryParams;
    if (!isEqual(omit(nextProps.searchQueryParams, ['selected_property']), omit(this.props.searchQueryParams, ['selected_property']))) {
      this.applyQueryFilters(nextProps.searchQueryParams);
    }
    if (nextProps.displayedResults.length > 0 && !filters.selected_property && isMobile) {
      let firstPropertyMLSID = get(nextProps.displayedResults, '[0]._source.post_meta.rets_mls_number[0]', null);
      if (!firstPropertyMLSID) {
        console.log('first property MLS id is missing');
      } else {
        this.updateSelectedProperty(firstPropertyMLSID);
      }
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
    this.props.doSearchWithQuery(modifiedQuery, this.props.termDetails, true);
  }

  applyQueryFilters(searchFilters) {
    this.props.standardSearch(searchFilters);
  }

  clickMobileSwitcherHandler(mapDisplay) {
    this.setState({
      mapDisplay
    });
  }

  updateSelectedProperty = (propertyId) => {
    let filters = Object.assign({}, this.props.searchQueryParams);
    filters['selected_property'] = propertyId;
    let searchCollection = Util.searchObjectToCollection(filters);
    let searchURL = Util.createSearchURL('/search', searchCollection);
    this.props.history.push(searchURL);
  }

  updateURIGeoCoordinates = (geoCoordinates) => {
    let filters = Object.assign({}, this.props.searchQueryParams);
    delete filters[Lib.BOTTOM_RIGHT_URL_PREFIX];
    filters[Lib.BOTTOM_RIGHT_URL_PREFIX] = {lat: geoCoordinates['bottomRight']['lat'], lon: geoCoordinates['bottomRight']['lon']};
    delete filters[Lib.TOP_LEFT_URL_PREFIX];
    filters[Lib.TOP_LEFT_URL_PREFIX] = {lat: geoCoordinates['topLeft']['lat'], lon: geoCoordinates['topLeft']['lon']};
    let searchCollection = Util.searchObjectToCollection(filters);
    let searchURL = Util.createSearchURL('/search', searchCollection);
    this.props.history.push(searchURL);
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
      propertiesModalResultCountErrorMessage,
      propertiesModalResultCountIsFetching,
      propertyTypeOptions,
      results,
      resultsTotal,
      searchQueryParams,
      termDetails
    } = this.props;
    // create a clone because we might change it in the if statement
    let searchFilters = Object.assign({}, searchQueryParams);
    if (termDetails.length) {
      // termDetails has the display information as well
      searchFilters.term = termDetails;
    }
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
        currentGeoBounds={(searchFilters.geotl && searchFilters.geobr) ? Util.elasticsearchGeoFormatToGoogle({bottomRight: searchFilters[Lib.BOTTOM_RIGHT_URL_PREFIX], topLeft: searchFilters[Lib.TOP_LEFT_URL_PREFIX]}) : null} 
        historyPush={history.push}
        location={this.props.location}
        properties={displayedResults}
        searchByCoordinates={this.updateURIGeoCoordinates}
        selectedProperty={searchFilters.selected_property}
        updateSelectedProperty={this.updateSelectedProperty}
      />
    );

    const sliderElement = (
      <CarouselOnMap
        properties={displayedResults}
        selectedProperty={searchFilters.selected_property}
        onChangeSlide={this.updateSelectedProperty}
      />
    );

    const propertyPanelElement = (
      <PropertyPanelOnMap
        agents={this.props.agents}
        isVisible={this.props.panelOnMapShown}
        property={this.props.propertyOnPanel}
        historyPush={history.push}
      />
    );

    let elementToShow = (
      <div className={`${Lib.THEME_CLASSES_PREFIX}search-map`}>
        {this.props.searchResultsErrorMessage &&
          <ErrorMessageModal errorMessage={this.props.searchResultsErrorMessage} />
        }
        <PropertiesModal
          closeLocationModal={this.props.closeLocationModal}
          closeModal={() => openPropertiesModal(false)}
          doSearch={doPropertiesModalSearch}
          errorMessage={propertiesModalResultCountErrorMessage}
          historyPush={history.push}
          open={propertiesModalOpen}
          openLocationModal={this.props.openLocationModal}
          propertyTypeOptions={propertyTypeOptions}
          resultCount={propertiesModalResultCount}
          resultCountButtonLoading={propertiesModalResultCountIsFetching}
          searchFilters={omit(searchFilters, ['geoCoordinates'])}
          turnOffPropertiesModalModeInLocationModal={() => this.props.togglePropertiesModalModeInLocationModal(false)}
          turnOnPropertiesModalModeInLocationModal={() => this.props.togglePropertiesModalModeInLocationModal(true)}
        />

        <section className={`${Lib.THEME_CLASSES_PREFIX}search-map-section row no-gutters h-100`}>
          { (!isMobile || !this.state.mapDisplay) &&
            <div className={`col-sm-6 h-100 ${Lib.THEME_CLASSES_PREFIX}listing-sidebar`} ref={(r) => this.listingSidebar = r}>
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
                    onUpdateSelectedProperty={this.updateSelectedProperty}
                    selectedProperty={searchFilters.selected_property}
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

          <div className={`col-sm-6 h-100 ${Lib.THEME_CLASSES_PREFIX}listing-map ${!this.state.mapDisplay? 'hidden-xs-down': ''}`}>
            { captionElement }
            { !isMobile && propertyPanelElement }
            { mapElement }
            { isMobile && sliderElement }
          </div>

          { isMobile && mobileNavigatorElement }

        </section>
      </div>
    );

    return (
      <div className="h-100">
        <section className={`${Lib.THEME_CLASSES_PREFIX}toolbar ${Lib.THEME_CLASSES_PREFIX}header-search`}>
          <HeaderSearch
            historyPush={history.push}
            openUserPanel={this.props.openUserPanel}
            searchFilters={searchFilters}
            termDetails={this.props.termDetails}
          />
        </section>
        <div className={`${Lib.THEME_CLASSES_PREFIX}search-map-container h-100`}>
          {elementToShow}
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapSearchResults);
