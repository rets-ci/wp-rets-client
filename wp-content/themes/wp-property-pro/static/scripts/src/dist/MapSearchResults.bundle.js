webpackJsonp([0],{

/***/ 551:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(11);

var _lodash = __webpack_require__(3);

var _qs = __webpack_require__(51);

var _qs2 = _interopRequireDefault(_qs);

var _urijs = __webpack_require__(50);

var _urijs2 = _interopRequireDefault(_urijs);

var _Api = __webpack_require__(37);

var _Api2 = _interopRequireDefault(_Api);

var _index = __webpack_require__(13);

var _Util = __webpack_require__(9);

var _Util2 = _interopRequireDefault(_Util);

var _lib = __webpack_require__(1);

var _ErrorMessage = __webpack_require__(111);

var _ErrorMessage2 = _interopRequireDefault(_ErrorMessage);

var _PropertiesModal = __webpack_require__(205);

var _PropertiesModal2 = _interopRequireDefault(_PropertiesModal);

var _LocationModal = __webpack_require__(110);

var _LocationModal2 = _interopRequireDefault(_LocationModal);

var _Map = __webpack_require__(653);

var _Map2 = _interopRequireDefault(_Map);

var _SearchResultListing = __webpack_require__(722);

var _SearchResultListing2 = _interopRequireDefault(_SearchResultListing);

var _SearchFilterDescriptionText = __webpack_require__(739);

var _SearchFilterDescriptionText2 = _interopRequireDefault(_SearchFilterDescriptionText);

var _CarouselOnMap = __webpack_require__(740);

var _CarouselOnMap2 = _interopRequireDefault(_CarouselOnMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var isMobile = window.innerWidth < 576;

var mapStateToProps = function mapStateToProps(state, ownProps) {
  var allQueryParams = _qs2.default.parse(ownProps.location.search.replace('?', ''));
  return {
    allQueryParams: allQueryParams,
    errorMessage: state.errorMessage,
    query: (0, _lodash.get)(state, 'searchResults.query', []),
    isFetching: (0, _lodash.get)(state, 'searchResults.isFetching', []),
    displayedResults: (0, _lodash.get)(state, 'searchResults.displayedResults', []),
    searchQueryParams: allQueryParams[_lib.Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX],
    propertiesModalOpen: (0, _lodash.get)(state, 'propertiesModal.open'),
    propertiesModalResultCountButtonLoading: (0, _lodash.get)(state, 'propertiesModal.resultCountButtonLoading'),
    propertiesModalResultCount: (0, _lodash.get)(state, 'propertiesModal.resultCount'),
    propertyTypeOptions: (0, _lodash.get)(state, 'propertyTypeOptions.options'),
    results: (0, _lodash.get)(state, 'searchResults.searchResults', []),
    resultsTotal: (0, _lodash.get)(state, 'searchResults.totalProps', 0),
    saleTypesPanelOpen: (0, _lodash.get)(state, 'headerSearch.saleTypesPanelOpen', false)
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
  return {
    closeLocationModal: function closeLocationModal() {
      dispatch((0, _index.openLocationModal)(false));
    },

    doPropertiesModalSearch: function doPropertiesModalSearch(filters) {
      dispatch((0, _index.setPropertiesModalResultCountLoading)(true));
      _Api2.default.makeStandardPropertySearch(filters, function (err, query, response) {
        // we are ignoring handling the error here intentionally as the error is handled as soon as the modal is closed
        dispatch((0, _index.setPropertiesModalResultCountLoading)(false));
        dispatch((0, _index.updatePropertiesModalResultCount)((0, _lodash.get)(response, 'hits.total', null)));
      });
    },

    doSearchWithQuery: function doSearchWithQuery(errorMessage, query, append) {
      var url = _Api2.default.getPropertySearchRequestURL();
      dispatch((0, _index.requestSearchResultsPosts)());
      _Api2.default.search(url, query, function (err, response) {
        if (err) {
          dispatch((0, _index.requestSearchResultsPostsResetFetching)());
          return dispatch((0, _index.raiseErrorMessage)(err));
        }
        if (!err && errorMessage) {
          dispatch(resetErrorMessage());
        }
        dispatch((0, _index.receiveSearchResultsPosts)(query, (0, _lodash.get)(response, 'hits.hits', []), (0, _lodash.get)(response, 'hits.total', 0), append));
      });
    },

    openPropertiesModal: function openPropertiesModal(open) {
      dispatch((0, _index.openPropertiesModal)(open));
    },

    openLocationModal: function openLocationModal() {
      dispatch((0, _index.openLocationModal)(true));
    },

    resetSearchResults: function resetSearchResults() {
      dispatch((0, _index.receiveSearchResultsPosts)({}, [], 0));
    },

    standardSearch: function standardSearch(errorMessage, params) {
      dispatch((0, _index.requestSearchResultsPosts)());
      _Api2.default.makeStandardPropertySearch(params, function (err, query, response) {
        if (err) {
          dispatch((0, _index.requestSearchResultsPostsResetFetching)());
          return dispatch((0, _index.raiseErrorMessage)(err));
        }
        if (!err && errorMessage) {
          dispatch(resetErrorMessage());
        }
        dispatch((0, _index.receiveSearchResultsPosts)(query, (0, _lodash.get)(response, 'hits.hits', []), (0, _lodash.get)(response, 'hits.total', 0), false));
      });
    },

    togglePropertiesModalModeInLocationModal: function togglePropertiesModalModeInLocationModal(on) {
      dispatch((0, _index.togglePropertiesModalModeInLocationModal)(on));
    }
  };
};

var MapSearchResults = function (_Component) {
  _inherits(MapSearchResults, _Component);

  function MapSearchResults(props) {
    _classCallCheck(this, MapSearchResults);

    var _this = _possibleConstructorReturn(this, (MapSearchResults.__proto__ || Object.getPrototypeOf(MapSearchResults)).call(this, props));

    _this.dismissNotice = function () {
      _this.setState({ noticeDisplay: false });
    };

    _this.seeMoreHandler = function () {
      var modifiedQuery = _this.props.query;
      modifiedQuery.from = _this.props.displayedResults.length;
      _this.props.doSearchWithQuery(_this.props.errorMessage, modifiedQuery, true);
    };

    _this.updateSelectedProperty = function (propertyId) {
      var filter = { 'selected_property': propertyId };
      var queryParam = _Util2.default.updateQueryFilter(window.location.href, filter, 'set', false);
      // TODO: use location passed in
      _this.props.history.push(window.location.pathname + decodeURIComponent(queryParam));
    };

    _this.state = {
      mapDisplay: true,
      noticeDisplay: true
    };
    _this.displayedProperties = [];
    return _this;
  }

  _createClass(MapSearchResults, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.applyQueryFilters();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var filters = _qs2.default.parse(window.location.search.replace('?', ''));
      if (!(0, _lodash.isEqual)(nextProps.searchQueryParams, this.props.searchQueryParams)) {
        this.applyQueryFilters();
      }

      if (nextProps.displayedResults.length > 0 && !filters.selected_property && isMobile) {
        this.updateSelectedProperty(nextProps.displayedResults[0]._id);
      }
      if (nextProps.searchQueryParams.search_type !== this.props.searchQueryParams.search_type) {
        // this fixes the issue where changing "search_type" would keep the scrolling of the previous search type
        var listingSidebar = this.listingSidebar;
        listingSidebar.scrollTop = 0;
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.resetSearchResults();
    }
  }, {
    key: 'applyQueryFilters',
    value: function applyQueryFilters() {
      var searchFilters = _Util2.default.getSearchFiltersFromURL(window.location.href, true);
      this.props.standardSearch(this.props.errorMEssage, searchFilters);
    }
  }, {
    key: 'clickMobileSwitcherHandler',
    value: function clickMobileSwitcherHandler(mapDisplay) {
      this.setState({
        mapDisplay: mapDisplay
      });
    }
  }, {
    key: 'updateURIGeoCoordinates',
    value: function updateURIGeoCoordinates(geoCoordinates) {
      //TODO: this should be refactored to use the URL related functions in Util.jsx
      // update URL
      var url = new _urijs2.default(window.location.href);
      var queryParam = window.location.search.replace('?', '');
      var currentFilters = _qs2.default.parse(queryParam);
      // remove any current geoCorrdinates before adding additional ones
      delete currentFilters[_lib.Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX]['geoCoordinates'];
      // remove selected property as well
      delete currentFilters['selected_property'];
      currentFilters[_lib.Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX]['geoCoordinates'] = geoCoordinates;
      var newSearchQuery = '?' + _qs2.default.stringify(currentFilters);
      var constructedQuery = decodeURIComponent(url.pathname() + newSearchQuery);
      this.props.history.push(constructedQuery);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          allQueryParams = _props.allQueryParams,
          errorMessage = _props.errorMessage,
          displayedResults = _props.displayedResults,
          doPropertiesModalSearch = _props.doPropertiesModalSearch,
          history = _props.history,
          isFetching = _props.isFetching,
          location = _props.location,
          openPropertiesModal = _props.openPropertiesModal,
          propertiesModalOpen = _props.propertiesModalOpen,
          propertiesModalResultCount = _props.propertiesModalResultCount,
          propertiesModalResultCountButtonLoading = _props.propertiesModalResultCountButtonLoading,
          propertyTypeOptions = _props.propertyTypeOptions,
          results = _props.results,
          resultsTotal = _props.resultsTotal;

      var filters = _qs2.default.parse(window.location.search.replace('?', ''));
      var searchFilters = filters[_lib.Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX];
      var captionElement = this.state.noticeDisplay && displayedResults.length > 0 ? _react2.default.createElement(
        'div',
        { className: _lib.Lib.THEME_CLASSES_PREFIX + "caption" },
        _react2.default.createElement(
          'span',
          { className: _lib.Lib.THEME_CLASSES_PREFIX + "caption-content" },
          'Showing ',
          displayedResults.length,
          ' of ',
          resultsTotal,
          ' listings. Browse to load more or adjust filters.'
        ),
        _react2.default.createElement(
          'span',
          { className: _lib.Lib.THEME_CLASSES_PREFIX + "caption-dismiss", onClick: this.dismissNotice },
          'x'
        )
      ) : null;

      var mobileNavigatorElement = _react2.default.createElement(
        'div',
        { className: _lib.Lib.THEME_CLASSES_PREFIX + 'mobile-bottom-navbar fixed-bottom hidden-sm-up d-flex' },
        _react2.default.createElement(
          'div',
          { className: _lib.Lib.THEME_CLASSES_PREFIX + 'mobile-bottom-navbar-left' },
          _react2.default.createElement(
            'span',
            { onClick: function onClick() {
                return openPropertiesModal(true);
              } },
            'Filter'
          ),
          _react2.default.createElement(
            'span',
            { className: 'separator' },
            '|'
          ),
          _react2.default.createElement(
            'span',
            { onClick: function onClick() {
                return _this2.clickMobileSwitcherHandler.bind(_this2)(!_this2.state.mapDisplay);
              } },
            this.state.mapDisplay ? 'List' : 'Map'
          )
        ),
        _react2.default.createElement('div', { className: _lib.Lib.THEME_CLASSES_PREFIX + 'mobile-bottom-navbar-right' })
      );

      var mapElement = _react2.default.createElement(_Map2.default, {
        currentGeoBounds: searchFilters.geoCoordinates ? _Util2.default.elasticsearchGeoFormatToGoogle(searchFilters.geoCoordinates) : null,
        historyPush: history.push,
        location: this.props.location,
        properties: displayedResults,
        searchByCoordinates: this.updateURIGeoCoordinates.bind(this),
        selectedProperty: filters.selected_property
      });

      var sliderElement = _react2.default.createElement(_CarouselOnMap2.default, {
        properties: displayedResults,
        selectedProperty: filters.selected_property,
        onChangeSlide: this.updateSelectedProperty
      });

      var elementToShow = _react2.default.createElement(
        'div',
        { className: _lib.Lib.THEME_CLASSES_PREFIX + 'search-map' },
        _react2.default.createElement(_PropertiesModal2.default, {
          closeLocationModal: this.props.closeLocationModal,
          closeModal: function closeModal() {
            return openPropertiesModal(false);
          },
          doSearch: doPropertiesModalSearch,
          historyPush: history.push,
          open: propertiesModalOpen,
          openLocationModal: this.props.openLocationModal,
          propertyTypeOptions: propertyTypeOptions,
          resultCount: propertiesModalResultCount,
          resultCountButtonLoading: propertiesModalResultCountButtonLoading,
          searchFilters: (0, _lodash.omit)(searchFilters, ['geoCoordinates']),
          turnOffPropertiesModalModeInLocationModal: function turnOffPropertiesModalModeInLocationModal() {
            return _this2.props.togglePropertiesModalModeInLocationModal(false);
          },
          turnOnPropertiesModalModeInLocationModal: function turnOnPropertiesModalModeInLocationModal() {
            return _this2.props.togglePropertiesModalModeInLocationModal(true);
          }
        }),
        _react2.default.createElement(
          'section',
          { className: _lib.Lib.THEME_CLASSES_PREFIX + 'search-map-section row no-gutters h-100' },
          _react2.default.createElement(
            'div',
            { className: 'col-sm-6 col-lg-4 h-100 ' + _lib.Lib.THEME_CLASSES_PREFIX + 'listing-map ' + (!this.state.mapDisplay ? 'hidden-xs-down' : '') },
            captionElement,
            mapElement,
            isMobile && sliderElement
          ),
          (!isMobile || !this.state.mapDisplay) && _react2.default.createElement(
            'div',
            { className: 'col-sm-6 col-lg-8 h-100 ' + _lib.Lib.THEME_CLASSES_PREFIX + 'listing-sidebar', ref: function ref(r) {
                return _this2.listingSidebar = r;
              } },
            _react2.default.createElement(_SearchFilterDescriptionText2.default, {
              bathrooms: searchFilters.bathrooms,
              bedrooms: searchFilters.bedrooms,
              price: searchFilters.price,
              saleType: searchFilters.sale_type,
              total: this.props.resultsTotal
            }),
            this.props.displayedResults.length > 0 ? _react2.default.createElement(_SearchResultListing2.default, {
              allowPagination: this.props.resultsTotal > this.props.displayedResults.length,
              isFetching: isFetching,
              properties: displayedResults,
              seeMoreHandler: this.seeMoreHandler,
              selectedProperty: filters.selected_property,
              total: this.props.resultsTotal
            }) : errorMessage ? _react2.default.createElement(_ErrorMessage2.default, { message: errorMessage }) : !isFetching ? _react2.default.createElement(
              'p',
              { className: _lib.Lib.THEME_CLASSES_PREFIX + 'gentle-error' },
              'Nothing to show. Please try adjusting the search parameters'
            ) : null
          ),
          isMobile && mobileNavigatorElement
        )
      );
      return _react2.default.createElement(
        'div',
        { className: _lib.Lib.THEME_CLASSES_PREFIX + "search-map-container h-100" },
        elementToShow
      );
    }
  }]);

  return MapSearchResults;
}(_react.Component);

MapSearchResults.propTypes = {
  doPropertiesModalSearch: _propTypes2.default.func.isRequired,
  doSearchWithQuery: _propTypes2.default.func.isRequired,
  history: _propTypes2.default.object.isRequired,
  isFetching: _propTypes2.default.bool.isRequired,
  location: _propTypes2.default.object,
  params: _propTypes2.default.object,
  propertiesModalOpen: _propTypes2.default.bool.isRequired,
  propertiesModalResultCount: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  propertiesModalResultCountButtonLoading: _propTypes2.default.bool.isRequired,
  resetSearchResults: _propTypes2.default.func.isRequired,
  results: _propTypes2.default.array.isRequired
};
exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(MapSearchResults);

/***/ }),

