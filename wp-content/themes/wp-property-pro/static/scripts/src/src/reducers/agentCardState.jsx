import {Lib} from "../lib.jsx";
import { LOCATION_CHANGE } from 'react-router-redux'

let defaultState = {
  tab: ''
};

const agentCardState = (state=defaultState, action) => {
    switch (action.type) {
      case Lib.AGENT_CARD_SELECT_TAB:
        return {
          ...state,
          tab: action.tab
        }
      case LOCATION_CHANGE:
        return {
          ...state,
          tab: defaultState.tab
        }
      default:
        return state
    }
};

export default agentCardState;