import {Lib} from "../lib.jsx";

let defaultState = {
  errorMessage: null,
  isFetching: false
};

const wordpressContentFetching = (state = defaultState, action) => {
  switch(action.type) {
    case Lib.REQUEST_WORDPRESS_CONTENT_FETCH_ACTION:
      return Object.assign({}, state, {
        isFetching: true
      });
    case Lib.RECEIVE_WORDPRESS_CONTENT_FETCH_ERROR_ACTION:
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: action.errorMessage
      });
    case Lib.RECEIVE_WORDPRESS_CONTENT_FETCH_ACTION:
      return Object.assign({}, state, {
        errorMessage: null,
        isFetching: false
      });
    default:
      return state
  }
};

export default wordpressContentFetching