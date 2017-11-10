webpackJsonp([3],{1086:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),u=n(2),s=o(u),c=n(1),f=o(c),p=n(3),d=function(e){function t(){return r(this,t),a(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return l(t,e),i(t,[{key:"render",value:function(){var e=this.props,t=e.containerHeight,n=e.verticallyCentered;return f.default.createElement("div",{className:n?p.Lib.THEME_CLASSES_PREFIX+"spinner-container":null,style:{height:t}},f.default.createElement("div",{className:p.Lib.THEME_CLASSES_PREFIX+"spinner-circle my-auto text-center"},f.default.createElement("div",{className:p.Lib.THEME_CLASSES_PREFIX+"double-bounce1 rounded-circle"}),f.default.createElement("div",{className:p.Lib.THEME_CLASSES_PREFIX+"double-bounce2 rounded-circle"})))}}]),t}(c.Component);d.propTypes={verticallyCentered:s.default.bool,containerHeight:s.default.string},t.default=d},1273:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),u=n(2),s=o(u),c=n(1),f=o(c),p=n(1086),d=o(p),b=n(401),_=o(b),E=n(3),h=n(5),m=o(h),y=n(18),g=o(y),v=function(e){function t(e){r(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={loading:!1},n}return l(t,e),i(t,[{key:"componentWillReceiveProps",value:function(e){(e.posts!==this.props.posts||(0,g.default)(e.posts))&&this.setState({loading:!1})}},{key:"seeMore",value:function(e,t){e.preventDefault(),this.setState({loading:!0}),this.props.seeMoreHandler(this.props.posts.length,t,this.props.posts)}},{key:"render",value:function(){var e=this,t=this,n=(0,m.default)(this.props,"posts",[]),o=[];if(n){var r=[],a=n.length;n.map(function(e,t){r.push(e),r.length!==E.Lib.BLOG_POSTS_PER_ROW&&t+1!==a||(o.push(r),r=[])})}return f.default.createElement("section",{className:E.Lib.THEME_CLASSES_PREFIX+"blog-posts"},f.default.createElement("div",{className:"container"},!this.state.loading||o?o.map(function(e,t){var n=e.map(function(e,t){return f.default.createElement(_.default,{data:{title:(0,m.default)(e,"title",""),excerpt:(0,m.default)(e,"excerpt",""),image_src:(0,m.default)(e,"image_src",""),image_title:(0,m.default)(e,"image_title",""),image_alt:(0,m.default)(e,"image_alt",""),url:(0,m.default)(e,"url",""),relative_url:(0,m.default)(e,"relative_url","")},key:(0,m.default)(e,"title","")})});return f.default.createElement("div",{className:"row "+E.Lib.THEME_CLASSES_PREFIX+"blog-posts-row",key:t},n)}):f.default.createElement(d.default,null),this.props.allowPagination?f.default.createElement("div",{className:"row"},f.default.createElement("div",{className:E.Lib.THEME_CLASSES_PREFIX+"load-more mx-auto"},this.state.loading?f.default.createElement(d.default,null):f.default.createElement("a",{href:"#",onClick:function(n){return t.seeMore.bind(e)(n,e.props.categoryId)},className:"btn btn-primary "+E.Lib.THEME_CLASSES_PREFIX+"load-more-link"},"Load More"))):null))}}]),t}(c.Component);v.propTypes={seeMoreHandler:s.default.func.isRequired,categoryId:s.default.number.isRequired},t.default=v},990:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),u=n(233),s=o(u),c=n(1),f=o(c),p=n(39),d=n(1086),b=o(d),_=n(153),E=o(_),h=n(400),m=o(h),y=n(1273),g=o(y),v=n(2),P=o(v),S=n(49),w=n(3),O=n(5),j=o(O),L=function(e){return{posts:(0,j.default)(e,"blogPostsState.posts",[]),allowPagination:(0,j.default)(e,"blogPostsState.allowPagination",!1)}},M=function(e,t){return{getPosts:function(t,n,o,r){jQuery.ajax({url:(0,j.default)(bundle,"admin_ajax_url",""),type:"get",data:{action:w.Lib.AJAX_GET_POSTS_ACTION,from:t,category_id:n},dataType:"json",success:function(n){if((0,j.default)(n,"posts",null)){var a=(0,j.default)(n,"posts",[]);t&&o&&(a=o.concat(a)),void 0!==r&&r(),e((0,S.setBlogPosts)(a,(0,j.default)(n,"allowPagination",!1)))}},error:function(e,t,n){console.log(t,n)}})}}},T=function(e){function t(e){r(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={loading:!0},n}return l(t,e),i(t,[{key:"componentDidMount",value:function(){var e=(0,j.default)(this.props.post,"blog_content",{}),t=this;this.props.getPosts(0,(0,j.default)(e,"category_id",0),this.props.posts,function(){t.setState({loading:!1})})}},{key:"render",value:function(){var e=this.props,t=e.history,n=e.openUserPanel,o=e.openLoginModal,r=(0,j.default)(this.props.post,"blog_content",{});return f.default.createElement("div",null,f.default.createElement("section",{className:w.Lib.THEME_CLASSES_PREFIX+"toolbar "+w.Lib.THEME_CLASSES_PREFIX+"header-default row no-gutters"},f.default.createElement(s.default,{historyPush:t.push,openUserPanel:n,openLoginModal:o})),f.default.createElement("div",{className:"container-fluid"},f.default.createElement("div",{className:"row"},f.default.createElement(E.default,{widget_cell:(0,j.default)(r,"masthead")}),f.default.createElement(m.default,{widget_cell:(0,j.default)(r,"subnavigation"),currentUrl:(0,j.default)(this.props.post,"post_url","")}),this.state.loading?f.default.createElement("div",{className:"m-auto"}," ",f.default.createElement(b.default,null)):f.default.createElement(g.default,{posts:this.props.posts,allowPagination:this.props.allowPagination,seeMoreHandler:this.props.getPosts,categoryId:(0,j.default)(r,"category_id")}))))}}]),t}(c.Component);T.propTypes={post:P.default.object.isRequired};var C=(0,p.connect)(L,M)(T);t.default=C}});