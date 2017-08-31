import agentCardState from './agentCardState.jsx';
import errorMessage from './errorMessage.jsx';
import {routerReducer} from 'react-router-redux';
import {combineReducers} from 'redux';
import formModal from './formModal.jsx';
import loginModal from './loginModal.jsx';
import headerSearch from './headerSearch.jsx';
import mapState from './map.jsx';
import locationModal from './location-modal.jsx';
import propertiesModal from './propertiesModal.jsx';
import searchResults from './searchResults.jsx';
import mapMarkersState from './mapMarkers.jsx';
import mapSearchResultsLoading from './mapSearchResultsLoading.jsx';
import propertyTypeOptions from './propertyTypeOptions.jsx';
import searchType from './searchType.jsx';
import filterTermsState from './filterTerms.jsx';
import userPanel from './userPanel.jsx';
import testimonialsCarouselState from './testimonialsCarousel.jsx';
import blogPostsState from './blogPosts.jsx';

const propertyProApp = combineReducers({
    agentCardState,
    errorMessage,
    formModal,
    loginModal,
    mapState,
    locationModal,
    propertiesModal,
    propertyTypeOptions,
    searchResults,
    searchType,
    mapMarkersState,
    mapSearchResultsLoading,
    routing: routerReducer,
    filterTermsState,
    userPanel,
    testimonialsCarouselState,
    blogPostsState,
    headerSearch
});

export default propertyProApp
