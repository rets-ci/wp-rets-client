import {Lib} from "../lib.jsx";

const locationModal = (state = {open: false, modifyType: null, searchMode: false}, action) => {
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
    default:
      return state
  }
};

export default locationModal
