import get from 'lodash/get';
import {Lib} from "../lib.jsx";

let defaultState = {
  errorMessage: null,
  isFetching: false,
  items: [],
  modifyType: null,
  open: false,
  propertiesModalMode: false,
  searchMode: false,
  cityPagination: {
    page: 1,
    total: 0,
  }
};


const locationModal = (state = defaultState, action) => {
  switch (action.type) {
    case Lib.TOGGLE_LOCATION_MODAL_ACTION:
      return Object.assign({}, state, {
        open: action.open,
        modifyType: action.modifyType,
        cityPagination: {
          page: 1,
          total: -1,
        }
      });
    case Lib.REQUEST_LOCATION_MODAL_POSTS_ACTION:
      return Object.assign({}, state, {
        isFetching: true,
        items: [],
        cityPagination: {
          page: 1,
          total: -1,
        }
      });
    case Lib.RECEIVE_LOCATION_MODAL_FETCHING_ERROR_ACTION:
      return Object.assign({}, state, {
        errorMessage: action.errorMessage,
        isFetching: false
      });

    case Lib.RECEIVE_LOCATION_MODAL_POSTS_ACTION:
      if (action.payload.type === 'AUTOCOMPLETE') {
        return Object.assign({}, state, {
          errorMessage: null,
          isFetching: false,
          items: action.payload.posts,
        });
      }

      const page = state.cityPagination.page;
      const total = get(action.payload, 'posts[0].total', -1);

      return Object.assign({}, state, {
        errorMessage: null,
        isFetching: false,
        items: action.payload.posts,
        cityPagination: {
          page: page + 1,
          total: total,
        }
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
