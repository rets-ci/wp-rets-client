import {Lib} from '../lib.jsx'

export const deletePropertiesModalTermLocalFilter = termFilter => {
  return {
    type: Lib.DELETE_PROPERTIES_MODAL_TERM_LOCAL_FILTER_ACTION,
    termFilter: termFilter
  }
};

export const raiseErrorMessage = (error) => ({
  type: Lib.ERROR_MESSAGE_ACTION,
  error: error
});

export const resetErrorMessage = () => ({
  type: Lib.RESET_ERROR_MESSAGE_ACTION
});

export const openFormModal = (id, open) => {
  return {
    type: Lib.TOGGLE_FORM_MODAL_ACTION,
    id: id,
    open: open
  }
};

export const openLocationModal = open => {
  return {
    type: Lib.TOGGLE_LOCATION_MODAL_ACTION,
    open: open
  }
};

export const openLoginModal = (open) => {
  return {
    type: Lib.TOGGLE_LOGIN_MODAL_ACTION,
    open: open
  }
}

export const openPropertiesModal = (open) => {
  return {
    type: Lib.TOGGLE_PROPERTIES_MODAL_ACTION,
    open: open
  }
};

export const setSearchProps = (searchProps) => {
  return {
    type: Lib.SET_SEARCH_PROPS_ACTION,
    searchProps: searchProps
  }
};

export const requestLocationModalResetFetching = () => {
  return {
    type: Lib.REQUEST_LOCATION_MODAL_RESET_FETCHING_ACTION
  }
};

export const requestLocationModalPosts = () => {
  return {
    type: Lib.REQUEST_LOCATION_MODAL_POSTS_ACTION
  }
}

export const receiveLocationModalPosts = (posts) => {
  return {
    type: Lib.RECEIVE_LOCATION_MODAL_POSTS_ACTION,
    posts: posts
  }
}

export const requestSearchResultsPosts = () => {
  return {
    type: Lib.REQUEST_SEARCH_RESULTS_POSTS_ACTION
  }
};

export const requestSearchResultsPostsResetFetching = () => {
  return {
    type: Lib.REQUEST_SEARCH_RESULTS_POSTS_RESET_RESULTS_ACTION
  }
};

export const receiveSearchResultsPosts = (query, searchResults, total, append) => {
  return {
    type: Lib.RECEIVE_SEARCH_RESULTS_POSTS_ACTION,
    append: append,
    query: query,
    searchResults: searchResults,
    totalProps: total
  }
};

export const requestPropertySingleResult = () => {
  return {
    type: Lib.REQUEST_PROPERTY_SINGLE_RESULT_ACTION
  }
};

export const requestPropertySingleResetFetching = () => {
  return {
    type: Lib.REQUEST_PROPERTY_SINGLE_RESET_FETCHING_ACTION
  }
};

export const receivePropertySingleResult = (property) => {
  return {
    type: Lib.RECEIVE_PROPERTY_SINGLE_RESULT_ACTION,
    property: property
  }
}

export const setPropertyTypeOptions = options => {
  return {
    type: Lib.SET_PROPERTY_TYPE_OPTIONS_ACTION,
    options
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

export const toggleUserPanel = (open) => {
  return {
    type: Lib.TOGGLE_USER_PANEL,
    open: open
  }
};

export const setTestimonialsActiveItem = (activeItem) => {
  return {
    type: Lib.SET_TESTIMONIAL_ACTIVE_ITEM_ACTION,
    activeItem: activeItem
  }
};

export const setBlogPosts = (posts, allowPagination) => {
  return {
    type: Lib.SET_BLOG_POSTS_ACTION,
    posts: posts,
    allowPagination: allowPagination
  }
};

export const updatePropertiesModalResultCount = count => {
  return {
    type: Lib.UPDATE_PROPERTIES_MODAL_RESULT_COUNT,
    count: count
  }
};

export const openSaleTypesPanel = open => {
  return {
    type: Lib.SALE_TYPES_PANEL_OPEN_ACTION,
    open: open
  }
};

export const setPropertiesModalResultCountLoading = show => {
  return {
    type: Lib.UPDATE_PROPERTIES_MODAL_RESULT_COUNT_LOADING_ACTION,
    show: show
  }
};

export const setAgentCardTab = tab => {
  return {
    type: Lib.AGENT_CARD_SELECT_TAB,
    tab: tab
  }
}

export const togglePropertiesModalModeInLocationModal = on => {
  return {
    type: Lib.TOGGLE_PROPERTIES_MODAL_MODE_IN_LOCATION_MODAL_ACTION,
    on: on
  }
};