import {Lib} from "../lib.jsx";

const mapProps = (state = {}, action) => {
    switch (action.type) {
        case Lib.SET_MAP_PROPS_ACTION:
            return Object.assign({}, state, {
                mapProps: action.mapProps
            });
        default:
            return state
    }
}
export default mapProps