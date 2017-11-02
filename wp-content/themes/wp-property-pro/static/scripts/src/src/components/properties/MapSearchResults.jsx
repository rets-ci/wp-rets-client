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
  receiveAvailablePropertySubTypesForSearch,
  receiveAvailablePropertySubTypesForSearchError,
  receiveSearchResultsPosts,
  receiveSearchResultsPostsError,
  requestAvailablePropertySubTypesForSearch,
  requestSearchResultsPosts,
  toggleMapSearchResultsLoading,
  togglePropertiesModalModeInLocationModal,
  toggleUserPanel
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
  let propertyTypeOptions = get(state, 'propertyTypeOptions.options');
  let queryDefaults = ownProps.queryDefaults;
  let propertySubTypes = ownProps.propertySubtypes;
  let searchQueryParamsCollection = Util.URLSearchParse('search', window.location.href);
  let searchQueryObject = Util.searchCollectionToObject(searchQueryParamsCollection);
  let searchType = Util.determineSearchType(propertyTypeOptions, searchQueryObject.property_type[0], searchQueryObject.sale);
  let termDetails = get(ownProps, 'termDetails');
  if (searchType instanceof Error) {
    //TODO: handle not determining searchQueryObject
    console.log('error determining search type: ', searchType.message);
  }
  searchQueryObject['property_type'] = searchQueryObject.property_type[0];
  searchQueryObject['search_type'] = searchType;
  if (searchQueryObject.sale_type) {
    if (!(searchQueryObject.sale_type instanceof Array)) {
      searchQueryObject.sale_type = [searchQueryObject.sale_type];
    }
  }

  searchQueryObject = Util.searchObjectToCustomFormat(searchQueryObject);
  searchQueryObject['term'] = termDetails;
  for (var key in searchQueryObject) {
    if (termDetails.map(d => d.term).indexOf(key) >= 0) {
      delete searchQueryObject[key];
    }
  }

  if (searchQueryObject['property_subtype']) {
    let property_subtype = searchQueryObject['property_subtype'] instanceof Array ? searchQueryObject['property_subtype'] : [searchQueryObject['property_subtype']];
    searchQueryObject['property_subtype'] = propertySubTypes.filter(d => {
      return property_subtype.indexOf(d.slug) >= 0;
    });
  }

  return {
    availableSubTypes: get(state, 'availablePropertySubTypesForSearch.items'),
    errorMessage: state.errorMessage,
    query: get(state, 'searchResults.query', []),
    isFetching: get(state, 'searchResults.isFetching', []),
    displayedResults: get(state, 'searchResults.displayedResults', []),
    propertiesModalOpen: get(state, 'propertiesModal.open'),
    propertiesModalResultCountErrorMessage: get(state, 'propertiesModal.errorMessage'),
    propertiesModalResultCountIsFetching: get(state, 'propertiesModal.isFetching'),
    propertiesModalResultCount: get(state, 'propertiesModal.resultCount'),
    propertySubTypes: propertySubTypes,
    propertyTypeOptions: propertyTypeOptions,
    results: get(state, 'searchResults.searchResults', []),
    resultsTotal: get(state, 'searchResults.totalProps', 0),
    propertyOnPanel: state.singleProperty.propertyOnPanel,
    panelOnMapShown: state.singleProperty.panelOnMapShown,
    queryDefaults: queryDefaults,
    saleTypesPanelOpen: get(state, 'headerSearch.saleTypesPanelOpen', false),
    searchQueryParams: searchQueryObject,
    searchResultsErrorMessage: get(state, 'searchResults.errorMessage'),
    termDetails: termDetails
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    closeLocationModal: () => {
      dispatch(openLocationModal(false));
    },

    doPropertiesModalSearch: (filters, queryDefaults) => {
      let params = Object.assign({}, filters);
      dispatch(requestPropertiesModalResultCount());
      params = Util.enricSearchParamshWithDefaults(params, queryDefaults);
      Api.makeStandardPropertySearch(params, (err, query, response) => {
        if (err) { return dispatch(receivePropertiesModalResultCountFetchingError(err)); }
        dispatch(receivePropertiesModalResultCount(get(response, 'hits.total', null)));
      });
    },

    doSearchWithQuery: (query, append) => {
      let url = Api.getPropertySearchRequestURL();
      dispatch(requestSearchResultsPosts());
      Api.search(url, query, (err, response) => {
        if (err) {
          return dispatch(receiveSearchResultsPostsError(err));
        }
        dispatch(receiveSearchResultsPosts(query, get(response, 'hits.hits', []), get(response, 'hits.total', 0), append));
      });
    },

    getAvailablePropertySubTypes: (filters, queryDefaults) => {
      let params = Object.assign({}, filters);
      params.aggregations = Api.getPropertySubTypesAggregations();
      params = Util.enricSearchParamshWithDefaults(params, queryDefaults);
      params = omit(params, ['property_subtype']);
      dispatch(requestAvailablePropertySubTypesForSearch());
      Api.makeStandardPropertySearch(params, (err, query, response) => {
        if (err) {
          return dispatch(receiveAvailablePropertySubTypesForSearchError(err));
        }
        let availableSubTypes = get(response, 'aggregations.property_subtype_slugs.buckets', []).map(d => ({key: d.key, count: d.doc_count}));
        dispatch(receiveAvailablePropertySubTypesForSearch(availableSubTypes));
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

    standardSearch: (p, defaults) => {
      dispatch(requestSearchResultsPosts());
      let params = Object.assign({}, p);
      // geoCorrdinates
      if (p[Lib.BOTTOM_RIGHT_URL_PREFIX] && p[Lib.TOP_LEFT_URL_PREFIX]) {
        params.geoCoordinates = {
          bottomRight: [p[Lib.BOTTOM_RIGHT_URL_PREFIX][0], p[Lib.BOTTOM_RIGHT_URL_PREFIX][1]],
          topLeft: [p[Lib.TOP_LEFT_URL_PREFIX][0], p[Lib.TOP_LEFT_URL_PREFIX][1]]
        };
      }
      params = Util.enricSearchParamshWithDefaults(params, defaults);
      Api.makeStandardPropertySearch(params, (err, query, response) => {
        if (err) {
          return dispatch(receiveSearchResultsPostsError(err));
        }
        dispatch(receiveSearchResultsPosts(query, get(response, 'hits.hits', []), get(response, 'hits.total', 0), false));
      });
    },

    openUserPanel: () => {
      dispatch(toggleUserPanel(true));
    },

    togglePropertiesModalModeInLocationModal: on => {
      dispatch(togglePropertiesModalModeInLocationModal(on));
    }
  };
};

class MapSearchResults extends Component {
  static propTypes = {
    availableSubTypes: PropTypes.array,
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
    propertySubTypes: PropTypes.array.isRequired,
    queryDefaults: PropTypes.object.isRequired,
    resetSearchResults: PropTypes.func.isRequired,
    results: PropTypes.array.isRequired,
    searchResultsErrorMessage: PropTypes.string,
    searchQueryParams: PropTypes.object.isRequired,
    termDetails: PropTypes.array.isRequired,
    openUserPanel: PropTypes.func.isRequired
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
    let filters = this.props.searchQueryParams;
    this.applyQueryFilters(filters, this.props.queryDefaults);
    if (this.props.displayedResults.length > 0 && !filters.selected_property && isMobile) {
      let firstPropertyMLSID = get(this.props.displayedResults, '[0]._source.post_meta.rets_mls_number[0]', null);
      if (!firstPropertyMLSID) {
        console.log('first property MLS id is missing');
      } else {
        this.updateSelectedProperty(firstPropertyMLSID);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    let filters = nextProps.searchQueryParams;
    let anyFilterChange = !isEqual(omit(nextProps.searchQueryParams, ['selected_property']), omit(this.props.searchQueryParams, ['selected_property']));
    let anyDefaultQueryChange = !isEqual(nextProps.queryDefaults, this.props.queryDefaults);
    if (anyFilterChange || anyDefaultQueryChange) {
      this.applyQueryFilters(nextProps.searchQueryParams, nextProps.queryDefaults);
    }
    if (nextProps.searchQueryParams.search_type !== this.props.searchQueryParams.search_type && this.listingSidebar) {
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
    this.props.doSearchWithQuery(modifiedQuery, true);
  }

  applyQueryFilters = (searchFilters, queryDefaults) => {
    this.props.standardSearch(searchFilters, queryDefaults);
  }

  clickMobileSwitcherHandler(mapDisplay) {
    this.setState({
      mapDisplay
    });
  }

  updateSelectedProperty = (propertyId) => {
    let filters = Object.assign({}, this.props.searchQueryParams);
    filters['selected_property'] = propertyId;
    if (filters[Lib.BOTTOM_RIGHT_URL_PREFIX] && filters[Lib.TOP_LEFT_URL_PREFIX]) {
      filters[Lib.BOTTOM_RIGHT_URL_PREFIX] = {lat: filters[Lib.BOTTOM_RIGHT_URL_PREFIX][0], lon: filters[Lib.BOTTOM_RIGHT_URL_PREFIX][1]};
      filters[Lib.TOP_LEFT_URL_PREFIX] = {lat: filters[Lib.TOP_LEFT_URL_PREFIX][0], lon: filters[Lib.TOP_LEFT_URL_PREFIX][1]};
    }
    delete filters['search_type'];
    if (filters['property_subtype'] && filters['property_subtype'].every(d => d.slug)) {
      filters['property_subtype'] = filters['property_subtype'].map(d => d.slug);
    }
    filters = Util.customFormatToSearchObject(filters);
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
    delete filters['search_type'];
    if (filters['sale_type'] && isEqual(filters['sale_type'].sort(), ['rent', 'sale'].sort())) {
      delete filters['sale_type']
    }
    if (filters['property_subtype'] && filters['property_subtype'].every(d => d.slug)) {
      filters['property_subtype'] = filters['property_subtype'].map(d => d.slug);
    }
    filters = Util.customFormatToSearchObject(filters);
    let searchCollection = Util.searchObjectToCollection(filters);
    let searchURL = Util.createSearchURL('/search', searchCollection);
    this.props.history.push(searchURL);
  }

  render() {
    let {
      availableSubTypes,
      errorMessage,
      displayedResults,
      doPropertiesModalSearch,
      getAvailablePropertySubTypes,
      history,
      isFetching,
      location,
      openPropertiesModal,
      propertiesModalOpen,
      propertiesModalResultCount,
      propertiesModalResultCountErrorMessage,
      propertiesModalResultCountIsFetching,
      propertySubTypes,
      propertyTypeOptions,
      queryDefaults,
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
          availableSubTypes={availableSubTypes}
          closeLocationModal={this.props.closeLocationModal}
          closeModal={() => openPropertiesModal(false)}
          doSearch={(filters) => { doPropertiesModalSearch(filters, queryDefaults); }}
          errorMessage={propertiesModalResultCountErrorMessage}
          getAvailablePropertySubTypes={(filters) => { getAvailablePropertySubTypes(filters, queryDefaults) }}
          historyPush={history.push}
          open={propertiesModalOpen}
          openLocationModal={this.props.openLocationModal}
          propertySubTypes={propertySubTypes}
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
                terms={searchFilters.term}
                type={searchFilters.property_type}
                subtypes={searchFilters.property_subtype}
                price={searchFilters.price}
                saleType={searchFilters.sale_type}
                sqft={searchFilters.sqft}
                acres={searchFilters.acres}
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
      <div className="h-100 d-flex flex-column">
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
