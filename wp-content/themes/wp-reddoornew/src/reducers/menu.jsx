import {Lib} from '../lib.jsx';

const menu = (state = {}, action) => {
    switch (action.type) {
        case Lib.INIT_MENU_ACTION:
            return Object.assign({}, state, {
                menuItems: action.menuItems
            });
        default:
            return state
    }
}
export default menu