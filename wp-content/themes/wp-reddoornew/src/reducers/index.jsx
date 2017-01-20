import { combineReducers } from 'redux'
import postState from './post.jsx';
import menuState from './menu.jsx';

const reddoorApp = combineReducers({
    postState,
    menuState
});

export default reddoorApp