webpackJsonp([3],{1013:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),u=n(1),s=o(u),c=n(2),f=o(c),p=n(42),d=n(4),b=o(d),E=n(1112),y=o(E),_=n(408),h=(o(_),n(160)),m=o(h),g=n(156),v=o(g),P=n(409),S=o(P),w=n(1303),O=o(w),L=n(51),j=n(3),M=function(e){return{posts:(0,b.default)(e,"blogPostsState.posts",[]),allowPagination:(0,b.default)(e,"blogPostsState.allowPagination",!1)}},T=function(e,t){return{getPosts:function(t,n,o,r){jQuery.ajax({url:(0,b.default)(bundle,"admin_ajax_url",""),type:"get",data:{action:j.Lib.AJAX_GET_POSTS_ACTION,from:t,category_id:n},dataType:"json",success:function(n){if((0,b.default)(n,"posts",null)){var a=(0,b.default)(n,"posts",[]);t&&o&&(a=o.concat(a)),void 0!==r&&r(),e((0,L.setBlogPosts)(a,(0,b.default)(n,"allowPagination",!1)))}},error:function(e,t,n){console.log(t,n)}})}}},C=function(e){function t(e){r(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={loading:!0},n}return l(t,e),i(t,[{key:"componentDidMount",value:function(){var e=this,t=(0,b.default)(this.props.post,"blog_content",{});this.props.getPosts(0,(0,b.default)(t,"category_id",0),this.props.posts,function(){e.setState({loading:!1})})}},{key:"render",value:function(){var e=this.props,t=e.history,n=e.openUserPanel,o=e.openLoginModal,r=(0,b.default)(this.props.post,"blog_content",{});return s.default.createElement("div",null,s.default.createElement("section",{className:j.Lib.THEME_CLASSES_PREFIX+"toolbar "+j.Lib.THEME_CLASSES_PREFIX+"header-default"},s.default.createElement(m.default,{historyPush:t.push,openUserPanel:n,openLoginModal:o})),s.default.createElement(v.default,{widget_cell:(0,b.default)(r,"masthead")}),s.default.createElement(S.default,{widget_cell:(0,b.default)(r,"subnavigation"),currentUrl:(0,b.default)(this.props.post,"post_url","")}),this.state.loading?s.default.createElement("div",{className:j.Lib.THEME_CLASSES_PREFIX+"blog-posts d-flex justify-content-center align-items-center"},s.default.createElement(y.default,null)):s.default.createElement(O.default,{posts:this.props.posts,allowPagination:this.props.allowPagination,loadMoreHandler:this.props.getPosts,categoryId:(0,b.default)(r,"category_id")}))}}]),t}(u.Component);C.propTypes={post:f.default.object.isRequired};var R=(0,p.connect)(M,T)(C);t.default=R},1112:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),u=n(2),s=o(u),c=n(1),f=o(c),p=n(3),d=function(e){function t(){return r(this,t),a(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return l(t,e),i(t,[{key:"render",value:function(){var e=this.props,t=e.containerHeight,n=e.verticallyCentered;return f.default.createElement("div",{className:n?p.Lib.THEME_CLASSES_PREFIX+"spinner-container":null,style:{height:t}},f.default.createElement("div",{className:p.Lib.THEME_CLASSES_PREFIX+"spinner-circle my-auto text-center"},f.default.createElement("div",{className:p.Lib.THEME_CLASSES_PREFIX+"double-bounce1 rounded-circle"}),f.default.createElement("div",{className:p.Lib.THEME_CLASSES_PREFIX+"double-bounce2 rounded-circle"})))}}]),t}(c.Component);d.propTypes={verticallyCentered:s.default.bool,containerHeight:s.default.string},t.default=d},1303:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),u=n(1),s=o(u),c=n(2),f=o(c),p=n(4),d=o(p),b=n(19),E=o(b),y=n(1112),_=o(y),h=n(410),m=o(h),g=n(3),v=function(e){function t(e){r(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.handleLoadMore=function(e){e.preventDefault(),n.setState({loading:!0}),n.props.loadMoreHandler(n.props.posts.length,n.props.categoryId,n.props.posts)},n.state={loading:!1},n}return l(t,e),i(t,[{key:"componentWillReceiveProps",value:function(e){(e.posts!==this.props.posts||(0,E.default)(e.posts))&&this.setState({loading:!1})}},{key:"render",value:function(){var e=(0,d.default)(this.props,"posts",[]);return s.default.createElement("section",{className:g.Lib.THEME_CLASSES_PREFIX+"blog-posts"},s.default.createElement("div",{className:"container"},s.default.createElement("div",{className:g.Lib.THEME_CLASSES_PREFIX+"posts-wrapper row"},e.map(function(e){return s.default.createElement(m.default,{data:e,key:e.ID})})),this.props.allowPagination&&s.default.createElement("div",{className:"row"},s.default.createElement("div",{className:g.Lib.THEME_CLASSES_PREFIX+"load-more col-12 col-md-4 mx-auto"},this.state.loading?s.default.createElement(_.default,null):s.default.createElement("a",{href:"#",onClick:this.handleLoadMore,className:"btn btn-primary "+g.Lib.THEME_CLASSES_PREFIX+"load-more-link"},"Load More")))))}}]),t}(u.Component);v.propTypes={loadMoreHandler:f.default.func.isRequired,categoryId:f.default.number.isRequired},t.default=v}});