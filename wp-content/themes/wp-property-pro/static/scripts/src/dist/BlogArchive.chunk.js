webpackJsonp([3],{1014:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),u=n(408),s=(o(u),n(159)),c=o(s),f=n(1),p=o(f),d=n(41),b=n(1113),_=o(b),E=n(156),h=o(E),m=n(409),y=o(m),g=n(1304),v=o(g),P=n(2),S=o(P),w=n(50),O=n(3),j=n(4),L=o(j),M=function(e){return{posts:(0,L.default)(e,"blogPostsState.posts",[]),allowPagination:(0,L.default)(e,"blogPostsState.allowPagination",!1)}},T=function(e,t){return{getPosts:function(t,n,o,r){jQuery.ajax({url:(0,L.default)(bundle,"admin_ajax_url",""),type:"get",data:{action:O.Lib.AJAX_GET_POSTS_ACTION,from:t,category_id:n},dataType:"json",success:function(n){if((0,L.default)(n,"posts",null)){var a=(0,L.default)(n,"posts",[]);t&&o&&(a=o.concat(a)),void 0!==r&&r(),e((0,w.setBlogPosts)(a,(0,L.default)(n,"allowPagination",!1)))}},error:function(e,t,n){console.log(t,n)}})}}},C=function(e){function t(e){r(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={loading:!0},n}return l(t,e),i(t,[{key:"componentDidMount",value:function(){var e=(0,L.default)(this.props.post,"blog_content",{}),t=this;this.props.getPosts(0,(0,L.default)(e,"category_id",0),this.props.posts,function(){t.setState({loading:!1})})}},{key:"render",value:function(){var e=this.props,t=e.history,n=e.openUserPanel,o=e.openLoginModal,r=(0,L.default)(this.props.post,"blog_content",{});return p.default.createElement("div",null,p.default.createElement("section",{className:O.Lib.THEME_CLASSES_PREFIX+"toolbar "+O.Lib.THEME_CLASSES_PREFIX+"header-default row no-gutters"},p.default.createElement(c.default,{historyPush:t.push,openUserPanel:n,openLoginModal:o})),p.default.createElement("div",{className:"container-fluid"},p.default.createElement("div",{className:"row"},p.default.createElement(h.default,{widget_cell:(0,L.default)(r,"masthead")}),p.default.createElement(y.default,{widget_cell:(0,L.default)(r,"subnavigation"),currentUrl:(0,L.default)(this.props.post,"post_url","")}),this.state.loading?p.default.createElement("div",{className:"m-auto"}," ",p.default.createElement(_.default,null)):p.default.createElement(v.default,{posts:this.props.posts,allowPagination:this.props.allowPagination,seeMoreHandler:this.props.getPosts,categoryId:(0,L.default)(r,"category_id")}))))}}]),t}(f.Component);C.propTypes={post:S.default.object.isRequired};var R=(0,d.connect)(M,T)(C);t.default=R},1113:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),u=n(2),s=o(u),c=n(1),f=o(c),p=n(3),d=function(e){function t(){return r(this,t),a(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return l(t,e),i(t,[{key:"render",value:function(){var e=this.props,t=e.containerHeight,n=e.verticallyCentered;return f.default.createElement("div",{className:n?p.Lib.THEME_CLASSES_PREFIX+"spinner-container":null,style:{height:t}},f.default.createElement("div",{className:p.Lib.THEME_CLASSES_PREFIX+"spinner-circle my-auto text-center"},f.default.createElement("div",{className:p.Lib.THEME_CLASSES_PREFIX+"double-bounce1 rounded-circle"}),f.default.createElement("div",{className:p.Lib.THEME_CLASSES_PREFIX+"double-bounce2 rounded-circle"})))}}]),t}(c.Component);d.propTypes={verticallyCentered:s.default.bool,containerHeight:s.default.string},t.default=d},1304:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),u=n(2),s=o(u),c=n(1),f=o(c),p=n(1113),d=o(p),b=n(410),_=o(b),E=n(3),h=n(4),m=o(h),y=n(19),g=o(y),v=function(e){function t(e){r(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={loading:!1},n}return l(t,e),i(t,[{key:"componentWillReceiveProps",value:function(e){(e.posts!==this.props.posts||(0,g.default)(e.posts))&&this.setState({loading:!1})}},{key:"seeMore",value:function(e,t){e.preventDefault(),this.setState({loading:!0}),this.props.seeMoreHandler(this.props.posts.length,t,this.props.posts)}},{key:"render",value:function(){var e=this,t=this,n=(0,m.default)(this.props,"posts",[]),o=[];if(n){var r=[],a=n.length;n.map(function(e,t){r.push(e),r.length!==E.Lib.BLOG_POSTS_PER_ROW&&t+1!==a||(o.push(r),r=[])})}return f.default.createElement("section",{className:E.Lib.THEME_CLASSES_PREFIX+"blog-posts"},f.default.createElement("div",{className:"container"},!this.state.loading||o?o.map(function(e,t){var n=e.map(function(e,t){return f.default.createElement(_.default,{data:{title:(0,m.default)(e,"title",""),excerpt:(0,m.default)(e,"excerpt",""),image_src:(0,m.default)(e,"image_src",""),image_title:(0,m.default)(e,"image_title",""),image_alt:(0,m.default)(e,"image_alt",""),url:(0,m.default)(e,"url",""),relative_url:(0,m.default)(e,"relative_url","")},key:(0,m.default)(e,"title","")})});return f.default.createElement("div",{className:"row "+E.Lib.THEME_CLASSES_PREFIX+"blog-posts-row",key:t},n)}):f.default.createElement(d.default,null),this.props.allowPagination?f.default.createElement("div",{className:"row"},f.default.createElement("div",{className:E.Lib.THEME_CLASSES_PREFIX+"load-more mx-auto"},this.state.loading?f.default.createElement(d.default,null):f.default.createElement("a",{href:"#",onClick:function(n){return t.seeMore.bind(e)(n,e.props.categoryId)},className:"btn btn-primary "+E.Lib.THEME_CLASSES_PREFIX+"load-more-link"},"Load More"))):null))}}]),t}(c.Component);v.propTypes={seeMoreHandler:s.default.func.isRequired,categoryId:s.default.number.isRequired},t.default=v}});