import {Lib} from "../lib.jsx";

const props = (state = {}, action) => {
    switch (action.type) {
        case Lib.SET_PROPS_ACTION:
            return Object.assign({}, state, {
                props: action.props
            });
        default:
            return state
    }
}
export default props