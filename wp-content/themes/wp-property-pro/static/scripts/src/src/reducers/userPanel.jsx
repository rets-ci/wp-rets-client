import {Lib} from "../lib.jsx";
import {LOCATION_CHANGE} from 'react-router-redux';

const userPanel = (state = {open: false}, action) => {
    switch (action.type) {
      case Lib.TOGGLE_USER_PANEL:
        return {
          ...state,
          open: action.open
        }
        break;
      case LOCATION_CHANGE:
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
