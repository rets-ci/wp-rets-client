import {Lib} from "../lib.jsx";

const filterTerms = (state = {}, action) => {
    switch (action.type) {
        case Lib.SET_FILTER_TERMS_ACTION:
            return Object.assign({}, state, {
                filterTerms: action.filterTerms
            });
        default:
            return state
    }
};
export default filterTerms