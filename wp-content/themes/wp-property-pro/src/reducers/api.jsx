import {Lib} from '../lib.jsx';

const api = (state = {}, action) => {
    switch (action.type) {
        case Lib.GET_API_ACTION:
            return Object.assign({}, state, {
                response: action.response
            });
        default:
            return state
    }
};
export default api