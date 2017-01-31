import { combineReducers } from 'redux'
import postState from './post.jsx';
import menuState from './menu.jsx';
import mapState from './map.jsx';

const propertyProApp = combineReducers({
    postState,
    menuState,
    mapState
});

export default propertyProApp