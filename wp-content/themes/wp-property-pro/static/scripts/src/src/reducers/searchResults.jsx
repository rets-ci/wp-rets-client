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
    case Lib.REQUEST_SEARCH_RESULTS_POSTS_ACTION:
      if (!action.append) {
        return {
          ...defaultState,
          isFetching: true
        };
      } else {
        return {
          ...state,
          isFetching: true
        }
      }
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
    case Lib.SELECT_PROPERTY_ACTION:
      return Object.assign({}, state, {
        selectedProperty: action.selected
      });
    default:
      return state
  }
}

export default searchResults;
