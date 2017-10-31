import {Lib} from "../lib.jsx";

let defaultState = {
  errorMessage: null,
  isFetching: false,
  items: null
};

const availablePropertySubTypesForSearch = (state = defaultState, action) => {
  switch (action.type) {
    case Lib.RECEIVE_AVAILABLE_PROPERTY_SUBTYPES_FOR_SEARCH_ACTION:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.subTypes
      });
    case Lib.RECEIVE_AVAILABLE_PROPERTY_SUBTYPES_FOR_SEARCH_ERROR_ACTION:
      return Object.assign({}, state, {
        errorMessage: action.errorMessage,
        isFetching: false,
        items: null
      });
    case Lib.requestAvailablePropertySubTypesForSearch:
      return Object.assign({}, state, {
        isFetching: false
      });
    default:
      return state
  }
};

export default availablePropertySubTypesForSearch
