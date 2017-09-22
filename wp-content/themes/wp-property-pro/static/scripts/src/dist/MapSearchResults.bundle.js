webpackJsonp([1],{

/***/ 718:
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

var _reactRedux = __webpack_require__(12);

var _get = __webpack_require__(3);

var _get2 = _interopRequireDefault(_get);

var _isEqual = __webpack_require__(86);

var _isEqual2 = _interopRequireDefault(_isEqual);

var _omit = __webpack_require__(814);

var _omit2 = _interopRequireDefault(_omit);

var _qs = __webpack_require__(64);

var _qs2 = _interopRequireDefault(_qs);

var _urijs = __webpack_require__(63);

var _urijs2 = _interopRequireDefault(_urijs);

var _Api = __webpack_require__(46);

var _Api2 = _interopRequireDefault(_Api);

var _index = __webpack_require__(14);

var _Util = __webpack_require__(9);

var _Util2 = _interopRequireDefault(_Util);

var _lib = __webpack_require__(1);

var _ErrorMessage = __webpack_require__(150);

var _ErrorMessage2 = _interopRequireDefault(_ErrorMessage);

var _PropertiesModal = __webpack_require__(265);

var _PropertiesModal2 = _interopRequireDefault(_PropertiesModal);

var _LocationModal = __webpack_require__(149);

var _LocationModal2 = _interopRequireDefault(_LocationModal);

var _Map = __webpack_require__(834);

var _Map2 = _interopRequireDefault(_Map);

var _SearchResultListing = __webpack_require__(835);

var _SearchResultListing2 = _interopRequireDefault(_SearchResultListing);

var _SearchFilterDescriptionText = __webpack_require__(852);

var _SearchFilterDescriptionText2 = _interopRequireDefault(_SearchFilterDescriptionText);

var _CarouselOnMap = __webpack_require__(853);

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
    query: (0, _get2.default)(state, 'searchResults.query', []),
    isFetching: (0, _get2.default)(state, 'searchResults.isFetching', []),
    displayedResults: (0, _get2.default)(state, 'searchResults.displayedResults', []),
    searchQueryParams: allQueryParams[_lib.Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX],
    propertiesModalOpen: (0, _get2.default)(state, 'propertiesModal.open'),
    propertiesModalResultCountButtonLoading: (0, _get2.default)(state, 'propertiesModal.resultCountButtonLoading'),
    propertiesModalResultCount: (0, _get2.default)(state, 'propertiesModal.resultCount'),
    propertyTypeOptions: (0, _get2.default)(state, 'propertyTypeOptions.options'),
    results: (0, _get2.default)(state, 'searchResults.searchResults', []),
    resultsTotal: (0, _get2.default)(state, 'searchResults.totalProps', 0),
    saleTypesPanelOpen: (0, _get2.default)(state, 'headerSearch.saleTypesPanelOpen', false)
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
        dispatch((0, _index.updatePropertiesModalResultCount)((0, _get2.default)(response, 'hits.total', null)));
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
        dispatch((0, _index.receiveSearchResultsPosts)(query, (0, _get2.default)(response, 'hits.hits', []), (0, _get2.default)(response, 'hits.total', 0), append));
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
        dispatch((0, _index.receiveSearchResultsPosts)(query, (0, _get2.default)(response, 'hits.hits', []), (0, _get2.default)(response, 'hits.total', 0), false));
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
      if (!(0, _isEqual2.default)(nextProps.searchQueryParams, this.props.searchQueryParams)) {
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
          searchFilters: (0, _omit2.default)(searchFilters, ['geoCoordinates']),
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

/***/ 719:
/***/ (function(module, exports, __webpack_require__) {

var assignValue = __webpack_require__(262),
    baseAssignValue = __webpack_require__(263);

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

module.exports = copyObject;


/***/ }),

/***/ 723:
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

/***/ 724:
/***/ (function(module, exports, __webpack_require__) {

var Uint8Array = __webpack_require__(267);

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;


/***/ }),

/***/ 726:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(22);

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(45)(module)))

/***/ }),

/***/ 727:
/***/ (function(module, exports, __webpack_require__) {

var cloneArrayBuffer = __webpack_require__(724);

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;


/***/ }),

/***/ 728:
/***/ (function(module, exports) {

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;


/***/ }),

/***/ 729:
/***/ (function(module, exports, __webpack_require__) {

var baseCreate = __webpack_require__(730),
    getPrototype = __webpack_require__(261),
    isPrototype = __webpack_require__(84);

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;


/***/ }),

/***/ 730:
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(32);

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

module.exports = baseCreate;


/***/ }),

/***/ 731:
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(34),
    getPrototype = __webpack_require__(261),
    isObjectLike = __webpack_require__(28);

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

module.exports = isPlainObject;


