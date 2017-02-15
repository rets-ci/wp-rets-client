import {Lib} from "../lib.jsx";

const userData = (state = {}, action) => {
    switch (action.type) {
        case Lib.SET_USER_DATA_ACTION:
            return Object.assign({}, state, action.userData);
        default:
            return state
    }
};
export default userData