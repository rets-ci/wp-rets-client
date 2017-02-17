import {Lib} from "../lib.jsx";

const testimonialsCarousel = (state = {}, action) => {
    switch (action.type) {
        case Lib.SET_TESTIMONIAL_ACTIVE_ITEM_ACTION:
            return Object.assign({}, state, {
                activeItem: action.activeItem
            });
        default:
            return state
    }
};
export default testimonialsCarousel