/***/ }),

/***/ 743:
/***/ (function(module, exports) {

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

module.exports = arrayReduce;


/***/ }),

/***/ 744:
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

/***/ 814:
/***/ (function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__(90),
    baseClone = __webpack_require__(815),
    baseUnset = __webpack_require__(829),
    castPath = __webpack_require__(60),
    copyObject = __webpack_require__(719),
    customOmitClone = __webpack_require__(831),
    flatRest = __webpack_require__(832),
    getAllKeysIn = __webpack_require__(268);

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/**
 * The opposite of `_.pick`; this method creates an object composed of the
 * own and inherited enumerable property paths of `object` that are not omitted.
 *
 * **Note:** This method is considerably slower than `_.pick`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to omit.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.omit(object, ['a', 'c']);
 * // => { 'b': '2' }
 */
var omit = flatRest(function(object, paths) {
  var result = {};
  if (object == null) {
    return result;
  }
  var isDeep = false;
  paths = arrayMap(paths, function(path) {
    path = castPath(path, object);
    isDeep || (isDeep = path.length > 1);
    return path;
  });
  copyObject(object, getAllKeysIn(object), result);
  if (isDeep) {
    result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
  }
  var length = paths.length;
  while (length--) {
    baseUnset(result, paths[length]);
  }
  return result;
});

module.exports = omit;


/***/ }),

/***/ 815:
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(144),
    arrayEach = __webpack_require__(283),
    assignValue = __webpack_require__(262),
    baseAssign = __webpack_require__(816),
    baseAssignIn = __webpack_require__(817),
    cloneBuffer = __webpack_require__(726),
    copyArray = __webpack_require__(728),
    copySymbols = __webpack_require__(818),
    copySymbolsIn = __webpack_require__(819),
    getAllKeys = __webpack_require__(281),
    getAllKeysIn = __webpack_require__(268),
    getTag = __webpack_require__(147),
    initCloneArray = __webpack_require__(820),
    initCloneByTag = __webpack_require__(821),
    initCloneObject = __webpack_require__(729),
    isArray = __webpack_require__(19),
    isBuffer = __webpack_require__(85),
    isObject = __webpack_require__(32),
    keys = __webpack_require__(87);

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
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

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys);

  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

module.exports = baseClone;


/***/ }),

/***/ 816:
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(719),
    keys = __webpack_require__(87);

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

module.exports = baseAssign;


/***/ }),

/***/ 817:
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(719),
    keysIn = __webpack_require__(264);

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn(source), object);
}

module.exports = baseAssignIn;


/***/ }),

/***/ 818:
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(719),
    getSymbols = __webpack_require__(148);

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

module.exports = copySymbols;


/***/ }),

/***/ 819:
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(719),
    getSymbolsIn = __webpack_require__(282);

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}

module.exports = copySymbolsIn;


/***/ }),

/***/ 820:
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;


/***/ }),

/***/ 821:
/***/ (function(module, exports, __webpack_require__) {

var cloneArrayBuffer = __webpack_require__(724),
    cloneDataView = __webpack_require__(822),
    cloneMap = __webpack_require__(823),
    cloneRegExp = __webpack_require__(825),
    cloneSet = __webpack_require__(826),
    cloneSymbol = __webpack_require__(828),
    cloneTypedArray = __webpack_require__(727);

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

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

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return cloneMap(object, isDeep, cloneFunc);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return cloneSet(object, isDeep, cloneFunc);

    case symbolTag:
      return cloneSymbol(object);
  }
}

module.exports = initCloneByTag;


/***/ }),

/***/ 822:
/***/ (function(module, exports, __webpack_require__) {

var cloneArrayBuffer = __webpack_require__(724);

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

module.exports = cloneDataView;


/***/ }),

/***/ 823:
/***/ (function(module, exports, __webpack_require__) {

var addMapEntry = __webpack_require__(824),
    arrayReduce = __webpack_require__(743),
    mapToArray = __webpack_require__(279);

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1;

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), CLONE_DEEP_FLAG) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor);
}

module.exports = cloneMap;


/***/ }),

/***/ 824:
/***/ (function(module, exports) {

/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `map.set` because it's not chainable in IE 11.
  map.set(pair[0], pair[1]);
  return map;
}

module.exports = addMapEntry;


/***/ }),

/***/ 825:
/***/ (function(module, exports) {

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

module.exports = cloneRegExp;


/***/ }),

/***/ 826:
/***/ (function(module, exports, __webpack_require__) {

var addSetEntry = __webpack_require__(827),
    arrayReduce = __webpack_require__(743),
    setToArray = __webpack_require__(280);

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1;

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), CLONE_DEEP_FLAG) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor);
}

module.exports = cloneSet;


/***/ }),

