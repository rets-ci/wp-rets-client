import {Lib} from "../lib.jsx";

const post = (state = {}, action) => {
    switch (action.type) {
        case Lib.ADD_POST_ACTION:
            return Object.assign({}, state, {
                post: action.post,
                rows: action.post.post_content
            });
        default:
            return state
    }
}
export default post