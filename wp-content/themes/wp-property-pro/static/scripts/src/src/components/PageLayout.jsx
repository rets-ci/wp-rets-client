import {
  openFormModal,
  openLoginModal,
  routeChanged,
  receiveWordpressContentFetching,
  receiveWordpressContentFetchingError,
  requestWordpressContentFetch,
  setPropertyTypeOptions,
  toggleUserPanel,
  updateWindowStats,
} from '../actions/index.jsx';
import ErrorMessageModal from './ErrorMessageModal.jsx';
import BootstrapModal from './Modals/components/BootstrapModal.jsx';
import Bundle from '././Bundle.jsx';
import Api from '../containers/Api.jsx';
import Footer from './Footer.jsx';
import LoginModal from './Modals/LoginModal.jsx';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import renderHTML from 'react-render-html';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom';
import {connect} from 'react-redux';
import LoadingAccordion from './LoadingAccordion.jsx';
import nprogress from 'nprogress/nprogress.js';
import UserPanel from 'app_root/components/UserPanel/index.jsx';
import {Lib} from '../lib.jsx';
import get from 'lodash/get';
import throttle from 'lodash/throttle';
import FormModals from './Modals/FormModals/Index.jsx';
import Page from './Page.jsx';
import loadArchive from 'bundle-loader?lazy&name=BlogArchive!./blog/Archive.jsx';
import loadGuideArchive from 'bundle-loader?lazy&name=GuideArchive!./guide/Archive.jsx';
import loadPropertySingle from 'bundle-loader?lazy&name=SingleProperties!./PropertySingle/Container.jsx';
import loadMapSearchResultsContainer from 'bundle-loader?lazy&name=MapSearchResultsContainer!./properties/MapSearchResultsContainer.jsx';

require('nprogress-css');
nprogress.configure({
  showSpinner: false,
  template: `<div class="${Lib.THEME_CLASSES_PREFIX}bar bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>`
});

const mapStateToProps = state => {
  return {
    isFetching: state.wordpressContentFetching.isFetching,
    userPanelOpen: state.userPanel.open,
    saleTypesPanelOpen: get(state, 'headerSearch.saleTypesPanelOpen', false),
    errorMessage: state.wordpressContentFetching.errorMessage 
  }
};

const mapDispatchToProps = dispatch => {
  return {
    closeUserPanel: () => {
      dispatch(toggleUserPanel(false));
    },

    closeLocationModal: () => {
      dispatch(openLocationModal(false));
    },

    openFormModal: (id, open) => {
      dispatch(openFormModal(id, open));
    },

    openLoginModal: () => {
      dispatch(openLoginModal(true));
    },

    openUserPanel: () => {
      dispatch(toggleUserPanel(true));
    },

    receiveWordpressContentFetchingErrorFunc: errorMessage => {
      dispatch(receiveWordpressContentFetchingError(errorMessage));
    },

    receiveWordpressContentFetchingFunc: () => {
      dispatch(receiveWordpressContentFetching());
    },

    routeChanged: () => {
      dispatch(routeChanged());
    },

    requestWordPressContentFetchFunc: () => {
      dispatch(requestWordpressContentFetch());
    },

    setPropertyTypeOptions: (options) => {
      dispatch(setPropertyTypeOptions(options));
    },

    updateWindowStats: (stats) => {
      dispatch(updateWindowStats(stats));
    }
  }
}

class PageLayout extends Component {
  static propTypes = {
    // TODO: specify this
    location: PropTypes.object.isRequired,
    openFormModal: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      post: {}
    };

