import {Lib} from "../lib.jsx";

let defaultState = {
  errorMessage: null,
  isFetching: false,
  items: [],
  modifyType: null,
  open: false,
  propertiesModalMode: false,
  searchMode: false
};


const locationModal = (state = defaultState, action) => {
  switch (action.type) {
    case Lib.TOGGLE_LOCATION_MODAL_ACTION:
      return Object.assign({}, state, {
        open: action.open,
        modifyType: action.modifyType,
        currentTerms: action.currentTerms
      });
    case Lib.REQUEST_LOCATION_MODAL_POSTS_ACTION:
      return Object.assign({}, state, {
        isFetching: true,
        items: []
      });
    case Lib.RECEIVE_LOCATION_MODAL_FETCHING_ERROR_ACTION:
      return Object.assign({}, state, {
        errorMessage: action.errorMessage,
        isFetching: false
      });
    case Lib.RECEIVE_LOCATION_MODAL_POSTS_ACTION:
      return Object.assign({}, state, {
        errorMessage: null,
        isFetching: false,
        items: action.posts,
      });
    case Lib.TOGGLE_PROPERTIES_MODAL_MODE_IN_LOCATION_MODAL_ACTION:
      return Object.assign({}, state, {
        propertiesModalMode: action.on
      });
    default:
      return state
  }
};

export default locationModal