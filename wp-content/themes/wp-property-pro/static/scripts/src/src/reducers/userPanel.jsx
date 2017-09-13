import {Lib} from "../lib.jsx";

const userPanel = (state = {open: false}, action) => {
    switch (action.type) {
      case Lib.TOGGLE_USER_PANEL:
        return {
          ...state,
          open: action.open
        }
        break;
      case Lib.ROUTE_CHANGED_ACTION:
        return {
          ...state,
          open: false
        }
        break;
      default:
        return state
    }
};

export default userPanel;
