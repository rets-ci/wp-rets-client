import get from 'lodash/get';

export const Lib = {
  BOTTOM_RIGHT_URL_PREFIX: 'geobr',
  COMMON_DATE_FORMAT_1: 'YYYY-MM-D hh:mm:ss',
  DEFAULT_MAP_COORDINATES: {
    lat: 36.0017455,
    lng: -79.0249944
  },
  FORM_MODAL_PREFIX_ACTION: 'formModal-',
  TOGGLE_USER_PANEL: 'TOGGLE_USER_PANEL',
  EXTENSION_DELIMITER: '.',
  INIT_MENU_ACTION: 'INIT_MENU',
  MIN_SEARCH_KEY_LENGTH: 3,
  MOBILE_WIDTH: 768,
  PROPERTY_LISTING_IMAGE_SIZE: '400x230',
  PROPERTY_PER_PAGE: 18,
  RANGE_SLIDER_NO_MIN_TEXT: 'No Min',
  RANGE_SLIDER_NO_MAX_TEXT: 'No Max',
  RECEIVE_LOCATION_MODAL_FETCHING_ERROR_ACTION: 'RECEIVE_LOCATION_MODAL_FETCHING_ERROR',
  RECEIVE_LOCATION_MODAL_POSTS_ACTION: 'RECEIVE_LOCATION_MODAL_POSTS',
  RECEIVE_PROPERTY_SINGLE_RESULT_ACTION: 'RECEIVE_PROPERTY_SINGLE_RESULT',
  RECEIVE_PROPERTY_SINGLE_FETCHING_ERROR_ACTION: 'RECEIVE_PROPERTY_SINGLE_FETCHING_ERROR',
  RECEIVE_PROPERTIES_MODAL_RESULT_COUNT_ACTION: 'RECEIVE_PROPERTIES_MODAL_RESULT_COUNT',
  RECEIVE_PROPERTIES_MODAL_RESULT_COUNT_FETCHING_ERROR_ACTION: 'RECEIVE_PROPERTIES_MODAL_RESULT_COUNT_FETCHING_ERROR',
  RECEIVE_WORDPRESS_CONTENT_FETCH_ACTION: 'RECEIVE_WORDPRESS_CONTENT_FETCH',
  RECEIVE_WORDPRESS_CONTENT_FETCH_ERROR_ACTION: 'RECEIVE_WORDPRESS_CONTENT_FETCH_ERROR',
  REQUEST_AVAILABLE_PROPERTY_SUBTYPES_FOR_SEARCH_ACTION: 'REQUEST_AVAILABLE_PROPERTY_SUBTYPES_FOR_SEARCH',
  REQUEST_LOCATION_MODAL_POSTS_ACTION: 'REQUEST_LOCATION_MODAL_POSTS',
  REQUEST_PROPERTIES_MODAL_RESULT_COUNT_ACTION: 'REQUEST_PROPERTIES_MODAL_RESULT_COUNT',
  REQUEST_PROPERTY_SINGLE_RESULT_ACTION: 'REQUEST_PROPERTY_SINGLE_RESULT',
  REQUEST_SEARCH_RESULTS_POSTS_ACTION: 'REQUEST_SEARCH_RESULTS_POSTS',
  REQUEST_WORDPRESS_CONTENT_FETCH_ACTION: 'REQUEST_WORDPRESS_CONTENT_FETCH',
  AGENT_CARD_SELECT_TAB: 'AGENT_CARD_SELECT_TAB_ACTION',
  ROUTE_CHANGED_ACTION: 'ROUTE_CHANGED',
  SET_FILTER_TERMS_ACTION: 'SET_FILTER_TERMS',
  SET_SEARCH_PROPS_ACTION: 'SET_SEARCH_PROPS',
  RECEIVE_AVAILABLE_PROPERTY_SUBTYPES_FOR_SEARCH_ACTION: 'RECEIVE_AVAILABLE_PROPERTY_SUBTYPES_FOR_SEARCH',
  RECEIVE_AVAILABLE_PROPERTY_SUBTYPES_FOR_SEARCH_ERROR_ACTION: 'RECEIVE_AVAILABLE_PROPERTY_SUBTYPES_FOR_SEARCH_ERROR',
  RECEIVE_SEARCH_RESULTS_POSTS_ACTION: 'RECEIVE_SEARCH_RESULTS_POSTS',
  RECEIVE_SEARCH_RESULTS_POSTS_ERROR_ACTION: 'RECEIVE_SEARCH_RESULTS_POSTS_ERROR',
  SEARCH_MAP_SIZE_WIDTH: 840,
  SEARCH_MAP_SIZE_HEIGHT: 514,
  SET_SEARCH_TYPE: 'SET_SEARCH_TYPE',
  SET_TESTIMONIAL_ACTIVE_ITEM_ACTION: 'SET_TESTIMONIAL_ACTIVE_ITEM',
  SET_USER_DATA_ACTION: 'SET_USER_DATA',
  SET_BLOG_POSTS_ACTION: 'SET_BLOG_POSTS',
  SET_PROPERTY_TYPE_OPTIONS_ACTION: 'SET_PROPERTY_TYPE_OPTIONS',
  STRING_ARRAY_DELIMITER: '-',
  THEME_PREFIX: 'wp-property-pro-',
  TOGGLE_LOCATION_MODAL_ACTION: 'TOGGLE_LOCATION_MODAL',
  TOGGLE_LOGIN_MODAL_ACTION: 'TOGGLE_LOGIN_MODAL',
  SALE_TYPES_PANEL_OPEN_ACTION: 'SALE_TYPES_PANEL_OPEN',
  TOGGLE_FORM_MODAL_ACTION: 'TOGGLE_FORM_MODAL',
  TOGGLE_PROPERTIES_MODAL_ACTION: 'TOGGLE_PROPERTIES_MODAL',
  TOGGLE_PROPERTIES_MODAL_MODE_IN_LOCATION_MODAL_ACTION: 'TOGGLE_PROPERTIES_MODAL_MODE_IN_LOCATION_MODAL',
  SELECT_PROPERTY_ON_MAP_ACTION: 'SELECT_PROPERTY_ON_MAP',
  DESELECT_PROPERTY_ON_MAP_ACTION: 'DESELECT_PROPERTY_ON_MAP',
  URL_DELIMITER: '/',
  AGGREGATION_LOAD_LIMIT: 300,
  AGGREGATION_PAGE_SIZE: 10,
  POST_SUGGEST_COUNT: 10,
  TERM_SUGGEST_COUNT: 20,
  TOP_LEFT_URL_PREFIX: 'geotl',
  ZOOM_URL_PREFIX: 'geoz',
  PROPERTIES_LIST_CAROUSEL: 'carousel',
  PROPERTIES_LIST_DEFAULT: "default",
  THEME_CLASSES_PREFIX: get(bundle, 'theme_prefix', ''),
  AJAX_GET_POSTS_ACTION: "get_posts",
  QUERY_PARAM_SEARCH_FILTER_PREFIX: "wpp_search",
  SUBNAVIGATION_MOBILE_HEIGHT_FOR_BUTTON_DISPLAY: 800,
  BLOG_POSTS_PER_ROW: 2,
  LOCATION_MODAL_REQUESTS_DELAY: 500,
  GOOGLE_STREETVIEW_URL: 'https://maps.googleapis.com/maps/api/streetview',
  HEADER_SEARCH_HEIGHT: 80,
  MAP_CHANGE_ZOOM_LIMIT: 14,
  IS_MOBILE_VIEW: window.innerWidth < 768,
  WINDOW_RESIZE: 'WINDOW_RESIZE',
  MOBILE_THRESHOLD: 768,
  SINGLE_PAGE_STICKY_THRESHOLD: 992,
};