/***/ 552:
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(580);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),

/***/ 556:
/***/ (function(module, exports, __webpack_require__) {

var baseIsNative = __webpack_require__(668),
    getValue = __webpack_require__(673);

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;


/***/ }),

/***/ 557:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _lib = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LoadingCircle = function (_Component) {
  _inherits(LoadingCircle, _Component);

  function LoadingCircle() {
    _classCallCheck(this, LoadingCircle);

    return _possibleConstructorReturn(this, (LoadingCircle.__proto__ || Object.getPrototypeOf(LoadingCircle)).apply(this, arguments));
  }

  _createClass(LoadingCircle, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          containerHeight = _props.containerHeight,
          verticallyCentered = _props.verticallyCentered;


      return _react2.default.createElement(
        'div',
        { className: verticallyCentered ? _lib.Lib.THEME_CLASSES_PREFIX + 'spinner-container' : null, style: { height: containerHeight } },
        _react2.default.createElement(
          'div',
          { className: _lib.Lib.THEME_CLASSES_PREFIX + 'spinner-circle my-auto text-center' },
          _react2.default.createElement('div', { className: _lib.Lib.THEME_CLASSES_PREFIX + 'double-bounce1 rounded-circle' }),
          _react2.default.createElement('div', { className: _lib.Lib.THEME_CLASSES_PREFIX + 'double-bounce2 rounded-circle' })
        )
      );
    }
  }]);

  return LoadingCircle;
}(_react.Component);

LoadingCircle.propTypes = {
  verticallyCentered: _propTypes2.default.bool,
  containerHeight: _propTypes2.default.string
};
exports.default = LoadingCircle;

/***/ }),

/***/ 559:
/***/ (function(module, exports, __webpack_require__) {

var listCacheClear = __webpack_require__(658),
    listCacheDelete = __webpack_require__(659),
    listCacheGet = __webpack_require__(660),
    listCacheHas = __webpack_require__(661),
    listCacheSet = __webpack_require__(662);

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;


/***/ }),

/***/ 560:
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(578);

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;


/***/ }),

/***/ 561:
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(569),
    getRawTag = __webpack_require__(669),
    objectToString = __webpack_require__(670);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),

/***/ 562:
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(556);

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;


/***/ }),

/***/ 563:
/***/ (function(module, exports, __webpack_require__) {

var isKeyable = __webpack_require__(682);

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;


/***/ }),

/***/ 564:
/***/ (function(module, exports) {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),

/***/ 568:
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(556),
    root = __webpack_require__(552);

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ }),

