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