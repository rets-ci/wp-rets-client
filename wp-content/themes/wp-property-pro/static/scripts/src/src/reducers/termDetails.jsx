import {Lib} from "../lib.jsx";

const termDetails = (state = {terms: []}, action) => {
  switch (action.type) {
    case Lib.SET_SEARCH_TERM_DETAILS_ACTION:
      return Object.assign({}, state, {
        terms: action.terms
      });
    default:
      return state
  }
};

export default termDetails