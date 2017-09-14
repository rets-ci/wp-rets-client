import _ from 'lodash';

export const Lib = {
  COMMON_DATE_FORMAT_1: 'YYYY-MM-D hh:mm:ss',
  DEFAULT_MAP_COORDINATES: {
    lat: 36.0017455,
    lng: -79.0249944
  },
  ERROR_MESSAGE_ACTION: 'ERROR_MESSAGE',
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
  RECEIVE_LOCATION_MODAL_POSTS_ACTION: 'RECEIVE_LOCATION_MODAL_POSTS',
  RECEIVE_PROPERTY_SINGLE_RESULT_ACTION: 'RECEIVE_PROPERTY_SINGLE_RESULT',
  RESET_ERROR_MESSAGE_ACTION: 'RESET_ERROR_MESSAGE',
  REQUEST_LOCATION_MODAL_POSTS_ACTION: 'REQUEST_LOCATION_MODAL_POSTS',
  REQUEST_LOCATION_MODAL_RESET_FETCHING_ACTION: 'REQUEST_LOCATION_MODAL_RESET_FETCHING',
  REQUEST_PROPERTY_SINGLE_RESULT_ACTION: 'REQUEST_PROPERTY_SINGLE_RESULT',
  REQUEST_PROPERTY_SINGLE_RESET_FETCHING_ACTION: 'REQUEST_PROPERTY_SINGLE_RESET_FETCHING',
  REQUEST_SEARCH_RESULTS_POSTS_ACTION: 'REQUEST_SEARCH_RESULTS_POSTS',
  REQUEST_SEARCH_RESULTS_POSTS_RESET_RESULTS_ACTION: 'REQUEST_SEARCH_RESULTS_POSTS_RESET_RESULTS',
  AGENT_CARD_SELECT_TAB: 'AGENT_CARD_SELECT_TAB_ACTION',
  ROUTE_CHANGED_ACTION: 'ROUTE_CHANGED',
  SET_FILTER_TERMS_ACTION: 'SET_FILTER_TERMS',
  SET_SEARCH_PROPS_ACTION: 'SET_SEARCH_PROPS',
  RECEIVE_SEARCH_RESULTS_POSTS_ACTION: 'RECEIVE_SEARCH_RESULTS_POSTS',
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
  TOP_AGGREGATIONS_COUNT: 5,
  UPDATE_PROPERTIES_MODAL_RESULT_COUNT: 'UPDATE_PROPERTIES_MODAL_RESULT_COUNT',
  UPDATE_PROPERTIES_MODAL_RESULT_COUNT_LOADING_ACTION: 'UPDATE_PROPERTIES_MODAL_RESULT_COUNT_LOADING_ACTION',
  URL_DELIMITER: '/',
  POST_SUGGEST_COUNT: 5,
  TERM_SUGGEST_COUNT: 20,
  PROPERTIES_LIST_CAROUSEL: "carousel",
  PROPERTIES_LIST_DEFAULT: "default",
  THEME_CLASSES_PREFIX: _.get(bundle, 'theme_prefix', ''),
  AJAX_GET_POSTS_ACTION: "get_posts",
  QUERY_PARAM_SEARCH_FILTER_PREFIX: "wpp_search",
  SUBNAVIGATION_MOBILE_HEIGHT_FOR_BUTTON_DISPLAY: 800,
  BLOG_POSTS_PER_ROW: 2,
  LOCATION_MODAL_REQUESTS_DELAY: 500,
  GOOGLE_STREETVIEW_URL: 'https://maps.googleapis.com/maps/api/streetview',
  HEADER_SEARCH_HEIGHT: 80,
  MAP_CHANGE_ZOOM_LIMIT: 14,
  IS_MOBILE_VIEW: window.innerWidth < 768,
};
