import {Lib} from "../lib.jsx";
import get from 'lodash/get';

const searchResults = (state = {}, action) => {
  switch (action.type) {
    case Lib.SET_BLOG_POSTS_ACTION:
      let posts = get(action, 'posts', []);
      return Object.assign({}, state, {
        posts: posts,
        allowPagination: get(action, 'allowPagination')
      });
    default:
      return state
  }
};

export default searchResults;
