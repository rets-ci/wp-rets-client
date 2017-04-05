import {Lib} from "../lib.jsx";

const mapSearchResultsLoading = (state = {loading: false}, action) => {
  switch (action.type) {
    case Lib.TOGGLE_MAP_SEARCH_RESULTS_LOADING_STARTED:
      return Object.assign({}, state, {
        loading: action.loading
      });
    default:
      return state
  }
}
export default mapSearchResultsLoading
