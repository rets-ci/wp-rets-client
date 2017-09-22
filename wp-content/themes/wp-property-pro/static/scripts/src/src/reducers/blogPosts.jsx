import {Lib} from "../lib.jsx";
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

const searchResults = (state = {}, action) => {
  switch (action.type) {
    case Lib.SET_BLOG_POSTS_ACTION:
      let posts = [];
      if (!isEmpty(get(state, 'posts', []))) {
        posts = state.posts.concat(get(action, 'posts', []));
      } else {
        posts = get(action, 'posts');
      }
      return Object.assign({}, state, {
        posts: posts,
        allowPagination: get(action, 'allowPagination')
      });
    default:
      return state
  }
};

export default searchResults;
