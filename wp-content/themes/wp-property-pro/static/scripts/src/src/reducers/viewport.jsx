import { Lib } from "../lib.jsx";

const initialState = {
  isMobile: false,
  width: 1920,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case Lib.WINDOW_RESIZE:
      return {
        ...state,
        width: action.payload.width,
        height: action.payload.height,
        isMobile: action.payload.width < Lib.MOBILE_THRESHOLD,
        isShort: action.payload.height < 800 && (action.payload.width > action.payload.height)
      }
    default:
      return state
  }
}
