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

export const addMap = (map) => {
    return {
        type: Lib.ADD_MAP_ACTION,
        map: map
    }
};

export const openModal = (open) => {
  return {
    type: Lib.TOGGLE_MODAL_ACTION,
    open: open
  }
};

export const setSearchProps = (searchProps) => {
    return {
        type: Lib.SET_SEARCH_PROPS_ACTION,
        searchProps: searchProps
    }
};

export const setMapProps = (mapProps) => {
    return {
        type: Lib.SET_MAP_PROPS_ACTION,
        mapProps: mapProps
    }
};

export const setMapMarkers = (mapMarkers) => {
    return {
        type: Lib.SET_MAP_MARKERS_ACTION,
        mapMarkers: mapMarkers
    }
};

export const setSearchType = searchType => {
  return {
    type: Lib.SET_SEARCH_TYPE,
    searchType: searchType
  }
};

export const setFilterTerms = (filterTerms) => {
    return {
        type: Lib.SET_FILTER_TERMS_ACTION,
        filterTerms: filterTerms
    }
};

export const setUserData = (userData) => {
    return {
        type: Lib.SET_USER_DATA_ACTION,
        userData: userData
    }
};

export const setTestimonialsActiveItem = (activeItem) => {
    return {
        type: Lib.SET_TESTIMONIAL_ACTIVE_ITEM_ACTION,
        activeItem: activeItem
    }
};
