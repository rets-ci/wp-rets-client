import agentCardState from './agentCardState.jsx';
import availablePropertySubTypesForSearch from './availablePropertySubTypesForSearch.jsx';
import blogPostsState from './blogPosts.jsx';
import filterTermsState from './filterTerms.jsx';
import formModal from './formModal.jsx';
import headerSearch from './headerSearch.jsx';
import locationModal from './locationModal.jsx';
import loginModal from './loginModal.jsx';
import propertiesModal from './propertiesModal.jsx';
import propertyTypeOptions from './propertyTypeOptions.jsx';
import {routerReducer} from 'react-router-redux';
import {combineReducers} from 'redux';
import searchResults from './searchResults.jsx';
import singleProperty from './singleProperty.jsx';
import searchType from './searchType.jsx';
import testimonialsCarouselState from './testimonialsCarousel.jsx';
import userPanel from './userPanel.jsx';
import wordpressContentFetching from './wordpressContentFetching.jsx';
import viewport from './viewport.jsx';

const propertyProApp = combineReducers({
    agentCardState,
    availablePropertySubTypesForSearch,
    formModal,
    loginModal,
    locationModal,
    propertiesModal,
    singleProperty,
    propertyTypeOptions,
    searchResults,
    searchType,
    routing: routerReducer,
    filterTermsState,
    userPanel,
    testimonialsCarouselState,
    blogPostsState,
    headerSearch,
    wordpressContentFetching,
    viewport,
});

export default propertyProApp
