import {Lib} from "../lib.jsx";
import _ from 'lodash';

const searchResults = (state = {}, action) => {
  switch (action.type) {
    case Lib.SET_BLOG_POSTS_ACTION:
      let posts = [];
      if (!_.isEmpty(_.get(state, 'posts', []))) {
        posts = state.posts.concat(_.get(action, 'posts', []));
      } else {
        posts = _.get(action, 'posts');
      }
      return Object.assign({}, state, {
        posts: posts,
        allowPagination: _.get(action, 'allowPagination')
      });
    default:
      return state
  }
};

export default searchResults;
