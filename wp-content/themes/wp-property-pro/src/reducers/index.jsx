import { combineReducers } from 'redux'
import postState from './post.jsx';
import menuState from './menu.jsx';
import mapState from './map.jsx';
import propsState from './props.jsx';

const propertyProApp = combineReducers({
    postState,
    menuState,
    mapState,
    propsState
});

export default propertyProApp