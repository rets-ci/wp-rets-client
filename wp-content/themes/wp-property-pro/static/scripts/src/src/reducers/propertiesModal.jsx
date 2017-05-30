import {isEqual} from 'lodash';
import {Lib} from "../lib.jsx";

let defaultState = {
  localFilters: {},
  open: false,
  otherFilters: {},
  resultCount: null,
  resultCountButtonLoading: false
};

const propertiesModal = (state = defaultState, action) => {
  switch (action.type) {
    case Lib.DELETE_PROPERTIES_MODAL_SINGLE_LOCAL_FILTER_ACTION:
      var localFilters = Object.assign({}, state.localFilters);
      delete localFilters[action.filterKey];
      return Object.assign({},
        {
          ...state,
          localFilters: localFilters
        });
    case Lib.DELETE_PROPERTIES_MODAL_TERM_LOCAL_FILTER_ACTION:
      var localFilters = Object.assign({}, state.localFilters);
      localFilters.term = localFilters.term.filter(t => {
        return !isEqual(t, action.termFilter);
      });
      return Object.assign({},
        {
          ...state,
          localFilters: localFilters
        });
    case Lib.SET_PROPERTIES_MODAL_LOCAL_FILTER_ACTION:
      return Object.assign({},
        {
          ...state,
          localFilters: action.localFilters
        });
    case Lib.TOGGLE_PROPERTIES_MODAL_ACTION:
      return Object.assign({},
        {
          ...state,
          open: action.open
        }
      );
    case Lib.UPDATE_PROPERTIES_MODAL_LOCAL_FILTER_ACTION:
      var localFilters = Object.assign({}, state.localFilters, action.filter);
      return Object.assign({},
        {
          ...state,
          localFilters: localFilters
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
