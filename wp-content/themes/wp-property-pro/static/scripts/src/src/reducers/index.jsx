import {routerReducer} from 'react-router-redux';
import {combineReducers} from 'redux';
import postState from './post.jsx';
import menuState from './menu.jsx';
import mapState from './map.jsx';
import modal from './modal.jsx';
import searchPropsState from './searchProps.jsx';
import mapPropsState from './mapProps.jsx';
import mapMarkersState from './mapMarkers.jsx';
import searchType from './searchType.jsx';
import filterTermsState from './filterTerms.jsx';
import userDataState from './userData.jsx';
import testimonialsCarouselState from './testimonialsCarousel.jsx';

const propertyProApp = combineReducers({
    postState,
    menuState,
    mapState,
    modal,
    searchPropsState,
    searchType,
    mapPropsState,
    mapMarkersState,
    routing: routerReducer,
    filterTermsState,
    userDataState,
    testimonialsCarouselState
});

export default propertyProApp
