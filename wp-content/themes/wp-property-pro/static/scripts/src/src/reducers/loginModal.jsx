import {Lib} from "../lib.jsx";

const loginModal = (state = {open: false}, action) => {
  switch (action.type) {
    case Lib.TOGGLE_LOGIN_MODAL_ACTION:
      return Object.assign({}, state, {
        open: action.open
      });
    default:
      return state
  }
}

export default loginModal;
