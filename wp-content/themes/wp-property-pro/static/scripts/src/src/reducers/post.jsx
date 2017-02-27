import {Lib} from "../lib.jsx";
import _ from 'lodash';

const post = (state = {}, action) => {
    switch (action.type) {
        case Lib.ADD_POST_ACTION:
            return Object.assign({}, state, {
                post: action.post,
                rows: _.get(action, 'post.post_content', {})
            });
        default:
            return state
    }
}
export default post