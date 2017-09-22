webpackJsonp([3],{

/***/ 548:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(11);

var _Masthead = __webpack_require__(65);

var _Masthead2 = _interopRequireDefault(_Masthead);

var _Subnavigation = __webpack_require__(209);

var _Subnavigation2 = _interopRequireDefault(_Subnavigation);

var _Posts = __webpack_require__(589);

var _Posts2 = _interopRequireDefault(_Posts);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _index = __webpack_require__(13);

var _lib = __webpack_require__(1);

var _lodash = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var mapStateToProps = function mapStateToProps(state) {
  return {};
};

var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
  return {
    getPosts: function getPosts(from, categoryId) {

      jQuery.ajax({
        url: (0, _lodash.get)(bundle, 'admin_ajax_url', ''),
        type: 'get',
        data: {
          action: _lib.Lib.AJAX_GET_POSTS_ACTION,
          from: from,
          category_id: categoryId
        },
        dataType: 'json',
        success: function success(data) {
          if ((0, _lodash.get)(data, 'posts', null)) dispatch((0, _index.setBlogPosts)((0, _lodash.get)(data, 'posts', []), (0, _lodash.get)(data, 'allowPagination', false)));
        },
        error: function error(jqXHR, textStatus, errorThrown) {
          console.log(textStatus, errorThrown);
        }
      });
    }
  };
};

var ArchiveContent = function (_Component) {
  _inherits(ArchiveContent, _Component);

  function ArchiveContent() {
    _classCallCheck(this, ArchiveContent);

    return _possibleConstructorReturn(this, (ArchiveContent.__proto__ || Object.getPrototypeOf(ArchiveContent)).apply(this, arguments));
  }

  _createClass(ArchiveContent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var content = (0, _lodash.get)(this.props.post, 'blog_content', {});

      // Initial get posts
      this.props.getPosts(0, (0, _lodash.get)(content, 'category_id', 0));
    }
  }, {
    key: 'render',
    value: function render() {

      var content = (0, _lodash.get)(this.props.post, 'blog_content', {});

      return _react2.default.createElement(
        'div',
        { className: 'container-fluid' },
        _react2.default.createElement(
          'div',
          { className: 'row' },
          _react2.default.createElement(_Masthead2.default, { widget_cell: (0, _lodash.get)(content, 'masthead') }),
          _react2.default.createElement(_Subnavigation2.default, { widget_cell: (0, _lodash.get)(content, 'subnavigation'),
            currentUrl: (0, _lodash.get)(this.props.post, 'post_url', '') }),
          _react2.default.createElement(_Posts2.default, { seeMoreHandler: this.props.getPosts, categoryId: (0, _lodash.get)(content, 'category_id') })
        )
      );
    }
  }]);

  return ArchiveContent;
}(_react.Component);

ArchiveContent.propTypes = {
  post: _propTypes2.default.object.isRequired
};


var Archive = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ArchiveContent);

exports.default = Archive;

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

/***/ 589:
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

var _LoadingCircle = __webpack_require__(557);

var _LoadingCircle2 = _interopRequireDefault(_LoadingCircle);

var _PostCard = __webpack_require__(210);

var _PostCard2 = _interopRequireDefault(_PostCard);

var _lib = __webpack_require__(1);

var _lodash = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var mapStateToProps = function mapStateToProps(state) {
  return {
    posts: (0, _lodash.get)(state, 'blogPostsState.posts', []),
    allowPagination: (0, _lodash.get)(state, 'blogPostsState.allowPagination', false)
  };
};

var Posts = function (_Component) {
  _inherits(Posts, _Component);

  function Posts(props) {
    _classCallCheck(this, Posts);

    var _this = _possibleConstructorReturn(this, (Posts.__proto__ || Object.getPrototypeOf(Posts)).call(this, props));

    _this.state = { loading: false };
    return _this;
  }

  _createClass(Posts, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.posts !== this.props.posts || (0, _lodash.isEmpty)(nextProps.posts)) {
        this.setState({ loading: false });
      }
    }
  }, {
    key: 'seeMore',
    value: function seeMore(e, categoryId) {
      e.preventDefault();

      this.setState({ loading: true });
      this.props.seeMoreHandler(this.props.posts.length, categoryId);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var self = this;

      var posts = (0, _lodash.get)(this.props, 'posts', []);
      var groups = [];

      if (posts) {
        var postsGroup = [];
        posts.map(function (post) {
          postsGroup.push(post);

          if (postsGroup.length === _lib.Lib.BLOG_POSTS_PER_ROW) {
            groups.push(postsGroup);
            postsGroup = [];
          }
        });
      }

      return _react2.default.createElement(
        'section',
        { className: _lib.Lib.THEME_CLASSES_PREFIX + "blog-posts" },
        _react2.default.createElement(
          'div',
          { className: 'container' },
          _react2.default.createElement(
            'div',
            { className: 'row' },
            !this.state.loading || groups ? groups.map(function (g, group_index) {

              var groupPosts = g.map(function (p, i) {
                return _react2.default.createElement(_PostCard2.default, { data: {
                    title: (0, _lodash.get)(p, 'title', ''),
                    excerpt: (0, _lodash.get)(p, 'excerpt', ''),
                    image_src: (0, _lodash.get)(p, 'image_src', ''),
                    image_title: (0, _lodash.get)(p, 'image_title', ''),
                    image_alt: (0, _lodash.get)(p, 'image_alt', ''),
                    url: (0, _lodash.get)(p, 'url', ''),
                    relative_url: (0, _lodash.get)(p, 'relative_url', '')

                  }, key: i });
              });

              return _react2.default.createElement(
                'div',
                { className: 'card-deck ' + _lib.Lib.THEME_CLASSES_PREFIX + 'blog-posts-row',
                  key: group_index },
                groupPosts
              );
            }) : _react2.default.createElement(_LoadingCircle2.default, null)
          ),
          this.props.allowPagination ? _react2.default.createElement(
            'div',
            { className: 'row' },
            _react2.default.createElement(
              'div',
              { className: _lib.Lib.THEME_CLASSES_PREFIX + 'load-more mx-auto' },
              this.state.loading ? _react2.default.createElement(_LoadingCircle2.default, null) : _react2.default.createElement(
                'a',
                { href: '#', onClick: function onClick(e) {
                    return self.seeMore.bind(_this2)(e, _this2.props.categoryId);
                  },
                  className: 'btn btn-primary ' + _lib.Lib.THEME_CLASSES_PREFIX + 'load-more-link' },
                'Load More'
              )
            )
          ) : null
        )
      );
    }
  }]);

  return Posts;
}(_react.Component);

Posts.propTypes = {
  seeMoreHandler: _propTypes2.default.func.isRequired,
  categoryId: _propTypes2.default.number.isRequired
};
exports.default = (0, _reactRedux.connect)(mapStateToProps)(Posts);

/***/ })

});