import {Lib} from "../lib.jsx";

const propertiesModal = (state = {open: false}, action) => {
  switch (action.type) {
    case Lib.TOGGLE_PROPERTIES_MODAL_ACTION:
      return Object.assign({}, state, {
        open: action.open
      });
    default:
      return state
  }
};

export default propertiesModal;
