import {Lib} from '../lib.jsx'

export const deletePropertiesModalTermLocalFilter = termFilter => {
  return {
    type: Lib.DELETE_PROPERTIES_MODAL_TERM_LOCAL_FILTER_ACTION,
    termFilter: termFilter
  }
};

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

export const requestLocationModalPosts = () => {
  return {
    type: Lib.REQUEST_LOCATION_MODAL_POSTS_ACTION
  }
};

export const requestWordpressContentFetch = () => {
  return {
    type: Lib.REQUEST_WORDPRESS_CONTENT_FETCH_ACTION
  }
}

export const requestPropertiesModalResultCount = () => {
  return {
    type: Lib.REQUEST_PROPERTIES_MODAL_RESULT_COUNT_ACTION
  }
};

export const receivePropertiesModalResultCount = resultCount => {
  return {
    type: Lib.RECEIVE_PROPERTIES_MODAL_RESULT_COUNT_ACTION,
    resultCount: resultCount
  }
};

export const receivePropertiesModalResultCountFetchingError = errorMessage => {
  return {
    type: Lib.RECEIVE_PROPERTIES_MODAL_RESULT_COUNT_FETCHING_ERROR_ACTION,
    errorMessage: errorMessage
  }
};

export const receiveWordpressContentFetching = (posts) => {
  return {
    type: Lib.RECEIVE_WORDPRESS_CONTENT_FETCH_ACTION,
    posts: posts
  }
};

export const receiveWordpressContentFetchingError = errorMessage => {
  return {
    type: Lib.RECEIVE_WORDPRESS_CONTENT_FETCH_ERROR_ACTION,
    errorMessage: errorMessage
  }
};

export const receiveLocationModalFetchingError = errorMessage => {
  return {
    type: Lib.RECEIVE_LOCATION_MODAL_FETCHING_ERROR_ACTION,
    errorMessage: errorMessage
  }
}

export const receiveLocationModalPosts = (posts) => {
  return {
    type: Lib.RECEIVE_LOCATION_MODAL_POSTS_ACTION,
    posts: posts
  }
};

export const requestSearchResultsPosts = () => {
  return {
    type: Lib.REQUEST_SEARCH_RESULTS_POSTS_ACTION
  }
};

export const receiveSearchResultsPosts = (query, searchResults, total, append) => {
  return {
    type: Lib.RECEIVE_SEARCH_RESULTS_POSTS_ACTION,
    query: query,
    searchResults: searchResults,
    totalProps: total,
    append: append
  }
};

export const receiveSearchResultsPostsError = (errorMessage) => {
  return {
    type: Lib.RECEIVE_SEARCH_RESULTS_POSTS_ERROR_ACTION,
    errorMessage: errorMessage
  }
};

export const requestPropertySingleResult = () => {
  return {
    type: Lib.REQUEST_PROPERTY_SINGLE_RESULT_ACTION
  }
};

export const receivePropertySingleFetchingError = (errorMessage) => {
  return {
    type: Lib.RECEIVE_PROPERTY_SINGLE_FETCHING_ERROR_ACTION,
    errorMessage: errorMessage
  }
}

export const receivePropertySingleResult = (property) => {
  return {
    type: Lib.RECEIVE_PROPERTY_SINGLE_RESULT_ACTION,
    property: property
  }
}

export const routeChanged = () => {
  return {
    type: Lib.ROUTE_CHANGED_ACTION
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

export const openSaleTypesPanel = open => {
  return {
    type: Lib.SALE_TYPES_PANEL_OPEN_ACTION,
    open: open
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

export const selectPropertyOnMap = property => {
  return {
    type: Lib.SELECT_PROPERTY_ON_MAP_ACTION,
    property,
  };
}

export const deselectPropertyOnMap = property => {
  return {
    type: Lib.DESELECT_PROPERTY_ON_MAP_ACTION,
  };
}