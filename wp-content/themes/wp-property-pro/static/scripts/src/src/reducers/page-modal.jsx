import {Lib} from "../lib.jsx";

const pageModal = (state = {}, action) => {
    switch (action.type) {
        case Lib.SET_PAGE_TITLE_ACTION:
            return Object.assign({}, state, {
                data: action.data
            });
        default:
            return state
    }
}
export default pageModal;
