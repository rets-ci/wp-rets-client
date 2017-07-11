import {Lib} from "../lib.jsx";

const errorMessage = (state = null, action) => {
  const { type, error } = action;
  if (type === Lib.RESET_ERROR_MESSAGE) {
    return null;
  } else if (error && Lib.ERROR_MESSAGE) {
    return error;
  }
  return state;
};

export default errorMessage;
