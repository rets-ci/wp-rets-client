import {Lib} from "../lib.jsx";

let defaultState = {
  isFetching: false,
  property: null
};

const propertySingle = (state = defaultState, action) => {
    switch (action.type) {
      case Lib.REQUEST_PROPERTY_SINGLE_RESULT_ACTION:
        return Object.assign({}, state, {
          isFetching: true,
          property: null
        });
      case Lib.REQUEST_PROPERTY_SINGLE_RESET_FETCHING_ACTION:
        return Object.assign({}, state, {
          isFetching: false
        });
      case Lib.RECEIVE_PROPERTY_SINGLE_RESULT_ACTION:
        return Object.assign({}, state, {
          isFetching: false,
          property: action.property,
        });
      default:
        return state
    }
};

export default propertySingle;