/***/ 569:
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(552);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),

/***/ 570:
/***/ (function(module, exports) {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),

/***/ 578:
/***/ (function(module, exports) {

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;


/***/ }),

/***/ 579:
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(561),
    isObject = __webpack_require__(581);

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;


/***/ }),

/***/ 580:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),

/***/ 581:
/***/ (function(module, exports) {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),

/***/ 582:
/***/ (function(module, exports) {

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;


/***/ }),

/***/ 583:
/***/ (function(module, exports, __webpack_require__) {

var mapCacheClear = __webpack_require__(674),
    mapCacheDelete = __webpack_require__(681),
    mapCacheGet = __webpack_require__(683),
    mapCacheHas = __webpack_require__(684),
    mapCacheSet = __webpack_require__(685);

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;


/***/ }),

/***/ 584:
/***/ (function(module, exports, __webpack_require__) {

var SetCache = __webpack_require__(686),
    arraySome = __webpack_require__(689),
    cacheHas = __webpack_require__(690);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

module.exports = equalArrays;


/***/ }),

/***/ 585:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(552),
    stubFalse = __webpack_require__(707);

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(49)(module)))

/***/ }),

/***/ 586:
/***/ (function(module, exports, __webpack_require__) {

var baseIsTypedArray = __webpack_require__(709),
    baseUnary = __webpack_require__(710),
    nodeUtil = __webpack_require__(711);

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;


/***/ }),

/***/ 587:
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;


/***/ }),

/***/ 588:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  above: 'above',
  inside: 'inside',
  below: 'below',
  invisible: 'invisible'
};
module.exports = exports['default'];

/***/ }),

/***/ 653:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _isEqual = __webpack_require__(654);

var _isEqual2 = _interopRequireDefault(_isEqual);

var _Util = __webpack_require__(9);

var _Util2 = _interopRequireDefault(_Util);

var _lib = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultIcon = {
  url: bundle.static_images_url + 'oval-3-25.png'
};

var selectedIcon = {
  url: bundle.static_images_url + 'oval-selected-3-25.png'
};

var defaultZoom = 9;

var isMobile = window.innerWidth < _lib.Lib.MOBILE_WIDTH;

var Map = function (_Component) {
  _inherits(Map, _Component);

  function Map(props) {
    _classCallCheck(this, Map);

    var _this = _possibleConstructorReturn(this, (Map.__proto__ || Object.getPrototypeOf(Map)).call(this, props));

    _this.onMapChange = function () {
      // only trigger the Geo change at a certain zoom level and exclude initial auto zoom to prevent ES requests duplicate
      if (_this.map.getZoom() >= _lib.Lib.MAP_CHANGE_ZOOM_LIMIT || _this.props.properties.length === 0 || _this.updatingProperties) {
        return;
      }
      var bounds = _this.map.getBounds();
      var ne = bounds.getNorthEast();
      var sw = bounds.getSouthWest();
      _this.props.searchByCoordinates(_Util2.default.googleGeoFormatToElasticsearch({
        ne: {
          lat: ne.lat(),
          lon: ne.lng()
        },
        sw: {
          lat: sw.lat(),
          lon: sw.lng()
        }
      }));
      // enable drag mode to distinguish between initial load and dragging in componentWillReceiveProps
      _this.setState({
        dragMode: true
      });
    };

    _this.bounds;
    _this.map;
    _this.markers = [];
    _this.state = {
      dragMode: false
    };

    return _this;
  }

  _createClass(Map, [{
    key: 'calculateGeoRectangleCenterPoint',
    value: function calculateGeoRectangleCenterPoint(neLat, neLon, swLat, swLon) {
      var calculateCenter = new google.maps.LatLngBounds({
        lat: +swLat,
        lng: +swLon
      }, {
        lat: +neLat,
        lng: +neLon
      }).getCenter();
      return {
        lat: calculateCenter.lat(),
        lng: calculateCenter.lng()
      };
    }
  }, {
    key: 'clearBounds',
    value: function clearBounds() {
      this.bounds = new google.maps.LatLngBounds();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (!(0, _isEqual2.default)(nextProps.properties, this.props.properties)) {
        this.updatingProperties = true;
        if (!this.state.dragMode) {
          var coordinates = this.getInitialCoordinates(null, nextProps.properties);
          this.setMapCoordinates(coordinates);
        }
        this.clearMarkers();
        this.clearBounds();
        this.setPropertyMarkers(nextProps.properties);
        if (!this.state.dragMode) {
          this.map.fitBounds(this.bounds);
          if (this.map.getZoom() < defaultZoom) {
            this.map.setZoom(defaultZoom);
          }
        }
        this.updatingProperties = false;
      }
      var condition = !this.markers.filter(function (m) {
        return m.selected;
      }).length || nextProps.selectedProperty !== this.markers.filter(function (m) {
        return m.selected;
      })[0].propertyId;
      if (condition) {
        this.deselectMarkers(this.markers);
        this.selectMarker(this.markers, nextProps.selectedProperty);
      }
      this.setState({
        dragMode: false
      });
    }
  }, {
    key: 'clearMarkers',
    value: function clearMarkers() {
      this.markers.forEach(function (m) {
        m.setMap(null);
      });
      this.markers = [];
    }
  }, {
    key: 'getInitialCoordinates',
    value: function getInitialCoordinates(currentGeoBounds, properties) {
      // calculate the initial coordinates based on geo bounds from the URL or the properties
      var centerPoint = void 0;
      if (currentGeoBounds) {
        centerPoint = this.calculateGeoRectangleCenterPoint(currentGeoBounds.ne.lat, currentGeoBounds.ne.lon, currentGeoBounds.sw.lat, currentGeoBounds.sw.Lon);
      } else if (properties && properties.length) {
        centerPoint = {
          lat: properties.length ? +properties[0]._source.post_meta.wpp_location_pin[0] : 0,
          lng: properties.length ? +properties[0]._source.post_meta.wpp_location_pin[1] : 0
        };
      } else {
        centerPoint = {
          lat: _lib.Lib.DEFAULT_MAP_COORDINATES.lat,
          lng: _lib.Lib.DEFAULT_MAP_COORDINATES.lng
        };
      }

      return centerPoint;
    }
  }, {
    key: 'setMapCoordinates',
    value: function setMapCoordinates(coordinates) {
      if (!this.map) {
        this.map = new window.google.maps.Map(this.mapElement, {
          center: coordinates,
          mapTypeControlOptions: { mapTypeIds: [] },
          scrollwheel: false,
          streetViewControl: false,
          zoom: defaultZoom,
          zoomControl: isMobile === false
        });
      } else {
        this.map.setCenter(new google.maps.LatLng(coordinates.lat, coordinates.lng));
      }
    }
  }, {
    key: 'setPropertyMarkers',
    value: function setPropertyMarkers(properties) {
      var _this2 = this;

      properties.forEach(function (p) {
        var loc = new window.google.maps.LatLng(p._source.wpp_location_pin.lat, p._source.wpp_location_pin.lon);
        var marker = new window.google.maps.Marker({
          icon: defaultIcon,
          position: loc,
          map: _this2.map
        });
        marker.propertyId = p._id;
        marker.selected = false;
        marker.addListener('click', function () {
          var filter = { 'selected_property': marker.propertyId };
          var queryParam = _Util2.default.updateQueryFilter(window.location.href, filter, 'set', false);
          // TODO: use the location object passed in
          _this2.props.historyPush(window.location.pathname + decodeURIComponent(queryParam));
        });
        _this2.markers.push(marker);
        _this2.bounds.extend(loc);
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var currentGeoBounds = this.props.currentGeoBounds;
      // no properties to pass into `getInitialCoordinates`

      var coordinates = this.getInitialCoordinates(currentGeoBounds, null);
      this.setMapCoordinates(coordinates);
      // this.setPropertyMarkers(this.props.properties);
      this.map.addListener('dragend', this.onMapChange);
      this.map.addListener('zoom_changed', this.onMapChange);
    }
  }, {
    key: 'deselectMarkers',
    value: function deselectMarkers(markers) {
      var selectedMarkers = markers.filter(function (m) {
        return m.selected;
      });
      if (selectedMarkers.length) {
        selectedMarkers.forEach(function (m) {
          m.selected = false;
          m.setIcon(defaultIcon);
        });
      }
    }
  }, {
    key: 'selectMarker',
    value: function selectMarker(markers, selectedProperty) {
      // Remove all current selected markers
      var selectedMarker = markers.filter(function (m) {
        return m.propertyId === selectedProperty;
      });
      if (selectedMarker.length) {
        selectedMarker[0].setIcon(selectedIcon);
        selectedMarker[0].selected = true;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement('div', { id: _lib.Lib.THEME_CLASSES_PREFIX + "Map", ref: function ref(r) {
          return _this3.mapElement = r;
        } });
    }
  }]);

  return Map;
}(_react.Component);

Map.propTypes = {
  currentGeoBounds: _propTypes2.default.object,
  historyPush: _propTypes2.default.func.isRequired,
  searchByCoordinates: _propTypes2.default.func.isRequired,
  properties: _propTypes2.default.array.isRequired
};
exports.default = Map;
;

/***/ }),

/***/ 654:
/***/ (function(module, exports, __webpack_require__) {

var baseIsEqual = __webpack_require__(655);

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return baseIsEqual(value, other);
}

module.exports = isEqual;


/***/ }),

