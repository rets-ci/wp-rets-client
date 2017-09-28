import isEqual from 'lodash/isEqual';
import {Lib} from "../lib.jsx";

let defaultState = {
  errorMessage: null,
  isFetching: false,
  open: false,
  resultCount: ''
};

const propertiesModal = (state = defaultState, action) => {
  switch (action.type) {
    case Lib.RECEIVE_PROPERTIES_MODAL_RESULT_COUNT_FETCHING_ERROR_ACTION:
      return Object.assign({},
        {
          ...state,
          errorMessage: action.errorMessage,
          isFetching: false,
          resultCount: ''
        }
      );
    case Lib.RECEIVE_PROPERTIES_MODAL_RESULT_COUNT_ACTION:
      return Object.assign({},
        {
          ...state,
          errorMessage: null,
          isFetching: false,
          resultCount: action.resultCount
        }
      );
    case Lib.REQUEST_PROPERTIES_MODAL_RESULT_COUNT_ACTION:
      return Object.assign({},
        {
          ...state,
          isFetching: true
        }
      );
    case Lib.TOGGLE_PROPERTIES_MODAL_ACTION:
      return Object.assign({},
        {
          ...state,
          open: action.open
        }
      );
    default:
      return state;
  }
};

export default propertiesModal;
