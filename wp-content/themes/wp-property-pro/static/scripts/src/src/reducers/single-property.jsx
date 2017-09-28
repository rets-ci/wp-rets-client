import {Lib} from "../lib.jsx";

let defaultState = {
  errorMessage: null,
  isFetching: false,
  property: null
};

const propertySingle = (state = defaultState, action) => {
    switch (action.type) {
      case Lib.RECEIVE_PROPERTY_SINGLE_FETCHING_ERROR_ACTION:
        return Object.assign({}, state, {
          isFetching: false,
          errorMessage: action.errorMessage
        });
      case Lib.REQUEST_PROPERTY_SINGLE_RESULT_ACTION:
        return Object.assign({}, state, {
          isFetching: true,
          property: null
        });
      case Lib.RECEIVE_PROPERTY_SINGLE_RESULT_ACTION:
        return Object.assign({}, state, {
          errorMessage: null,
          isFetching: false,
          property: action.property,
        });
      default:
        return state
    }
};

export default propertySingle;
