import {Lib} from "../lib.jsx";

const searchProps = (state = {}, action) => {
    switch (action.type) {
        case Lib.SET_SEARCH_TYPE:
            return Object.assign({}, state, {
                searchType: action.searchType
            });
        default:
            return state
    }
};

export default searchProps