/***/ 655:
/***/ (function(module, exports, __webpack_require__) {

var baseIsEqualDeep = __webpack_require__(656),
    isObjectLike = __webpack_require__(564);

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

module.exports = baseIsEqual;


/***/ }),

/***/ 656:
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(657),
    equalArrays = __webpack_require__(584),
    equalByTag = __webpack_require__(691),
    equalObjects = __webpack_require__(695),
    getTag = __webpack_require__(717),
    isArray = __webpack_require__(570),
    isBuffer = __webpack_require__(585),
    isTypedArray = __webpack_require__(586);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

module.exports = baseIsEqualDeep;


/***/ }),

/***/ 657:
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(559),
    stackClear = __webpack_require__(663),
    stackDelete = __webpack_require__(664),
    stackGet = __webpack_require__(665),
    stackHas = __webpack_require__(666),
    stackSet = __webpack_require__(667);

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;


/***/ }),

/***/ 658:
/***/ (function(module, exports) {

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;


/***/ }),

/***/ 659:
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(560);

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;


/***/ }),

/***/ 660:
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(560);

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;


/***/ }),

/***/ 661:
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(560);

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;


/***/ }),

/***/ 662:
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(560);

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;


/***/ }),

/***/ 663:
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(559);

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;


/***/ }),

/***/ 664:
/***/ (function(module, exports) {

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;


/***/ }),

/***/ 665:
/***/ (function(module, exports) {

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;


/***/ }),

/***/ 666:
/***/ (function(module, exports) {

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;


/***/ }),

/***/ 667:
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(559),
    Map = __webpack_require__(568),
    MapCache = __webpack_require__(583);

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;


/***/ }),

/***/ 668:
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(579),
    isMasked = __webpack_require__(671),
    isObject = __webpack_require__(581),
    toSource = __webpack_require__(582);

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;


/***/ }),

/***/ 669:
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(569);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),

/***/ 670:
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),

/***/ 671:
/***/ (function(module, exports, __webpack_require__) {

var coreJsData = __webpack_require__(672);

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;


/***/ }),

/***/ 672:
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(552);

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ }),

/***/ 673:
/***/ (function(module, exports) {

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;


/***/ }),

/***/ 674:
/***/ (function(module, exports, __webpack_require__) {

var Hash = __webpack_require__(675),
    ListCache = __webpack_require__(559),
    Map = __webpack_require__(568);

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;


/***/ }),

/***/ 675:
/***/ (function(module, exports, __webpack_require__) {

var hashClear = __webpack_require__(676),
    hashDelete = __webpack_require__(677),
    hashGet = __webpack_require__(678),
    hashHas = __webpack_require__(679),
    hashSet = __webpack_require__(680);

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;


/***/ }),

/***/ 676:
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(562);

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;


/***/ }),

/***/ 677:
/***/ (function(module, exports) {

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;


/***/ }),

/***/ 678:
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(562);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;


/***/ }),

/***/ 679:
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(562);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;


/***/ }),

/***/ 680:
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(562);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;


/***/ }),

/***/ 681:
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(563);

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;


/***/ }),

/***/ 682:
/***/ (function(module, exports) {

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;


/***/ }),

/***/ 683:
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(563);

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;


/***/ }),

/***/ 684:
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(563);

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;


/***/ }),

/***/ 685:
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(563);

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;


/***/ }),

/***/ 686:
/***/ (function(module, exports, __webpack_require__) {

var MapCache = __webpack_require__(583),
    setCacheAdd = __webpack_require__(687),
    setCacheHas = __webpack_require__(688);

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;


/***/ }),

/***/ 687:
/***/ (function(module, exports) {

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;


/***/ }),

/***/ 688:
/***/ (function(module, exports) {

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;


/***/ }),

/***/ 689:
/***/ (function(module, exports) {

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;


/***/ }),

/***/ 690:
/***/ (function(module, exports) {

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;


/***/ }),

/***/ 691:
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(569),
    Uint8Array = __webpack_require__(692),
    eq = __webpack_require__(578),
    equalArrays = __webpack_require__(584),
    mapToArray = __webpack_require__(693),
    setToArray = __webpack_require__(694);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;


/***/ }),

/***/ 692:
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(552);

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;


/***/ }),

/***/ 693:
/***/ (function(module, exports) {

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;


/***/ }),

/***/ 694:
/***/ (function(module, exports) {

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;


/***/ }),

/***/ 695:
/***/ (function(module, exports, __webpack_require__) {

var getAllKeys = __webpack_require__(696);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

module.exports = equalObjects;


/***/ }),

/***/ 696:
/***/ (function(module, exports, __webpack_require__) {

var baseGetAllKeys = __webpack_require__(697),
    getSymbols = __webpack_require__(699),
    keys = __webpack_require__(702);

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;


/***/ }),

/***/ 697:
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(698),
    isArray = __webpack_require__(570);

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;


/***/ }),

/***/ 698:
/***/ (function(module, exports) {

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;


/***/ }),

/***/ 699:
/***/ (function(module, exports, __webpack_require__) {

var arrayFilter = __webpack_require__(700),
    stubArray = __webpack_require__(701);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;


/***/ }),

/***/ 700:
/***/ (function(module, exports) {

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;


/***/ }),

/***/ 701:
/***/ (function(module, exports) {

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;


/***/ }),

/***/ 702:
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeKeys = __webpack_require__(703),
    baseKeys = __webpack_require__(712),
    isArrayLike = __webpack_require__(716);

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;


/***/ }),

/***/ 703:
/***/ (function(module, exports, __webpack_require__) {

var baseTimes = __webpack_require__(704),
    isArguments = __webpack_require__(705),
    isArray = __webpack_require__(570),
    isBuffer = __webpack_require__(585),
    isIndex = __webpack_require__(708),
    isTypedArray = __webpack_require__(586);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;


/***/ }),

/***/ 704:
/***/ (function(module, exports) {

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;


/***/ }),

/***/ 705:
/***/ (function(module, exports, __webpack_require__) {

var baseIsArguments = __webpack_require__(706),
    isObjectLike = __webpack_require__(564);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;


/***/ }),

/***/ 706:
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(561),
    isObjectLike = __webpack_require__(564);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;


/***/ }),

/***/ 707:
/***/ (function(module, exports) {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;


/***/ }),

/***/ 708:
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;


/***/ }),

/***/ 709:
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(561),
    isLength = __webpack_require__(587),
    isObjectLike = __webpack_require__(564);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;


/***/ }),

/***/ 710:
/***/ (function(module, exports) {

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;


/***/ }),

/***/ 711:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var freeGlobal = __webpack_require__(580);

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(49)(module)))

/***/ }),

/***/ 712:
/***/ (function(module, exports, __webpack_require__) {

var isPrototype = __webpack_require__(713),
    nativeKeys = __webpack_require__(714);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;


/***/ }),

/***/ 713:
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;


/***/ }),

/***/ 714:
/***/ (function(module, exports, __webpack_require__) {

var overArg = __webpack_require__(715);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;


/***/ }),

/***/ 715:
/***/ (function(module, exports) {

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;


/***/ }),

/***/ 716:
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(579),
    isLength = __webpack_require__(587);

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;


/***/ }),

/***/ 717:
/***/ (function(module, exports, __webpack_require__) {

var DataView = __webpack_require__(718),
    Map = __webpack_require__(568),
    Promise = __webpack_require__(719),
    Set = __webpack_require__(720),
    WeakMap = __webpack_require__(721),
    baseGetTag = __webpack_require__(561),
    toSource = __webpack_require__(582);

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;


/***/ }),

/***/ 718:
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(556),
    root = __webpack_require__(552);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;


/***/ }),

/***/ 719:
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(556),
    root = __webpack_require__(552);

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;


/***/ }),

/***/ 720:
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(556),
    root = __webpack_require__(552);

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;


/***/ }),

/***/ 721:
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(556),
    root = __webpack_require__(552);

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;


/***/ }),

/***/ 722:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _PropertyCardList = __webpack_require__(723);

var _PropertyCardList2 = _interopRequireDefault(_PropertyCardList);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactWaypoint = __webpack_require__(724);

var _reactWaypoint2 = _interopRequireDefault(_reactWaypoint);

var _lodash = __webpack_require__(3);

var _LoadingCircle = __webpack_require__(557);

var _LoadingCircle2 = _interopRequireDefault(_LoadingCircle);

