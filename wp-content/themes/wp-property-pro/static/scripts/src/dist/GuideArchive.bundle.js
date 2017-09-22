webpackJsonp([2],{

/***/ 549:
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

var _reactRouter = __webpack_require__(20);

var _Masthead = __webpack_require__(65);

var _Masthead2 = _interopRequireDefault(_Masthead);

var _CategoryCard = __webpack_require__(590);

var _CategoryCard2 = _interopRequireDefault(_CategoryCard);

var _ArticleCard = __webpack_require__(591);

var _ArticleCard2 = _interopRequireDefault(_ArticleCard);

var _HeaderGuide = __webpack_require__(211);

var _HeaderGuide2 = _interopRequireDefault(_HeaderGuide);

var _lib = __webpack_require__(1);

var _lodash = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Archive = function (_Component) {
  _inherits(Archive, _Component);

  function Archive() {
    _classCallCheck(this, Archive);

    return _possibleConstructorReturn(this, (Archive.__proto__ || Object.getPrototypeOf(Archive)).apply(this, arguments));
  }

  _createClass(Archive, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var content = (0, _lodash.get)(this.props.post, 'guide_content', {});

      var cards = (0, _lodash.get)(content, 'items', []).map(function (item, i) {
        var last = (0, _lodash.get)(content, 'items', []).length === i + 1;
        return _react2.default.createElement(
          'li',
          { className: 'list-group-item ' + _lib.Lib.THEME_CLASSES_PREFIX + 'guide-list-item border-0', key: i },
          (0, _lodash.get)(item, 'children', null) ? _react2.default.createElement(_CategoryCard2.default, { category: item, historyPush: _this2.props.history.push, last: last }) : _react2.default.createElement(_ArticleCard2.default, { article: item, historyPush: _this2.props.history.push, last: last })
        );
      });
      return _react2.default.createElement(
        'div',
        { className: 'container-fluid ' + _lib.Lib.THEME_CLASSES_PREFIX + 'guide-container' },
        _react2.default.createElement(
          'div',
          { className: 'row no-gutters' },
          _react2.default.createElement(
            'div',
            { className: 'col-xl-6' },
            _react2.default.createElement(
              'div',
              { className: 'container-fluid' },
              _react2.default.createElement(
                'div',
                { className: 'row' },
                _react2.default.createElement(_HeaderGuide2.default, { historyPush: this.props.history.push }),
                _react2.default.createElement(_Masthead2.default, { widget_cell: (0, _lodash.get)(content, 'masthead') })
              )
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'col-xl-6' },
            _react2.default.createElement(
              'div',
              { className: 'container-fluid' },
              _react2.default.createElement(
                'div',
                { className: 'row' },
                _react2.default.createElement(
                  'div',
                  { className: _lib.Lib.THEME_CLASSES_PREFIX + 'guide-content' },
                  _react2.default.createElement(
                    'ul',
                    { className: 'list-group ' + _lib.Lib.THEME_CLASSES_PREFIX + 'guide-list' },
                    cards
                  )
                )
              )
            )
          )
        )
      );
    }
  }]);

  return Archive;
}(_react.Component);

Archive.propTypes = {
  history: _propTypes2.default.object.isRequired,
  location: _propTypes2.default.object.isRequired,
  match: _propTypes2.default.object.isRequired,
  post: _propTypes2.default.object
};
exports.default = (0, _reactRouter.withRouter)(Archive);

/***/ }),

/***/ 590:
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

