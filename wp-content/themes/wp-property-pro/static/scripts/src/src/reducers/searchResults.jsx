import {Lib} from "../lib.jsx";

const searchResults = (state = {isFetching: false}, action) => {
  switch (action.type) {
    case Lib.RECEIVE_SEARCH_RESULTS_POSTS_ACTION:
      let displayedResults = [];
      if (action.append) {
        displayedResults = state.displayedResults.concat(action.searchResults);
      } else {
        displayedResults = action.searchResults;
      }
      return Object.assign({}, state, {
        displayedResults: displayedResults,
        isFetching: false,
        query: action.query,
        searchResults: action.searchResults,
        totalProps: action.totalProps,
      });
    case Lib.REQUEST_SEARCH_RESULTS_POSTS_ACTION:
      return Object.assign({}, state, {
        isFetching: true
      });
    case Lib.REQUEST_SEARCH_RESULTS_POSTS_RESET_RESULTS_ACTION:
      return Object.assign({}, state, {
        isFetching: false,
        displayedResults: [],
        searchResults: [],
        totalProps: 0
      });
    default:
      return state
  }
}

export default searchResults;
