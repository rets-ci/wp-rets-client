import {Lib} from "../lib.jsx";

const searchResults = (state = {}, action) => {
  switch (action.type) {
    case Lib.SET_SEARCH_RESULTS_ACTION:
      let displayedResults = [];
      if (action.append) {
        displayedResults = state.displayedResults.concat(action.searchResults);
      } else {
        displayedResults = action.searchResults;
      }
      return Object.assign({}, state, {
        displayedResults: displayedResults,
        query: action.query,
        searchResults: action.searchResults,
        totalProps: action.totalProps,
      });
    default:
      return state
  }
}

export default searchResults;