/***/ 827:
/***/ (function(module, exports) {

/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  // Don't return `set.add` because it's not chainable in IE 11.
  set.add(value);
  return set;
}

module.exports = addSetEntry;


/***/ }),

/***/ 828:
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(47);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

module.exports = cloneSymbol;


/***/ }),

/***/ 829:
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(60),
    last = __webpack_require__(271),
    parent = __webpack_require__(830),
    toKey = __webpack_require__(48);

/**
 * The base implementation of `_.unset`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The property path to unset.
 * @returns {boolean} Returns `true` if the property is deleted, else `false`.
 */
function baseUnset(object, path) {
  path = castPath(path, object);
  object = parent(object, path);
  return object == null || delete object[toKey(last(path))];
}

module.exports = baseUnset;


/***/ }),

/***/ 830:
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(89),
    baseSlice = __webpack_require__(272);

/**
 * Gets the parent value at `path` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path to get the parent value of.
 * @returns {*} Returns the parent value.
 */
function parent(object, path) {
  return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
}

module.exports = parent;


/***/ }),

/***/ 831:
/***/ (function(module, exports, __webpack_require__) {

var isPlainObject = __webpack_require__(731);

/**
 * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
 * objects.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {string} key The key of the property to inspect.
 * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
 */
function customOmitClone(value) {
  return isPlainObject(value) ? undefined : value;
}

module.exports = customOmitClone;


/***/ }),

/***/ 832:
/***/ (function(module, exports, __webpack_require__) {

var flatten = __webpack_require__(833),
    overRest = __webpack_require__(276),
    setToString = __webpack_require__(277);

/**
 * A specialized version of `baseRest` which flattens the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @returns {Function} Returns the new function.
 */
function flatRest(func) {
  return setToString(overRest(func, undefined, flatten), func + '');
}

module.exports = flatRest;


/***/ }),

/***/ 833:
/***/ (function(module, exports, __webpack_require__) {

var baseFlatten = __webpack_require__(274);

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}

module.exports = flatten;


/***/ }),

/***/ 834:
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

var _isEqual = __webpack_require__(86);

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

/***/ 835:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _PropertyCardList = __webpack_require__(836);

var _PropertyCardList2 = _interopRequireDefault(_PropertyCardList);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactWaypoint = __webpack_require__(837);

var _reactWaypoint2 = _interopRequireDefault(_reactWaypoint);

var _difference = __webpack_require__(266);

var _difference2 = _interopRequireDefault(_difference);

var _LoadingCircle = __webpack_require__(723);

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
      var update = nextProps.allowPagination !== this.props.allowPagination || nextProps.isFetching !== this.props.isFetching || (0, _difference2.default)(nextProps.properties, this.props.properties).length || nextProps.selectedProperty !== this.props.selectedProperty || nextProps.total !== this.props.total;
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

/***/ 836:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _difference = __webpack_require__(266);

var _difference2 = _interopRequireDefault(_difference);

var _get = __webpack_require__(3);

var _get2 = _interopRequireDefault(_get);

var _PropertyCard = __webpack_require__(269);

var _PropertyCard2 = _interopRequireDefault(_PropertyCard);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(33);

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
      return (0, _difference2.default)(nextProps.properties, this.props.properties).length || nextProps.selectedProperty !== this.props.selectedProperty;
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
            address: (0, _get2.default)(p, '_source.post_meta.rets_address', [''])[0],
            address_unit: (0, _get2.default)(p, '_source.post_meta.address_unit', '')[0],
            location: (0, _get2.default)(p, '_source.post_meta.wpp_location_pin', []),
            baths: (0, _get2.default)(p, '_source.post_meta.rets_total_baths', 0),
            beds: (0, _get2.default)(p, '_source.post_meta.rets_beds', 0),
            city: (0, _get2.default)(p, '_source.tax_input.wpp_location.wpp_location_city[0].name', ''),
            gallery_images: (0, _get2.default)(p, '_source.wpp_media', []).map(function (media) {
              return media.url;
            }),
            id: p._id,
            living_area: (0, _get2.default)(p, '_source.post_meta.rets_living_area', 0),
            lots_size: (0, _get2.default)(p, '_source.post_meta.rets_lot_size_area', 0),
            price: (0, _get2.default)(p, '_source.post_meta.rets_list_price[0]', 0),
            post_name: (0, _get2.default)(p, '_source.post_name', 0),
            state: (0, _get2.default)(p, '_source.tax_input.wpp_location.wpp_location_state[0].name', ''),
            type: (0, _get2.default)(p, '_source.tax_input.wpp_listing_type.listing_type[0].slug', ''),
            sqft: (0, _get2.default)(p, '_source.post_meta.sqft[0]', ''),
            sub_type: (0, _get2.default)(p, '_source.tax_input.wpp_listing_type.listing_sub_type[0].name', ''),
            relative_permalink: (0, _get2.default)(p, '_source.permalink', ''),
            thumbnail: (0, _get2.default)(p, '_source.post_meta.rets_thumbnail_url', [''])[0],
            zip: (0, _get2.default)(p, '_source.post_meta.rets_postal_code[0]', '')
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