    this.handleWindowSizeChange = throttle(this.handleWindowSizeChange, 500);
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange)
  }

  componentDidMount() {
    let {
      location
    } = this.props;
    let url = location.pathname + location.search;
    this.fetchData(url);

    this.handleWindowSizeChange();
  }

  componentWillReceiveProps(nextProps) {
    // unless te URL is search, compare URLs to do a request
    let anyChange = (currentPath, nextPath) => {
      if (currentPath.indexOf('search') >= 0 && nextPath.indexOf('search') >= 0) {
        return false;
      } else {
        return currentPath !== nextPath;
      }
    };
    if (this.props.location.pathname && nextProps.location.pathname) {
      if (anyChange(this.props.location.pathname, nextProps.location.pathname)) {
        // reset the post content
        this.routeUpdate();
        this.setState({post: {}});
        this.fetchData(nextProps.location.pathname + nextProps.location.search);
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange)
  }

  fetchData = (url) => {
    // Get page content query
    let self = this;
    nprogress.start();
    this.props.requestWordPressContentFetchFunc();
    Api.makeRequest({
      query: {
        pageType: 'json',
      },
      url: url
    }, (err, data) => {
      if (err) {
        nprogress.done();
        return this.props.receiveWordpressContentFetchingErrorFunc(err);
      }
      if (data.property_search_options) {
        self.props.setPropertyTypeOptions(data.property_search_options);
      }
      if (get(data, 'post', null)) {
        this.props.receiveWordpressContentFetchingFunc();
        document.title = get(data, 'page_title', '').replace(/\&amp;/g,'&');
        self.setState({
          agents: get(data, 'agents'),
          search_options: get(data, 'search_options'),
          post: data.post,
          sidebar_menu_items: get(data, 'sidebar_menu_items', [])
        });
      }
      if (get(data, 'pageNotFound', null)) {
        let searchOptions = [];
        let mastheadOptions = get(data, 'front_page_post_content[0].cells', []).filter(d => {
          return get(d, 'widget.panels_info.class', '') === 'Property_Pro_Masthead_Widget'
        });
        if (mastheadOptions.length) {
          searchOptions = get(mastheadOptions, '[0].widget.fields.search_options', null)
        }
        self.setState({
          post: {
            pageNotFound: true
          },
          search_options: searchOptions
        });
      }
    });
  }

  handleWindowSizeChange = () => {
    this.props.updateWindowStats({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  routeUpdate = () => {
    this.props.routeChanged();
  }

  render() {
    let {
      children,
      closeUserPanel,
      errorMessage,
      history,
      isFetching,
      location,
      openFormModal,
      openLoginModal,
      openUserPanel,
      userPanelOpen
    } = this.props;
    let paramsToSet = {
      agents: get(this.state, 'agents', null),
      history: history,
      location: location,
      search_options: get(this.state, 'search_options', null),
      openLoginModal: openLoginModal,
      openUserPanel: openUserPanel,
      post: get(this.state, 'post', {}),
      rows: get(this.state, 'post.custom_content', null) ? this.state.post.post_content : []
    };
    
    let containerClass = `${Lib.THEME_CLASSES_PREFIX}page-layout-container-inner h-100 d-flex flex-column`;
    if (this.props.saleTypesPanelOpen) {
      containerClass += ` ${Lib.THEME_CLASSES_PREFIX}with-sale-types-panel-open`;
    }

    let mainContent = (
      <div className={containerClass}>
          {
            get(paramsToSet.post, 'head_tags', null)
              ?
              <Helmet>
                {get(paramsToSet.post, 'head_tags').map(tag => {
                  return renderHTML(tag);
                })}
              </Helmet>
              : null
          }
        <FormModals />
        <UserPanel
          closeUserPanel={closeUserPanel}
          historyPush={history.push}
          location={location}
          openFormModal={openFormModal}
          panelOpen={userPanelOpen}
          menuItems={get(this.state, 'sidebar_menu_items', [])}
        />
        <LoginModal />
        <Switch>
          <Route exact path="/" render={(props) => {
            if (nprogress && nprogress.isStarted()) {
              nprogress.done();
            }
            return <Page
              {...paramsToSet}
            />
            }
          } />
          {get(bundle, 'property_single_url', null) &&
            <Route exact path={"/" + get(bundle, 'property_single_url') + "/:propertySlug"} render={props =>
              <Bundle load={loadPropertySingle} nprogress={nprogress}>
                {(Comp) => (Comp
                  ? <Comp {...paramsToSet} />
                  : null
                )}
              </Bundle>
            } />
          }
          {get(bundle, 'blog_base', null) &&
            <Route path={"/" + get(bundle, 'blog_base').replace(/\//g, '')} render={props =>
              <Bundle load={loadArchive} nprogress={nprogress}>
                {(Comp) => (Comp
                  ? <Comp {...paramsToSet} />
                  : null
                )}
              </Bundle>
            } />
          }
          {get(bundle, 'category_base', null) &&
            <Route path={"/" + get(bundle, 'blog_base').replace(/\//g, '') + "/:categoryTitle"} render={props =>
              <Bundle load={loadArchive} nprogress={nprogress}>
                {(Comp) => (Comp
                  ? <Comp {...paramsToSet} />
                  : null
                )}
              </Bundle>
            } />
          }
          {get(bundle, 'guide_category_base', null) &&
            <Route path={"/" + get(bundle, 'guide_category_base').replace(/\//g, '') + "/:guideCategoryTitle"} render={props =>
              <Bundle load={loadGuideArchive} nprogress={nprogress}>
                {(Comp) => (Comp
                  ? <Comp {...paramsToSet} />
                  : null
                )}
              </Bundle>
            } />
          }
          <Route path={'/search'} render={props => {
            return <Bundle load={loadMapSearchResultsContainer} nprogress={nprogress}>
              {(Comp) => (Comp
                ? <Comp {...paramsToSet} />
                : null
              )}
            </Bundle>
          }} />
          <Route render={(props) => {
            if (nprogress && nprogress.isStarted()) {
              nprogress.done();
            }
            return <Page
              {...paramsToSet}
            />
            }
          } />
        </Switch>
        <Footer openFormModal={openFormModal} />
      </div>
    );
    let main = (
      !Object.keys(this.state.post).length ?
        (isFetching ?
          null :
          (errorMessage ?
            <ErrorMessageModal errorMessage={errorMessage} />
          :
          <ErrorMessageModal errorMessage={"Couldn't retrieve the content, please contact the administrator"} />)
        ): mainContent
    );

    return (
      <div className={Lib.THEME_CLASSES_PREFIX + "page-layout-container h-100"}>
        {main}
      </div>
    );
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageLayout);