var _lib = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SearchResultListing = function (_Component) {
  _inherits(SearchResultListing, _Component);

  function SearchResultListing(props) {
    _classCallCheck(this, SearchResultListing);

    var _this = _possibleConstructorReturn(this, (SearchResultListing.__proto__ || Object.getPrototypeOf(SearchResultListing)).call(this, props));

    _this.state = {
      loading: false
    };
    return _this;
  }

  _createClass(SearchResultListing, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      var update = nextProps.allowPagination !== this.props.allowPagination || nextProps.isFetching !== this.props.isFetching || (0, _lodash.difference)(nextProps.properties, this.props.properties).length || nextProps.selectedProperty !== this.props.selectedProperty || nextProps.total !== this.props.total;
      return update;
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.properties !== this.props.properties) {
        this.setState({ loading: false });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          isFetching = _props.isFetching,
          properties = _props.properties,
          selectedProperty = _props.selectedProperty,
          total = _props.total;

      var classNames = [];
      classNames.push(_lib.Lib.THEME_CLASSES_PREFIX + 'listing-wrap');
      if (isFetching) {
        classNames.push(_lib.Lib.THEME_CLASSES_PREFIX + 'loading-overlay');
      }
      return _react2.default.createElement(
        'div',
        { className: _lib.Lib.THEME_CLASSES_PREFIX + 'listing-wrap-container h-100' },
        _react2.default.createElement(
          'div',
          { className: classNames.join(' ') },
          _react2.default.createElement(_PropertyCardList2.default, { properties: properties, selectedProperty: selectedProperty })
        ),
        this.props.allowPagination ? _react2.default.createElement(
          'div',
          { className: _lib.Lib.THEME_CLASSES_PREFIX + "search-result-container" },
          _react2.default.createElement(
            'div',
            { className: _lib.Lib.THEME_CLASSES_PREFIX + "search-result-inner-container" },
            this.state.loading ? _react2.default.createElement(_LoadingCircle2.default, null) : null,
            _react2.default.createElement(
              'p',
              null,
              'Showing ',
              this.props.properties.length,
              ' out of ',
              total,
              ' results'
            ),
            !this.state.loading ? _react2.default.createElement(
              'div',
              { className: _lib.Lib.THEME_CLASSES_PREFIX + 'waypoint-container' },
              _react2.default.createElement(_reactWaypoint2.default, {
                onEnter: function onEnter() {
                  _this2.setState({ loading: true });
                  _this2.props.seeMoreHandler();
                }
              })
            ) : null,
            _react2.default.createElement('p', null)
          )
        ) : null
      );
    }
  }]);

  return SearchResultListing;
}(_react.Component);

SearchResultListing.propTypes = {
  allowPagination: _propTypes2.default.bool.isRequired,
  properties: _propTypes2.default.array.isRequired,
  seeMoreHandler: _propTypes2.default.func.isRequired,
  total: _propTypes2.default.number
};
exports.default = SearchResultListing;

/***/ }),

/***/ 723:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = __webpack_require__(3);

var _PropertyCard = __webpack_require__(206);

var _PropertyCard2 = _interopRequireDefault(_PropertyCard);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(27);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PropertyCardList = function (_Component) {
  _inherits(PropertyCardList, _Component);

  function PropertyCardList(props) {
    _classCallCheck(this, PropertyCardList);

    var _this = _possibleConstructorReturn(this, (PropertyCardList.__proto__ || Object.getPrototypeOf(PropertyCardList)).call(this, props));

    _this.state = {};
    _this.propertiesDOM = {};
    return _this;
  }

  _createClass(PropertyCardList, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.properties.length && this.props.selectedProperty) {
        this.scrollToProperty(this.props.selectedProperty);
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (this.props.properties.length && this.props.selectedProperty) {
        this.scrollToProperty(this.props.selectedProperty);
      }
    }
  }, {
    key: 'scrollToProperty',
    value: function scrollToProperty(propertyId) {
      if (!this.propertiesDOM[propertyId]) {
        console.log('chosen property was not found in the results');
      } else {
        var node = (0, _reactDom.findDOMNode)(this.propertiesDOM[propertyId]);
        node.scrollIntoView({ behaviour: 'smooth' });
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return (0, _lodash.difference)(nextProps.properties, this.props.properties).length || nextProps.selectedProperty !== this.props.selectedProperty;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          selectedProperty = _props.selectedProperty,
          properties = _props.properties;

      return _react2.default.createElement(
        'div',
        { className: 'row' },
        properties.map(function (p, i) {
          var item = {
            address: (0, _lodash.get)(p, '_source.post_meta.rets_address', [''])[0],
            address_unit: (0, _lodash.get)(p, '_source.post_meta.address_unit', '')[0],
            location: (0, _lodash.get)(p, '_source.post_meta.wpp_location_pin', []),
            baths: (0, _lodash.get)(p, '_source.post_meta.rets_total_baths', 0),
            beds: (0, _lodash.get)(p, '_source.post_meta.rets_beds', 0),
            city: (0, _lodash.get)(p, '_source.tax_input.wpp_location.wpp_location_city[0].name', ''),
            gallery_images: (0, _lodash.get)(p, '_source.wpp_media', []).map(function (media) {
              return media.url;
            }),
            id: p._id,
            living_area: (0, _lodash.get)(p, '_source.post_meta.rets_living_area', 0),
            lots_size: (0, _lodash.get)(p, '_source.post_meta.rets_lot_size_area', 0),
            price: (0, _lodash.get)(p, '_source.post_meta.rets_list_price[0]', 0),
            post_name: (0, _lodash.get)(p, '_source.post_name', 0),
            state: (0, _lodash.get)(p, '_source.tax_input.wpp_location.wpp_location_state[0].name', ''),
            type: (0, _lodash.get)(p, '_source.tax_input.wpp_listing_type.listing_type[0].slug', ''),
            sqft: (0, _lodash.get)(p, '_source.post_meta.sqft[0]', ''),
            sub_type: (0, _lodash.get)(p, '_source.tax_input.wpp_listing_type.listing_sub_type[0].name', ''),
            relative_permalink: (0, _lodash.get)(p, '_source.permalink', ''),
            thumbnail: (0, _lodash.get)(p, '_source.post_meta.rets_thumbnail_url', [''])[0],
            zip: (0, _lodash.get)(p, '_source.post_meta.rets_postal_code[0]', '')
          };
          return _react2.default.createElement(
            'div',
            { className: 'col-12 col-md-12 col-lg-6 col-xl-4', key: p._id },
            _react2.default.createElement(_PropertyCard2.default, { data: item, highlighted: selectedProperty === p._id, propertiesDOM: _this2.propertiesDOM })
          );
        })
      );
    }
  }]);

  return PropertyCardList;
}(_react.Component);

PropertyCardList.propTypes = {
  properties: _propTypes2.default.array.isRequired,
  selectedProperty: _propTypes2.default.string
};
exports.default = PropertyCardList;

/***/ }),

/***/ 724:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _consolidatedEvents = __webpack_require__(725);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _computeOffsetPixels = __webpack_require__(731);

var _computeOffsetPixels2 = _interopRequireDefault(_computeOffsetPixels);

var _constants = __webpack_require__(588);

var _constants2 = _interopRequireDefault(_constants);

var _debugLog = __webpack_require__(734);

var _debugLog2 = _interopRequireDefault(_debugLog);

var _ensureChildrenIsSingleDOMElement = __webpack_require__(735);

var _ensureChildrenIsSingleDOMElement2 = _interopRequireDefault(_ensureChildrenIsSingleDOMElement);

var _getCurrentPosition = __webpack_require__(737);

var _getCurrentPosition2 = _interopRequireDefault(_getCurrentPosition);

var _resolveScrollableAncestorProp = __webpack_require__(738);