/***/ 837:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _consolidatedEvents = __webpack_require__(838);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _computeOffsetPixels = __webpack_require__(844);

var _computeOffsetPixels2 = _interopRequireDefault(_computeOffsetPixels);

var _constants = __webpack_require__(744);

var _constants2 = _interopRequireDefault(_constants);

var _debugLog = __webpack_require__(847);

var _debugLog2 = _interopRequireDefault(_debugLog);

var _ensureChildrenIsSingleDOMElement = __webpack_require__(848);

var _ensureChildrenIsSingleDOMElement2 = _interopRequireDefault(_ensureChildrenIsSingleDOMElement);

var _getCurrentPosition = __webpack_require__(850);

var _getCurrentPosition2 = _interopRequireDefault(_getCurrentPosition);

var _resolveScrollableAncestorProp = __webpack_require__(851);

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

/***/ 838:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EVENT_HANDLERS_KEY = undefined;
exports.addEventListener = addEventListener;
exports.removeEventListener = removeEventListener;

var _normalizeEventOptions = __webpack_require__(839);

var _normalizeEventOptions2 = _interopRequireDefault(_normalizeEventOptions);

var _TargetEventHandlers = __webpack_require__(842);

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

/***/ 839:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = normalizeEventOptions;

var _canUsePassiveEventListeners = __webpack_require__(840);

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

/***/ 840:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = canUsePassiveEventListeners;

var _canUseDOM = __webpack_require__(841);

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

/***/ 841:
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
var CAN_USE_DOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

exports['default'] = CAN_USE_DOM;

/***/ }),

/***/ 842:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventOptionsKey = __webpack_require__(843);

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

/***/ 843:
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

/***/ 844:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = computeOffsetPixels;

var _parseOffsetAsPercentage = __webpack_require__(845);

var _parseOffsetAsPercentage2 = _interopRequireDefault(_parseOffsetAsPercentage);

var _parseOffsetAsPixels = __webpack_require__(846);

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

/***/ 845:
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

/***/ 846:
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

/***/ 847:
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

/***/ 848:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ensureChildrenIsSingleDOMElement;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _isDOMElement = __webpack_require__(849);

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

/***/ 849:
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

/***/ 850:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getCurrentPosition;

var _constants = __webpack_require__(744);

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

/***/ 851:
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16)))

/***/ }),

/***/ 852:
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

/***/ 853:
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

var _reactIdSwiper = __webpack_require__(145);

var _reactIdSwiper2 = _interopRequireDefault(_reactIdSwiper);

var _get = __webpack_require__(3);

var _get2 = _interopRequireDefault(_get);

var _lib = __webpack_require__(1);

var _PropertyCard = __webpack_require__(269);

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
              address: (0, _get2.default)(p, '_source.post_meta.rets_address', [''])[0],
              address_unit: (0, _get2.default)(p, '_source.post_meta.address_unit', ''),
              location: (0, _get2.default)(p, '_source.post_meta.wpp_location_pin', []),
              baths: (0, _get2.default)(p, '_source.post_meta.rets_total_baths', 0),
              beds: (0, _get2.default)(p, '_source.post_meta.rets_beds', 0),
              city: (0, _get2.default)(p, '_source.tax_input.wpp_location.wpp_location_city[0].name', ''),
              gallery_images: (0, _get2.default)(p, '_source.wpp_media', []).map(function (media) {
                return media.url;
              }),
              id: p._id,
              living_area: (0, _get2.default)(p, '_source.post_meta.rets_living_area', 0),
              lots_size: (0, _get2.default)(p, '_source.post_meta.rets_lot_size_area', 0),
              price: (0, _get2.default)(p, '_source.post_meta.rets_list_price[0]', 0),
              post_name: (0, _get2.default)(p, '_source.post_name', 0),
              state: (0, _get2.default)(p, '_source.tax_input.wpp_location.wpp_location_state[0].name', ''),
              type: (0, _get2.default)(p, '_source.tax_input.wpp_listing_type.listing_type[0].slug', ''),
              sub_type: (0, _get2.default)(p, '_source.tax_input.wpp_listing_type.listing_sub_type[0].name', ''),
              relative_permalink: (0, _get2.default)(p, '_source.permalink', ''),
              thumbnail: (0, _get2.default)(p, '_source.post_meta.rets_thumbnail_url', [''])[0],
              zip: (0, _get2.default)(p, '_source.post_meta.rets_postal_code[0]', '')
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