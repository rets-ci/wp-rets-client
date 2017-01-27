import { combineReducers } from 'redux'
import postState from './post.jsx';
import menuState from './menu.jsx';
import apiState from './api.jsx';
import mapState from './map.jsx';

const propertyProApp = combineReducers({
    postState,
    menuState,
    apiState,
    mapState
});

export default propertyProApp