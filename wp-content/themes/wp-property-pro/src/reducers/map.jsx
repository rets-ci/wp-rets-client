import {Lib} from '../lib.jsx';

const map = (state = {}, action) => {
    switch (action.type) {
        case Lib.ADD_MAP_ACTION:
            return Object.assign({}, state, {
                map: action.map
            });
        default:
            return state
    }
};
export default map