import {Lib} from "../lib.jsx";

const searchResults = (state = {}, action) => {
  switch (action.type) {
    case Lib.SET_SEARCH_RESULTS_ACTION:
      return Object.assign({}, state, {
          searchResults: action.searchResults,
          totalProps: action.totalProps,
      });
    default:
      return state
  }
}

export default searchResults;
