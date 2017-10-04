import {Lib} from "../lib.jsx";

let defaultState = {
  errorMessage: null,
  isFetching: false,
  property: null,
  panelOnMapShown: false,
  propertyOnPanel: null,
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
      case Lib.SELECT_PROPERTY_ON_MAP_ACTION:
        return {
          ...state,
          panelOnMapShown: true,
          propertyOnPanel: action.property,
        };
      case Lib.DESELECT_PROPERTY_ON_MAP_ACTION:
        return {
          ...state,
          panelOnMapShown: false,
          propertyOnPanel: null,
        };
      default:
        return state
    }
};

export default propertySingle;
