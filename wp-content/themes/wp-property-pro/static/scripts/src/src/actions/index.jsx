import {Lib} from '../lib.jsx'

export const addPost = (post) => {
  return {
    type: Lib.ADD_POST_ACTION,
    post: post
  }
};

export const openLocationModal = (open) => {
  return {
    type: Lib.TOGGLE_LOCATION_MODAL_ACTION,
    open: open
  }
};

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

export const toggleUserPanel = (open) => {
  return {
    type: Lib.TOGGLE_USER_PANEL,
    open: open
  }
}

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
