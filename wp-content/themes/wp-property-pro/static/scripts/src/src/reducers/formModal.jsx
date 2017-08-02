import {Lib} from "../lib.jsx";

const formModal = (state = {open: false}, action) => {
  switch (action.type) {
    case Lib.TOGGLE_FORM_MODAL_ACTION:
      return Object.assign({}, state, {
        id: action.id,
        open: action.open
      });
    default:
      return state
  }
}

export default formModal;