var _resolveScrollableAncestorProp2 = _interopRequireDefault(_resolveScrollableAncestorProp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultProps = {
  topOffset: '0px',
  bottomOffset: '0px',
  horizontal: false,
  onEnter: function onEnter() {},
  onLeave: function onLeave() {},
  onPositionChange: function onPositionChange() {},

  fireOnRapidScroll: true
};

/**
 * Calls a function when you scroll to the element.
 */

var Waypoint = function (_React$Component) {
  _inherits(Waypoint, _React$Component);

  function Waypoint(props) {
    _classCallCheck(this, Waypoint);

    var _this = _possibleConstructorReturn(this, (Waypoint.__proto__ || Object.getPrototypeOf(Waypoint)).call(this, props));

    _this.refElement = function (e) {
      return _this._ref = e;
    };
    return _this;
  }

  _createClass(Waypoint, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      (0, _ensureChildrenIsSingleDOMElement2.default)(this.props.children);

      if (this.props.scrollableParent) {
        // eslint-disable-line react/prop-types
        throw new Error('The `scrollableParent` prop has changed name to `scrollableAncestor`.');
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      if (!Waypoint.getWindow()) {
        return;
      }

      this._handleScroll = this._handleScroll.bind(this);
      this.scrollableAncestor = this._findScrollableAncestor();

      if (false) {
        (0, _debugLog2.default)('scrollableAncestor', this.scrollableAncestor);
      }

      this.scrollEventListenerHandle = (0, _consolidatedEvents.addEventListener)(this.scrollableAncestor, 'scroll', this._handleScroll, { passive: true });

      this.resizeEventListenerHandle = (0, _consolidatedEvents.addEventListener)(window, 'resize', this._handleScroll, { passive: true });

      // this._ref may occasionally not be set at this time. To help ensure that
      // this works smoothly, we want to delay the initial execution until the
      // next tick.
      this.initialTimeout = setTimeout(function () {
        _this2.initialTimeout = null;
        _this2._handleScroll(null);
      }, 0);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      (0, _ensureChildrenIsSingleDOMElement2.default)(nextProps.children);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (!Waypoint.getWindow()) {
        return;
      }

      // The element may have moved.
      this._handleScroll(null);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (!Waypoint.getWindow()) {
        return;
      }

      (0, _consolidatedEvents.removeEventListener)(this.scrollEventListenerHandle);
      (0, _consolidatedEvents.removeEventListener)(this.resizeEventListenerHandle);

      if (this.initialTimeout) {
        clearTimeout(this.initialTimeout);
      }
    }

    /**
     * Traverses up the DOM to find an ancestor container which has an overflow
     * style that allows for scrolling.
     *
     * @return {Object} the closest ancestor element with an overflow style that
     *   allows for scrolling. If none is found, the `window` object is returned
     *   as a fallback.
     */

  }, {
    key: '_findScrollableAncestor',
    value: function _findScrollableAncestor() {
      var _props = this.props,
          horizontal = _props.horizontal,
          scrollableAncestor = _props.scrollableAncestor;


      if (scrollableAncestor) {
        return (0, _resolveScrollableAncestorProp2.default)(scrollableAncestor);
      }

      var node = this._ref;

      while (node.parentNode) {
        node = node.parentNode;

        if (node === document) {
          // This particular node does not have a computed style.
          continue;
        }

        if (node === document.documentElement) {
          // This particular node does not have a scroll bar, it uses the window.
          continue;
        }

        var style = window.getComputedStyle(node);
        var overflowDirec = horizontal ? style.getPropertyValue('overflow-x') : style.getPropertyValue('overflow-y');
        var overflow = overflowDirec || style.getPropertyValue('overflow');

        if (overflow === 'auto' || overflow === 'scroll') {
          return node;
        }
      }

      // A scrollable ancestor element was not found, which means that we need to
      // do stuff on window.
      return window;
    }

    /**
     * @param {Object} event the native scroll event coming from the scrollable
     *   ancestor, or resize event coming from the window. Will be undefined if
     *   called by a React lifecyle method
     */

  }, {
    key: '_handleScroll',
    value: function _handleScroll(event) {
      if (!this._ref) {
        // There's a chance we end up here after the component has been unmounted.
        return;
      }

      var bounds = this._getBounds();
      var currentPosition = (0, _getCurrentPosition2.default)(bounds);
      var previousPosition = this._previousPosition;

      if (false) {
        (0, _debugLog2.default)('currentPosition', currentPosition);
        (0, _debugLog2.default)('previousPosition', previousPosition);
      }

      // Save previous position as early as possible to prevent cycles
      this._previousPosition = currentPosition;

      if (previousPosition === currentPosition) {
        // No change since last trigger
        return;
      }

      var callbackArg = {
        currentPosition: currentPosition,
        previousPosition: previousPosition,
        event: event,
        waypointTop: bounds.waypointTop,
        waypointBottom: bounds.waypointBottom,
        viewportTop: bounds.viewportTop,
        viewportBottom: bounds.viewportBottom
      };
      this.props.onPositionChange.call(this, callbackArg);

      if (currentPosition === _constants2.default.inside) {
        this.props.onEnter.call(this, callbackArg);
      } else if (previousPosition === _constants2.default.inside) {
        this.props.onLeave.call(this, callbackArg);
      }

      var isRapidScrollDown = previousPosition === _constants2.default.below && currentPosition === _constants2.default.above;
      var isRapidScrollUp = previousPosition === _constants2.default.above && currentPosition === _constants2.default.below;

      if (this.props.fireOnRapidScroll && (isRapidScrollDown || isRapidScrollUp)) {
        // If the scroll event isn't fired often enough to occur while the
        // waypoint was visible, we trigger both callbacks anyway.
        this.props.onEnter.call(this, {
          currentPosition: _constants2.default.inside,
          previousPosition: previousPosition,
          event: event,
          waypointTop: bounds.waypointTop,
          waypointBottom: bounds.waypointBottom,
          viewportTop: bounds.viewportTop,
          viewportBottom: bounds.viewportBottom
        });
        this.props.onLeave.call(this, {
          currentPosition: currentPosition,
          previousPosition: _constants2.default.inside,
          event: event,
          waypointTop: bounds.waypointTop,
          waypointBottom: bounds.waypointBottom,
          viewportTop: bounds.viewportTop,
          viewportBottom: bounds.viewportBottom
        });
      }
    }
  }, {
    key: '_getBounds',
    value: function _getBounds() {
      var horizontal = this.props.horizontal;

      var _ref$getBoundingClien = this._ref.getBoundingClientRect(),
          left = _ref$getBoundingClien.left,
          top = _ref$getBoundingClien.top,
          right = _ref$getBoundingClien.right,
          bottom = _ref$getBoundingClien.bottom;

      var waypointTop = horizontal ? left : top;
      var waypointBottom = horizontal ? right : bottom;

      var contextHeight = void 0;
      var contextScrollTop = void 0;
      if (this.scrollableAncestor === window) {
        contextHeight = horizontal ? window.innerWidth : window.innerHeight;
        contextScrollTop = 0;
      } else {
        contextHeight = horizontal ? this.scrollableAncestor.offsetWidth : this.scrollableAncestor.offsetHeight;
        contextScrollTop = horizontal ? this.scrollableAncestor.getBoundingClientRect().left : this.scrollableAncestor.getBoundingClientRect().top;
      }

      if (false) {
        (0, _debugLog2.default)('waypoint top', waypointTop);
        (0, _debugLog2.default)('waypoint bottom', waypointBottom);
        (0, _debugLog2.default)('scrollableAncestor height', contextHeight);
        (0, _debugLog2.default)('scrollableAncestor scrollTop', contextScrollTop);
      }

      var _props2 = this.props,
          bottomOffset = _props2.bottomOffset,
          topOffset = _props2.topOffset;

      var topOffsetPx = (0, _computeOffsetPixels2.default)(topOffset, contextHeight);
      var bottomOffsetPx = (0, _computeOffsetPixels2.default)(bottomOffset, contextHeight);
      var contextBottom = contextScrollTop + contextHeight;

      return {
        waypointTop: waypointTop,
        waypointBottom: waypointBottom,
        viewportTop: contextScrollTop + topOffsetPx,
        viewportBottom: contextBottom - bottomOffsetPx
      };
    }

    /**
     * @return {Object}
     */

  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var children = this.props.children;


      if (!children) {
        // We need an element that we can locate in the DOM to determine where it is
        // rendered relative to the top of its context.
        return _react2.default.createElement('span', { ref: this.refElement, style: { fontSize: 0 } });
      }

      var ref = function ref(node) {
        _this3.refElement(node);
        if (children.ref) {
          children.ref(node);
        }
      };

      return _react2.default.cloneElement(children, { ref: ref });
    }
  }]);

  return Waypoint;
}(_react2.default.Component);

exports.default = Waypoint;


Waypoint.propTypes = {
  children: _react.PropTypes.element,
  debug: _react.PropTypes.bool,
  onEnter: _react.PropTypes.func,
  onLeave: _react.PropTypes.func,
  onPositionChange: _react.PropTypes.func,
  fireOnRapidScroll: _react.PropTypes.bool,
  scrollableAncestor: _react.PropTypes.any,
  horizontal: _react.PropTypes.bool,

  // `topOffset` can either be a number, in which case its a distance from the
  // top of the container in pixels, or a string value. Valid string values are
  // of the form "20px", which is parsed as pixels, or "20%", which is parsed
  // as a percentage of the height of the containing element.
  // For instance, if you pass "-20%", and the containing element is 100px tall,
  // then the waypoint will be triggered when it has been scrolled 20px beyond
  // the top of the containing element.
  topOffset: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),

  // `bottomOffset` is like `topOffset`, but for the bottom of the container.
  bottomOffset: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number])
};

Waypoint.above = _constants2.default.above;
Waypoint.below = _constants2.default.below;
Waypoint.inside = _constants2.default.inside;
Waypoint.invisible = _constants2.default.invisible;
Waypoint.getWindow = function () {
  if (typeof window !== 'undefined') {
    return window;
  }
};
Waypoint.defaultProps = defaultProps;
Waypoint.displayName = 'Waypoint';
module.exports = exports['default'];

/***/ }),

/***/ 725:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EVENT_HANDLERS_KEY = undefined;
exports.addEventListener = addEventListener;
exports.removeEventListener = removeEventListener;

var _normalizeEventOptions = __webpack_require__(726);

var _normalizeEventOptions2 = _interopRequireDefault(_normalizeEventOptions);

var _TargetEventHandlers = __webpack_require__(729);

var _TargetEventHandlers2 = _interopRequireDefault(_TargetEventHandlers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Export to make testing possible.
var EVENT_HANDLERS_KEY = exports.EVENT_HANDLERS_KEY = '__consolidated_events_handlers__';

function addEventListener(target, eventName, listener, options) {
  if (!target[EVENT_HANDLERS_KEY]) {
    // eslint-disable-next-line no-param-reassign
    target[EVENT_HANDLERS_KEY] = new _TargetEventHandlers2['default'](target);
  }
  var normalizedEventOptions = (0, _normalizeEventOptions2['default'])(options);
  return target[EVENT_HANDLERS_KEY].add(eventName, listener, normalizedEventOptions);
}

function removeEventListener(eventHandle) {
  var target = eventHandle.target;

  // There can be a race condition where the target may no longer exist when
  // this function is called, e.g. when a React component is unmounting.
  // Guarding against this prevents the following error:
  //
  //   Cannot read property 'removeEventListener' of undefined

  if (target) {
    target[EVENT_HANDLERS_KEY]['delete'](eventHandle);
  }
}

/***/ }),

