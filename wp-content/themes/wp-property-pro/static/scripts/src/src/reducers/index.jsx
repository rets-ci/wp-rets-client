import {routerReducer} from 'react-router-redux';
import {combineReducers} from 'redux';
import postState from './post.jsx';
import mapState from './map.jsx';
import locationModal from './location-modal.jsx';
import propertiesModal from './properties-modal.jsx';
import searchPropsState from './searchProps.jsx';
import searchResults from './searchResults.jsx';
import mapMarkersState from './mapMarkers.jsx';
import searchType from './searchType.jsx';
import filterTermsState from './filterTerms.jsx';
import panel from './panel.jsx';
import testimonialsCarouselState from './testimonialsCarousel.jsx';
import blogPostsState from './blogPosts.jsx';

const propertyProApp = combineReducers({
    postState,
    mapState,
    locationModal,
    propertiesModal,
    searchPropsState,
    searchResults,
    searchType,
    mapMarkersState,
    routing: routerReducer,
    filterTermsState,
    panel,
    testimonialsCarouselState,
    blogPostsState
});

export default propertyProApp
