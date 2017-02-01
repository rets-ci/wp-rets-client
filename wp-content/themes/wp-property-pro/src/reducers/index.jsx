import {combineReducers} from 'redux'
import postState from './post.jsx';
import menuState from './menu.jsx';
import mapState from './map.jsx';
import searchPropsState from './searchProps.jsx';
import mapPropsState from './mapProps.jsx';
import mapMarkersState from './mapMarkers.jsx';

const propertyProApp = combineReducers({
    postState,
    menuState,
    mapState,
    searchPropsState,
    mapPropsState,
    mapMarkersState,
});

export default propertyProApp