import {Lib} from "../lib.jsx";

const propertyTypeOptions = (state = {}, action) => {
    switch (action.type) {
        case Lib.SET_PROPERTY_TYPE_OPTIONS:
            return Object.assign({}, state, {
                options: action.options
            });
        default:
            return state
    }
};

export default propertyTypeOptions;