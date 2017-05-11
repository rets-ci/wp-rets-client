import {Lib} from "../lib.jsx";

const headerSearch = (state = {}, action) => {
  switch (action.type) {
    case Lib.SALE_TYPES_PANEL_OPEN_ACTION:
      return Object.assign({}, state, {
        saleTypesPanelOpen: action.open
      });
    default:
      return state
  }
};

export default headerSearch
