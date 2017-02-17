import {Lib} from "../lib.jsx";

const modal = (state = {}, action) => {
    switch (action.type) {
      case Lib.TOGGLE_MODAL_ACTION:
        return Object.assign({}, state, {
            openModal: action.open
        });
      default:
        return state
    }
};

export default modal
