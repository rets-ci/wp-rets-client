import isEqual from 'lodash/isEqual';
import {Lib} from "../lib.jsx";

let defaultState = {
  open: false,
  otherFilters: {},
  resultCount: "",
  resultCountButtonLoading: false
};

const propertiesModal = (state = defaultState, action) => {
  switch (action.type) {
    case Lib.TOGGLE_PROPERTIES_MODAL_ACTION:
      return Object.assign({},
        {
          ...state,
          open: action.open
        }
      );
    case Lib.UPDATE_PROPERTIES_MODAL_RESULT_COUNT:
      return Object.assign({},
        {
          ...state,
          resultCount: action.count
        }
      );
    case Lib.UPDATE_PROPERTIES_MODAL_RESULT_COUNT_LOADING_ACTION:
      return Object.assign({},
      {
        ...state,
        resultCountButtonLoading: action.show
      });
    default:
      return state
  }
};

export default propertiesModal;
