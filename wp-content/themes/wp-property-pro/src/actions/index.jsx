import {Lib} from '../lib.jsx'

export const addPost = (post) => {
    return {
        type: Lib.ADD_POST_ACTION,
        post: post
    }
};

export const initMenu = (menuItems) => {
    return {
        type: Lib.INIT_MENU_ACTION,
        menuItems: menuItems
    }
};

export const getApi = (response) => {
    return {
        type: Lib.GET_API_ACTION,
        response: response
    }
};


export const addMap = (map) => {
    return {
        type: Lib.ADD_MAP_ACTION,
        map: map
    }
};