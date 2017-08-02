import errorMessage from './errorMessage.jsx';
import {routerReducer} from 'react-router-redux';
import {combineReducers} from 'redux';
import formModal from './formModal.jsx';
import headerSearch from './headerSearch.jsx';
import mapState from './map.jsx';
import locationModal from './location-modal.jsx';
import pageModal from './page-modal.jsx';
import propertiesModal from './propertiesModal.jsx';
import searchResults from './searchResults.jsx';
import mapMarkersState from './mapMarkers.jsx';
import mapSearchResultsLoading from './mapSearchResultsLoading.jsx';
import searchType from './searchType.jsx';
import filterTermsState from './filterTerms.jsx';
import panel from './panel.jsx';
import testimonialsCarouselState from './testimonialsCarousel.jsx';
import blogPostsState from './blogPosts.jsx';

const propertyProApp = combineReducers({
    errorMessage,
    formModal,
    mapState,
    locationModal,
    pageModal,
    propertiesModal,
    searchResults,
    searchType,
    mapMarkersState,
    mapSearchResultsLoading,
    routing: routerReducer,
    filterTermsState,
    panel,
    testimonialsCarouselState,
    blogPostsState,
    headerSearch
});

export default propertyProApp
