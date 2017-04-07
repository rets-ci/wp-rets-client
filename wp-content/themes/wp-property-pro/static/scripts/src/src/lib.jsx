import _ from 'lodash';

export const Lib = {
  ADD_MAP_ACTION: 'ADD_MAP',
  ADD_MARKER_ACTION: 'ADD_MARKER',
  TOGGLE_USER_PANEL: 'TOGGLE_USER_PANEL',
  EXTENSION_DELIMITER: '.',
  INIT_MENU_ACTION: 'INIT_MENU',
  MIN_SEARCH_KEY_LENGTH: 3,
  MOBILE_WIDTH: 768,
  PROPERTY_LISTING_IMAGE_SIZE: '400x230',
  PROPERTY_PER_PAGE: 18,
  SET_FILTER_TERMS_ACTION: 'SET_FILTER_TERMS',
  SET_MAP_MARKERS_ACTION: 'SET_MAP_MARKERS',
  SET_SEARCH_PROPS_ACTION: 'SET_SEARCH_PROPS',
  SET_SEARCH_RESULTS_ACTION: 'SET_SEARCH_RESULTS',
  SET_SEARCH_TYPE: 'SET_SEARCH_TYPE',
  SET_TESTIMONIAL_ACTIVE_ITEM_ACTION: 'SET_TESTIMONIAL_ACTIVE_ITEM',
  SET_USER_DATA_ACTION: 'SET_USER_DATA',
  SET_BLOG_POSTS_ACTION: 'SET_BLOG_POSTS',
  STRING_ARRAY_DELIMITER: '-',
  THEME_PREFIX: 'wp-property-pro-',
  TOGGLE_LOCATION_MODAL_ACTION: 'TOGGLE_LOCATION_MODAL',
  TOGGLE_MAP_SEARCH_RESULTS_LOADING_STARTED: 'TOGGLE_MAP_SEARCH_RESULTS_LOADING_STARTED',
  TOGGLE_PROPERTIES_MODAL_ACTION: 'TOGGLE_PROPERTIES_MODAL',
  TOP_AGGREGATIONS_COUNT: 5,
  URL_DELIMITER: '/',
  POST_SUGGEST_COUNT: 5,
  TERM_SUGGEST_COUNT: 20,
  PROPERTIES_LIST_CAROUSEL: "carousel",
  PROPERTIES_LIST_DEFAULT: "default",
  THEME_CLASSES_PREFIX: _.get(bundle, 'theme_prefix', ''),
  AJAX_GET_POSTS_ACTION: "get_posts",
  ELASTIC_SEARCH_FUZZINESS_COUNT: 1,
  QUERY_PARAM_SEARCH_FILTER_PREFIX: "wpp_search",
  SUBNAVIGATION_MOBILE_HEIGHT_FOR_BUTTON_DISPLAY: 800
};
