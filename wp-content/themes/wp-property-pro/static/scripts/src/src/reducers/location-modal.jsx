import {Lib} from "../lib.jsx";

const locationModal = (state = {errorMessage: null, isFetching: false, open: false, modifyType: null, searchMode: false, items: []}, action) => {
  switch (action.type) {
    case Lib.TOGGLE_LOCATION_MODAL_ACTION:
      return Object.assign({}, state, {
        open: action.open,
        modifyType: action.modifyType
      });
    case Lib.TOGGLE_LOCATION_MODAL_SEARCH_MODE:
      return Object.assign({}, state, {
        searchMode: action.searchMode
      });
    case Lib.REQUEST_LOCATION_MODAL_POSTS_ACTION:
      return Object.assign({}, state, {
        isFetching: true,
        items: []
      });
    case Lib.REQUEST_LOCATION_MODAL_RESET_FETCHING_ACTION:
      return Object.assign({}, state, {
        isFetching: false
      });
    case Lib.RECEIVE_LOCATION_MODAL_POSTS_ACTION:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.posts,
      });
    default:
      return state
  }
};

export default locationModal
