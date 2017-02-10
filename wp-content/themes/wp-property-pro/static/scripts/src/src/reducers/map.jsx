import {Lib} from '../lib.jsx';

const map = (state = {}, action) => {
    switch (action.type) {
        case Lib.ADD_MAP_ACTION:
            let new_state = Object.assign({}, state);
            new_state.map = action.map;
            return new_state;
        case Lib.ADD_MARKER_ACTION:
            return Object.assign({}, state, {
                markers: state.markers.concat(action.markers)
            });
        default:
            return state
    }
};
export default map