/***/ 726:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = normalizeEventOptions;

var _canUsePassiveEventListeners = __webpack_require__(727);

var _canUsePassiveEventListeners2 = _interopRequireDefault(_canUsePassiveEventListeners);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function normalizeEventOptions(eventOptions) {
  if (!eventOptions) {
    return undefined;
  }

  if (!(0, _canUsePassiveEventListeners2['default'])()) {
    // If the browser does not support the passive option, then it is expecting
    // a boolean for the options argument to specify whether it should use
    // capture or not. In more modern browsers, this is passed via the `capture`
    // option, so let's just hoist that value up.
    return !!eventOptions.capture;
  }

  return eventOptions;
}

/***/ }),

/***/ 727:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = canUsePassiveEventListeners;

var _canUseDOM = __webpack_require__(728);

var _canUseDOM2 = _interopRequireDefault(_canUseDOM);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Adapted from Modernizr
// https://github.com/Modernizr/Modernizr/blob/5eea7e2a/feature-detects/dom/passiveeventlisteners.js#L26-L35
function testPassiveEventListeners() {
  if (!_canUseDOM2['default']) {
    return false;
  }

  var supportsPassiveOption = false;
  try {
    var opts = Object.defineProperty({}, 'passive', {
      get: function () {
        function get() {
          supportsPassiveOption = true;
        }

        return get;
      }()
    });
    window.addEventListener('test', null, opts);
  } catch (e) {
    // do nothing
  }

  return supportsPassiveOption;
}

var memoized = void 0;

function canUsePassiveEventListeners() {
  if (memoized === undefined) {
    memoized = testPassiveEventListeners();
  }
  return memoized;
}

/***/ }),

/***/ 728:
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
var CAN_USE_DOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

exports['default'] = CAN_USE_DOM;

/***/ }),

/***/ 729:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventOptionsKey = __webpack_require__(730);

var _eventOptionsKey2 = _interopRequireDefault(_eventOptionsKey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TargetEventHandlers = function () {
  function TargetEventHandlers(target) {
    _classCallCheck(this, TargetEventHandlers);

    this.target = target;
    this.events = {};
  }

  _createClass(TargetEventHandlers, [{
    key: 'getEventHandlers',
    value: function () {
      function getEventHandlers(eventName, options) {
        var key = String(eventName) + ' ' + String((0, _eventOptionsKey2['default'])(options));

        if (!this.events[key]) {
          this.events[key] = {
            size: 0,
            index: 0,
            handlers: {},
            handleEvent: undefined
          };
        }
        return this.events[key];
      }

      return getEventHandlers;
    }()
  }, {
    key: 'handleEvent',
    value: function () {
      function handleEvent(eventName, options, event) {
        var _getEventHandlers = this.getEventHandlers(eventName, options),
            handlers = _getEventHandlers.handlers;

        Object.keys(handlers).forEach(function (index) {
          var handler = handlers[index];
          if (handler) {
            // We need to check for presence here because a handler function may
            // cause later handlers to get removed. This can happen if you for
            // instance have a waypoint that unmounts another waypoint as part of an
            // onEnter/onLeave handler.
            handler(event);
          }
        });
      }

      return handleEvent;
    }()
  }, {
    key: 'add',
    value: function () {
      function add(eventName, listener, options) {
        // options has already been normalized at this point.
        var eventHandlers = this.getEventHandlers(eventName, options);

        if (eventHandlers.size === 0) {
          eventHandlers.handleEvent = this.handleEvent.bind(this, eventName, options);

          this.target.addEventListener(eventName, eventHandlers.handleEvent, options);
        }

        eventHandlers.size += 1;
        eventHandlers.index += 1;
        eventHandlers.handlers[eventHandlers.index] = listener;

        return {
          target: this.target,
          eventName: eventName,
          options: options,
          index: eventHandlers.index
        };
      }

      return add;
    }()
  }, {
    key: 'delete',
    value: function () {
      function _delete(_ref) {
        var eventName = _ref.eventName,
            index = _ref.index,
            options = _ref.options;

        // options has already been normalized at this point.
        var eventHandlers = this.getEventHandlers(eventName, options);

        if (eventHandlers.size === 0) {
          // There are no matching event handlers, so no work to be done here.
          return;
        }

        if (eventHandlers.handlers[index]) {
          delete eventHandlers.handlers[index];
          eventHandlers.size -= 1;
        }

        if (eventHandlers.size === 0) {
          this.target.removeEventListener(eventName, eventHandlers.handleEvent, options);

          eventHandlers.handleEvent = undefined;
        }
      }

      return _delete;
    }()
  }]);

  return TargetEventHandlers;
}();

exports['default'] = TargetEventHandlers;

/***/ }),

/***/ 730:
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = eventOptionsKey;
/* eslint-disable no-bitwise */

/**
 * Generate a unique key for any set of event options
 */
function eventOptionsKey(normalizedEventOptions) {
  if (!normalizedEventOptions) {
    return 0;
  }

  // If the browser does not support passive event listeners, the normalized
  // event options will be a boolean.
  if (normalizedEventOptions === true) {
    return 100;
  }

  // At this point, the browser supports passive event listeners, so we expect
  // the event options to be an object with possible properties of capture,
  // passive, and once.
  //
  // We want to consistently return the same value, regardless of the order of
  // these properties, so let's use binary maths to assign each property to a
  // bit, and then add those together (with an offset to account for the
  // booleans at the beginning of this function).
  var capture = normalizedEventOptions.capture << 0;
  var passive = normalizedEventOptions.passive << 1;
  var once = normalizedEventOptions.once << 2;
  return capture + passive + once;
}

/***/ }),

/***/ 731:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = computeOffsetPixels;

var _parseOffsetAsPercentage = __webpack_require__(732);

var _parseOffsetAsPercentage2 = _interopRequireDefault(_parseOffsetAsPercentage);

var _parseOffsetAsPixels = __webpack_require__(733);

var _parseOffsetAsPixels2 = _interopRequireDefault(_parseOffsetAsPixels);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {string|number} offset
 * @param {number} contextHeight
 * @return {number} A number representing `offset` converted into pixels.
 */
function computeOffsetPixels(offset, contextHeight) {
  var pixelOffset = (0, _parseOffsetAsPixels2.default)(offset);

  if (typeof pixelOffset === 'number') {
    return pixelOffset;
  }

  var percentOffset = (0, _parseOffsetAsPercentage2.default)(offset);
  if (typeof percentOffset === 'number') {
    return percentOffset * contextHeight;
  }
}
module.exports = exports['default'];

/***/ }),

/***/ 732:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseOffsetAsPercentage;
/**
 * Attempts to parse the offset provided as a prop as a percentage. For
 * instance, if the component has been provided with the string "20%" as
 * a value of one of the offset props. If the value matches, then it returns
 * a numeric version of the prop. For instance, "20%" would become `0.2`.
 * If `str` isn't a percentage, then `undefined` will be returned.
 *
 * @param {string} str The value of an offset prop to be converted to a
 *   number.
 * @return {number|undefined} The numeric version of `str`. Undefined if `str`
 *   was not a percentage.
 */
function parseOffsetAsPercentage(str) {
  if (str.slice(-1) === '%') {
    return parseFloat(str.slice(0, -1)) / 100;
  }
}
module.exports = exports['default'];

/***/ }),

/***/ 733:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseOffsetAsPixels;
/**
 * Attempts to parse the offset provided as a prop as a pixel value. If
 * parsing fails, then `undefined` is returned. Three examples of values that
 * will be successfully parsed are:
 * `20`
 * "20px"
 * "20"
 *
 * @param {string|number} str A string of the form "{number}" or "{number}px",
 *   or just a number.
 * @return {number|undefined} The numeric version of `str`. Undefined if `str`
 *   was neither a number nor string ending in "px".
 */
function parseOffsetAsPixels(str) {
  if (!isNaN(parseFloat(str)) && isFinite(str)) {
    return parseFloat(str);
  } else if (str.slice(-2) === 'px') {
    return parseFloat(str.slice(0, -2));
  }
}
module.exports = exports['default'];

/***/ }),

/***/ 734:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = debugLog;
function debugLog() {
  if (false) {
    console.log(arguments); // eslint-disable-line no-console
  }
}
module.exports = exports['default'];

/***/ }),

/***/ 735:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ensureChildrenIsSingleDOMElement;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _isDOMElement = __webpack_require__(736);

var _isDOMElement2 = _interopRequireDefault(_isDOMElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Raise an error if "children" isn't a single DOM Element
 *
 * @param {React.element|null} children
 * @return {undefined}
 */
function ensureChildrenIsSingleDOMElement(children) {
  if (children) {
    _react2.default.Children.only(children);

    if (!(0, _isDOMElement2.default)(children)) {
      throw new Error('You must wrap any Component Elements passed to Waypoint in a DOM Element (eg; a <div>).');
    }
  }
}
module.exports = exports['default'];

/***/ }),

