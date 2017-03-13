import {Lib} from "../lib.jsx";

const panel = (state = {open: false}, action) => {
    switch (action.type) {
      case Lib.TOGGLE_USER_PANEL:
        return {
          ...state,
          open: action.open
        }
      default:
        return state
    }
};

export default panel;
