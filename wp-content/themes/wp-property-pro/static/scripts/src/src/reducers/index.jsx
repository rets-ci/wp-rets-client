import agentCardState from './agentCardState.jsx';
import blogPostsState from './blogPosts.jsx';
import filterTermsState from './filterTerms.jsx';
import formModal from './formModal.jsx';
import headerSearch from './headerSearch.jsx';
import locationModal from './location-modal.jsx';
import loginModal from './loginModal.jsx';
import propertiesModal from './propertiesModal.jsx';
import propertyTypeOptions from './propertyTypeOptions.jsx';
import {routerReducer} from 'react-router-redux';
import {combineReducers} from 'redux';
import searchResults from './searchResults.jsx';
import singleProperty from './single-property.jsx';
import searchType from './searchType.jsx';
import testimonialsCarouselState from './testimonialsCarousel.jsx';
import userPanel from './userPanel.jsx';
import wordpressContentFetching from './wordpressContentFetching.jsx';

const propertyProApp = combineReducers({
    agentCardState,
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
    wordpressContentFetching
});

export default propertyProApp
