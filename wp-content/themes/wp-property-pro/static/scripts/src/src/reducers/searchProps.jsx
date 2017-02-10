import {Lib} from "../lib.jsx";

const searchProps = (state = {}, action) => {
    switch (action.type) {
        case Lib.SET_SEARCH_PROPS_ACTION:
            return Object.assign({}, state, {
                searchProps: action.searchProps
            });
        default:
            return state
    }
}
export default searchProps