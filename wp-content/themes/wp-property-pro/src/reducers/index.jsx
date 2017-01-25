import { combineReducers } from 'redux'
import postState from './post.jsx';
import menuState from './menu.jsx';

const propertyProApp = combineReducers({
    postState,
    menuState
});

export default propertyProApp