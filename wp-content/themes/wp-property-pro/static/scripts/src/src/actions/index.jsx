import {Lib} from '../lib.jsx'

export const deletePropertiesModalSingleLocalFilter = filterKey => {
  return {
    type: Lib.DELETE_PROPERTIES_MODAL_SINGLE_LOCAL_FILTER_ACTION,
    filterKey: filterKey
  }
};

export const deletePropertiesModalTermLocalFilter = termFilter => {
  return {
    type: Lib.DELETE_PROPERTIES_MODAL_TERM_LOCAL_FILTER_ACTION,
    termFilter: termFilter
  }
};

export const openLocationModal = (open, modifyType) => {
  return {
    type: Lib.TOGGLE_LOCATION_MODAL_ACTION,
    modifyType: modifyType || null,
    open: open
  }
};

export const openPropertiesModal = (open) => {
  return {
    type: Lib.TOGGLE_PROPERTIES_MODAL_ACTION,
    open: open
  }
};

export const setPropertiesModalLocalFilter = localFilters => {
  return {
    type: Lib.SET_PROPERTIES_MODAL_LOCAL_FILTER_ACTION,
    localFilters: localFilters
  }
};

export const setSearchProps = (searchProps) => {
  return {
    type: Lib.SET_SEARCH_PROPS_ACTION,
    searchProps: searchProps
  }
};

export const setSearchResults = (query, searchResults, total, append) => {
  return {
    type: Lib.SET_SEARCH_RESULTS_ACTION,
    append: append,
    query: query,
    searchResults: searchResults,
    totalProps: total
  }
};

export const setSearchType = searchObject => {
  return {
    type: Lib.SET_SEARCH_TYPE,
    searchType: searchObject.searchType,
    saleType: searchObject.saleType,
    propertyTypes: searchObject.propertyTypes
  }
};

export const setFilterTerms = (filterTerms) => {
  return {
    type: Lib.SET_FILTER_TERMS_ACTION,
    filterTerms: filterTerms
  }
};

export const toggleMapSearchResultsLoading = loading => {
  return {
    type: Lib.TOGGLE_MAP_SEARCH_RESULTS_LOADING_STARTED,
    loading: loading
  }
}

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

export const updatePropertiesModalLocalFilter = filter => {
  return {
    type: Lib.UPDATE_PROPERTIES_MODAL_LOCAL_FILTER_ACTION,
    filter: filter
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
}

export const toggleLocationModalSearchMode = searchMode => {
  return {
    type: Lib.TOGGLE_LOCATION_MODAL_SEARCH_MODE,
    searchMode: searchMode
  }
}