/***/ 736:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isDOMElement;
/**
 * When an element's type is a string, it represents a DOM node with that tag name
 * https://facebook.github.io/react/blog/2015/12/18/react-components-elements-and-instances.html#dom-elements
 *
 * @param {React.element} Component
 * @return {bool} Whether the component is a DOM Element
 */
function isDOMElement(Component) {
  return typeof Component.type === 'string';
}
module.exports = exports['default'];

/***/ }),

/***/ 737:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getCurrentPosition;

var _constants = __webpack_require__(588);

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {object} bounds An object with bounds data for the waypoint and
 *   scrollable parent
 * @return {string} The current position of the waypoint in relation to the
 *   visible portion of the scrollable parent. One of `constants.above`,
 *   `constants.below`, or `constants.inside`.
 */
function getCurrentPosition(bounds) {
  if (bounds.viewportBottom - bounds.viewportTop === 0) {
    return _constants2.default.invisible;
  }

  // top is within the viewport
  if (bounds.viewportTop <= bounds.waypointTop && bounds.waypointTop <= bounds.viewportBottom) {
    return _constants2.default.inside;
  }

  // bottom is within the viewport
  if (bounds.viewportTop <= bounds.waypointBottom && bounds.waypointBottom <= bounds.viewportBottom) {
    return _constants2.default.inside;
  }

  // top is above the viewport and bottom is below the viewport
  if (bounds.waypointTop <= bounds.viewportTop && bounds.viewportBottom <= bounds.waypointBottom) {
    return _constants2.default.inside;
  }

  if (bounds.viewportBottom < bounds.waypointTop) {
    return _constants2.default.below;
  }

  if (bounds.waypointTop < bounds.viewportTop) {
    return _constants2.default.above;
  }

  return _constants2.default.invisible;
}
module.exports = exports['default'];

/***/ }),

/***/ 738:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resolveScrollableAncestorProp;
function resolveScrollableAncestorProp(scrollableAncestor) {
  // When Waypoint is rendered on the server, `window` is not available.
  // To make Waypoint easier to work with, we allow this to be specified in
  // string form and safely convert to `window` here.
  if (scrollableAncestor === 'window') {
    return global.window;
  }

  return scrollableAncestor;
}
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),

/***/ 739:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lib = __webpack_require__(1);

var _Util = __webpack_require__(9);

var _Util2 = _interopRequireDefault(_Util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SearchFilterDescription = function (_Component) {
  _inherits(SearchFilterDescription, _Component);

  function SearchFilterDescription() {
    _classCallCheck(this, SearchFilterDescription);

    return _possibleConstructorReturn(this, (SearchFilterDescription.__proto__ || Object.getPrototypeOf(SearchFilterDescription)).apply(this, arguments));
  }

  _createClass(SearchFilterDescription, [{
    key: 'getMainText',
    value: function getMainText(props) {
      var bathrooms = props.bathrooms,
          bedrooms = props.bedrooms,
          saleType = props.saleType,
          total = props.total,
          price = props.price;

      var text = '';
      if (total && saleType) {
        text += 'There are ' + total + ' homes for ' + saleType + ' in this area';
      }
      if (price && !(price.to === _lib.Lib.RANGE_SLIDER_NO_MAX_TEXT && price.start === _lib.Lib.RANGE_SLIDER_NO_MIN_TEXT)) {
        text += ' that are priced';
        if (price.to === _lib.Lib.RANGE_SLIDER_NO_MAX_TEXT) {
          text += ' more than ' + _Util2.default.formatPriceValue(price.start) + ' ';
        } else if (price.start === _lib.Lib.RANGE_SLIDER_NO_MIN_TEXT) {
          text += ' less than ' + _Util2.default.formatPriceValue(price.to) + ' ';
        } else {
          text += ' between ' + _Util2.default.formatPriceValue(price.start) + ' and ' + _Util2.default.formatPriceValue(price.to);
        }
      }

      if (bedrooms) {
        text += ' with ' + bedrooms + ' or more bedrooms';
      }
      if (bathrooms) {
        var prefix = bedrooms ? ' and' : ' with';
        text += prefix + ' ' + bathrooms + ' or more bathrooms';
      }
      return text;
    }
  }, {
    key: 'render',
    value: function render() {
      var headText = 'Homes for ' + this.props.saleType;

      var mainText = this.getMainText(this.props);
      return _react2.default.createElement(
        'div',
        { className: _lib.Lib.THEME_CLASSES_PREFIX + "headtitle" },
        _react2.default.createElement(
          'h1',
          null,
          headText
        ),
        _react2.default.createElement(
          'p',
          null,
          mainText
        )
      );
    }
  }]);

  return SearchFilterDescription;
}(_react.Component);

SearchFilterDescription.propTypes = {
  bathrooms: _propTypes2.default.string,
  bedrooms: _propTypes2.default.string,
  price: _propTypes2.default.object,
  saleType: _propTypes2.default.string.isRequired,
  total: _propTypes2.default.number
};
;

exports.default = SearchFilterDescription;

/***/ }),

/***/ 740:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactIdSwiper = __webpack_require__(109);

var _reactIdSwiper2 = _interopRequireDefault(_reactIdSwiper);

var _lodash = __webpack_require__(3);

var _lib = __webpack_require__(1);

var _PropertyCard = __webpack_require__(206);

var _PropertyCard2 = _interopRequireDefault(_PropertyCard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CarouselOnMap = function (_Component) {
  _inherits(CarouselOnMap, _Component);

  function CarouselOnMap(props) {
    _classCallCheck(this, CarouselOnMap);

    var _this = _possibleConstructorReturn(this, (CarouselOnMap.__proto__ || Object.getPrototypeOf(CarouselOnMap)).call(this, props));

    _this.slideToId = function (propertyId) {
      var index = (_this.props.properties || []).findIndex(function (e) {
        return e._id === propertyId;
      });

      if (_this.swiper && index > -1) {
        _this.swiper.slideTo(index);
      }
    };

    _this.swiper = null;
    return _this;
  }

  _createClass(CarouselOnMap, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.selectedProperty !== this.props.selectedProperty) {
        this.slideToId(nextProps.selectedProperty);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var properties = this.props.properties;

      var swiperParams = {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 0,
        onInit: function onInit(swiper) {
          _this2.swiper = swiper;
        },
        onSlideChangeEnd: function onSlideChangeEnd(swiper) {
          var property = _this2.props.properties[swiper.activeIndex];
          _this2.props.onChangeSlide(property._id);
        }
      };

      return _react2.default.createElement(
        'div',
        { className: _lib.Lib.THEME_CLASSES_PREFIX + 'listing-wrap hidden-sm-up' },
        properties.length > 0 && _react2.default.createElement(
          _reactIdSwiper2.default,
          swiperParams,
          properties.map(function (p, key) {
            var item = {
              address: (0, _lodash.get)(p, '_source.post_meta.rets_address', [''])[0],
              address_unit: (0, _lodash.get)(p, '_source.post_meta.address_unit', ''),
              location: (0, _lodash.get)(p, '_source.post_meta.wpp_location_pin', []),
              baths: (0, _lodash.get)(p, '_source.post_meta.rets_total_baths', 0),
              beds: (0, _lodash.get)(p, '_source.post_meta.rets_beds', 0),
              city: (0, _lodash.get)(p, '_source.tax_input.wpp_location.wpp_location_city[0].name', ''),
              gallery_images: (0, _lodash.get)(p, '_source.wpp_media', []).map(function (media) {
                return media.url;
              }),
              id: p._id,
              living_area: (0, _lodash.get)(p, '_source.post_meta.rets_living_area', 0),
              lots_size: (0, _lodash.get)(p, '_source.post_meta.rets_lot_size_area', 0),
              price: (0, _lodash.get)(p, '_source.post_meta.rets_list_price[0]', 0),
              post_name: (0, _lodash.get)(p, '_source.post_name', 0),
              state: (0, _lodash.get)(p, '_source.tax_input.wpp_location.wpp_location_state[0].name', ''),
              type: (0, _lodash.get)(p, '_source.tax_input.wpp_listing_type.listing_type[0].slug', ''),
              sub_type: (0, _lodash.get)(p, '_source.tax_input.wpp_listing_type.listing_sub_type[0].name', ''),
              relative_permalink: (0, _lodash.get)(p, '_source.permalink', ''),
              thumbnail: (0, _lodash.get)(p, '_source.post_meta.rets_thumbnail_url', [''])[0],
              zip: (0, _lodash.get)(p, '_source.post_meta.rets_postal_code[0]', '')
            };

            return _react2.default.createElement(
              'div',
              { className: 'swiper-slide', key: key },
              _react2.default.createElement(_PropertyCard2.default, { data: item })
            );
          })
        )
      );
    }
  }]);

  return CarouselOnMap;
}(_react.Component);

CarouselOnMap.propTypes = {
  properties: _propTypes2.default.array,
  selectedProperty: _propTypes2.default.string,
  onChangeSlide: _propTypes2.default.func
};
exports.default = CarouselOnMap;
;

/***/ })

});