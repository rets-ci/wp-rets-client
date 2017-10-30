import {Lib} from "../lib.jsx";

let defaultState = {
  availableSubTypes: [],
  displayedResults: [],
  errorMessage: null,
  searchResults: [],
  totalProps: 0,
  isFetching: false
};

const searchResults = (state = defaultState, action) => {
  switch (action.type) {
    case Lib.RECEIVE_AVAILABLE_PROPERTY_SUBTYPES_FOR_SEARCH_ACTION:
      return Object.assign({}, state, {
        availableSubTypes: action.subTypes
      });
    case Lib.RECEIVE_SEARCH_RESULTS_POSTS_ACTION:
      let displayedResults = [];
      if (action.append) {
        displayedResults = state.displayedResults.concat(action.searchResults);
      } else {
        displayedResults = action.searchResults;
      }
      return Object.assign({}, state, {
        displayedResults: displayedResults,
        errorMessage: null,
        isFetching: false,
        query: action.query,
        searchResults: action.searchResults,
        totalProps: action.totalProps,
      });
    case Lib.RECEIVE_SEARCH_RESULTS_POSTS_ERROR_ACTION:
      return Object.assign({}, state, {
        availableSubTypes: [],
        errorMessage: action.errorMessage,
        isFetching: false
      });
    case Lib.REQUEST_SEARCH_RESULTS_POSTS_ACTION:
      return Object.assign({}, state, {
        isFetching: true
      });
    default:
      return state
  }
}

export default searchResults;
