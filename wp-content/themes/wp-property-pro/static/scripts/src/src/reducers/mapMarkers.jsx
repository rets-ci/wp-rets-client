import {Lib} from "../lib.jsx";

const mapMarkers = (state = {}, action) => {
    switch (action.type) {
        case Lib.SET_MAP_MARKERS_ACTION:
            return Object.assign({}, state, {
                mapMarkers: action.mapMarkers
            });
        default:
            return state
    }
}
export default mapMarkers