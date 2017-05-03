import {Lib} from "../lib.jsx";

const locationModal = (state = {open: false}, action) => {
  switch (action.type) {
    case Lib.TOGGLE_LOCATION_MODAL_ACTION:
      return Object.assign({}, state, {
        open: action.open
      });
    default:
      return state
  }
};

export default locationModal
