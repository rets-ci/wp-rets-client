import {routerReducer} from 'react-router-redux';
import {combineReducers} from 'redux';
import postState from './post.jsx';
import mapState from './map.jsx';
import modal from './modal.jsx';
import searchPropsState from './searchProps.jsx';
import searchResults from './searchResults.jsx';
import mapMarkersState from './mapMarkers.jsx';
import searchType from './searchType.jsx';
import filterTermsState from './filterTerms.jsx';
import panel from './panel.jsx';
import testimonialsCarouselState from './testimonialsCarousel.jsx';

const propertyProApp = combineReducers({
    postState,
    mapState,
    modal,
    searchPropsState,
    searchResults,
    searchType,
    mapMarkersState,
    routing: routerReducer,
    filterTermsState,
    panel,
    testimonialsCarouselState
});

export default propertyProApp