var _lodash = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CategoryCard = function (_Component) {
  _inherits(CategoryCard, _Component);

  function CategoryCard() {
    _classCallCheck(this, CategoryCard);

    return _possibleConstructorReturn(this, (CategoryCard.__proto__ || Object.getPrototypeOf(CategoryCard)).apply(this, arguments));
  }

  _createClass(CategoryCard, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var sectionClasses = _lib.Lib.THEME_CLASSES_PREFIX + 'category-card ' + _lib.Lib.THEME_CLASSES_PREFIX + 'guide-item';

      if (this.props.last) {
        sectionClasses += ' ' + _lib.Lib.THEME_CLASSES_PREFIX + 'last';
      }

      return _react2.default.createElement(
        'section',
        { className: sectionClasses },
        _react2.default.createElement(
          'div',
          { className: 'container-fluid p-0' },
          _react2.default.createElement(
            'div',
            { className: 'row no-gutters' },
            _react2.default.createElement(
              'div',
              { className: 'col-sm-8' },
              _react2.default.createElement(
                'div',
                { className: _lib.Lib.THEME_CLASSES_PREFIX + "category-card-content" },
                _react2.default.createElement(
                  'header',
                  { className: _lib.Lib.THEME_CLASSES_PREFIX + "category-header" },
                  (0, _lodash.get)(this.props.category, 'title', null) ? _react2.default.createElement(
                    'h2',
                    { className: _lib.Lib.THEME_CLASSES_PREFIX + "category-title" },
                    _react2.default.createElement(
                      'a',
                      {
                        href: (0, _lodash.get)(this.props.category, 'url', ''), onClick: function onClick(eve) {
                          eve.preventDefault();
                          historyPush((0, _lodash.get)(_this2.props.category, 'relative_url', ''));
                        } },
                      (0, _lodash.get)(this.props.category, 'title')
                    )
                  ) : null
                ),
                (0, _lodash.get)(this.props.category, 'children', null) ? _react2.default.createElement(
                  'nav',
                  { className: _lib.Lib.THEME_CLASSES_PREFIX + "category-navigation" },
                  _react2.default.createElement(
                    'ul',
                    { className: 'list-group' },
                    (0, _lodash.get)(this.props.category, 'children', []).map(function (item, key) {
                      return (0, _lodash.get)(item, 'title', null) && (0, _lodash.get)(item, 'relative_url', null) ? _react2.default.createElement(
                        'li',
                        { className: 'list-group-item ' + _lib.Lib.THEME_CLASSES_PREFIX + 'category-navigation-item border-0 p-0', key: key },
                        _react2.default.createElement(
                          'a',
                          { href: (0, _lodash.get)(item, 'relative_url'), onClick: function onClick(eve) {
                              eve.preventDefault();
                              historyPush((0, _lodash.get)(item, 'relative_url'));
                            } },
                          (0, _lodash.get)(item, 'title')
                        )
                      ) : null;
                    })
                  )
                ) : null
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'col-sm-4' },
              (0, _lodash.get)(this.props.category, 'image_src', null) ? _react2.default.createElement('div', { style: {
                  background: "url(" + (0, _lodash.get)(this.props.category, 'image_src') + ") 50% 50% no-repeat"
                }, className: _lib.Lib.THEME_CLASSES_PREFIX + "guide-item-img" }) : null
            )
          )
        )
      );
    }
  }]);

  return CategoryCard;
}(_react.Component);

CategoryCard.propTypes = {
  category: _propTypes2.default.object,
  historyPush: _propTypes2.default.func.isRequired,
  last: _propTypes2.default.bool
};
exports.default = CategoryCard;

/***/ }),

/***/ 591:
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

var _lodash = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ArticleCard = function (_Component) {
  _inherits(ArticleCard, _Component);

  function ArticleCard() {
    _classCallCheck(this, ArticleCard);

    return _possibleConstructorReturn(this, (ArticleCard.__proto__ || Object.getPrototypeOf(ArticleCard)).apply(this, arguments));
  }

  _createClass(ArticleCard, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var sectionClasses = _lib.Lib.THEME_CLASSES_PREFIX + 'article-card ' + _lib.Lib.THEME_CLASSES_PREFIX + 'guide-item';

      if (this.props.last) {
        sectionClasses += ' ' + _lib.Lib.THEME_CLASSES_PREFIX + 'last';
      }

      return _react2.default.createElement(
        'section',
        { className: sectionClasses },
        _react2.default.createElement(
          'div',
          { className: 'container-fluid p-0' },
          _react2.default.createElement(
            'div',
            { className: 'row no-gutters' },
            _react2.default.createElement(
              'div',
              { className: 'col-sm-8' },
              _react2.default.createElement(
                'div',
                { className: _lib.Lib.THEME_CLASSES_PREFIX + "article-card-content" },
                _react2.default.createElement(
                  'header',
                  { className: _lib.Lib.THEME_CLASSES_PREFIX + "article-header" },
                  (0, _lodash.get)(this.props.article, 'title', null) ? _react2.default.createElement(
                    'h2',
                    { className: _lib.Lib.THEME_CLASSES_PREFIX + "article-title" },
                    _react2.default.createElement(
                      'a',
                      {
                        href: (0, _lodash.get)(this.props.article, 'url', ''), onClick: function onClick(eve) {
                          eve.preventDefault();
                          historyPush((0, _lodash.get)(_this2.props.article, 'relative_url', ''));
                        } },
                      (0, _lodash.get)(this.props.article, 'title')
                    )
                  ) : null,
                  (0, _lodash.get)(this.props.article, 'excerpt', null) ? _react2.default.createElement(
                    'p',
                    {
                      className: _lib.Lib.THEME_CLASSES_PREFIX + "article-excerpt" },
                    (0, _lodash.get)(this.props.article, 'excerpt')
                  ) : null
                )
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'col-sm-4' },
              (0, _lodash.get)(this.props.article, 'image_src', null) ? _react2.default.createElement('div', { style: {
                  background: "url(" + (0, _lodash.get)(this.props.article, 'image_src') + ") 50% 50% no-repeat"
                }, className: _lib.Lib.THEME_CLASSES_PREFIX + "guide-item-img" }) : null
            )
          )
        )
      );
    }
  }]);

  return ArticleCard;
}(_react.Component);

ArticleCard.propTypes = {
  article: _propTypes2.default.object,
  historyPush: _propTypes2.default.func.isRequired,
  last: _propTypes2.default.bool
};
exports.default = ArticleCard;

/***/ })

});