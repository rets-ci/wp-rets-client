import {Lib} from "../lib.jsx";
import {LOCATION_CHANGE} from 'react-router-redux';

const errorMessage = (state = null, action) => {
  const { type, error } = action;
  if (type === Lib.RESET_ERROR_MESSAGE_ACTION) {
    return null;
  } else if (error && Lib.ERROR_MESSAGE_ACTION) {
    return error;
  } else if (LOCATION_CHANGE) {
    return null;
  }
  return state;
};

export default errorMessage;
