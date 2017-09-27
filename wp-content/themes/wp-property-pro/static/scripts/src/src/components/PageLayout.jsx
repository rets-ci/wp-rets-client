import {
  routeChanged,
  receiveWordpressContentFetching,
  receiveWordpressContentFetchingError,
  requestWordpressContentFetch,
  setPropertyTypeOptions,
  toggleUserPanel
} from '../actions/index.jsx';
import ErrorMessageModal from './ErrorMessageModal.jsx';
import BootstrapModal from './Modals/components/BootstrapModal.jsx';
import Bundle from '././Bundle.jsx';
import Api from '../containers/Api.jsx';
import Footer from './Footer.jsx';
import LoginModal from './Modals/LoginModal.jsx';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom';
import {connect} from 'react-redux';
import Header from './Header.jsx';
import LoadingAccordion from './LoadingAccordion.jsx';
import nprogress from 'nprogress/nprogress.js';
import UserPanel from './UserPanel.jsx';
import {Lib} from '../lib.jsx';
import get from 'lodash/get';

import Page from './Page.jsx';
import loadArchive from 'bundle-loader?lazy&name=BlogArchive!./blog/Archive.jsx';
import loadGuideArchive from 'bundle-loader?lazy&name=GuideArchive!./guide/Archive.jsx';
import loadPropertySingle from 'bundle-loader?lazy&name=SingleProperties!./properties/SingleContainer.jsx';
import loadMapSearchResults from 'bundle-loader?lazy&name=MapSearchResults!./properties/MapSearchResults.jsx';

require('nprogress-css');

nprogress.configure({
  showSpinner: false,
  template: `<div class="${Lib.THEME_CLASSES_PREFIX}bar bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>`
});

const mapStateToProps = state => {
  return {
    isFetching: state.wordpressContentFetching.isFetching,
    userPanelOpen: state.userPanel.open,
    errorMessage: state.wordpressContentFetching.errorMessage 
  }
};

const mapDispatchToProps = dispatch => {
  return {
    closeUserPanel: () => {
      dispatch(toggleUserPanel(false));
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
  }
}

class PageLayout extends Component {
  static propTypes = {
    // TODO: specify this
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      post: {}
    };
  }

  fetchData = (url) => {
    // Get page content query
    let self = this;
    nprogress.start();
    this.props.requestWordPressContentFetchFunc();
    this.APIRequest = Api.makeRequest({
      query: {
        pageType: 'json',
      },
      url: url
    }, (err, data) => {
      if (err) {
        nprogress.done();
        return this.props.receiveWordpressContentFetchingErrorFunc(err);
      }
      if (get(data, 'post', null)) {
        this.props.receiveWordpressContentFetchingFunc();
        document.title = get(data, 'page_title', '');
        if (data.property_search_options) {
          self.props.setPropertyTypeOptions(data.property_search_options);
        }
        self.setState({
          agents: get(data, 'agents'),
          search_options: get(data, 'search_options'),
          post: data.post
        });
      }
    });
  }

  componentDidMount() {
    let {
      location
    } = this.props;
    let url = location.pathname + location.search;
    this.fetchData(url);
  }

  componentWillReceiveProps(nextProps) {
    let currentUrl = this.props.location.pathname + nextProps.location.search;
    let nextUrl = nextProps.location.pathname + nextProps.location.search;
    if (nextUrl !== currentUrl) {
      // reset the post content
      this.setState({post: {}});
      this.fetchData(nextUrl);
    }
  }

  componentWillUnMount() {
    this.APIRequest.abort();
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
      userPanelOpen
    } = this.props;
    let paramsToSet = {
      agents: get(this.state, 'agents', null),
      history: history,
      location: location,
      search_options: get(this.state, 'search_options', null),
      post: get(this.state, 'post', {}),
      rows: get(this.state, 'post.custom_content', null) ? this.state.post.post_content : []
    };
    this.props.history.listen((location, action) => {
      this.routeUpdate();
    });

    let mainContent = (
      <div className={Lib.THEME_CLASSES_PREFIX + "page-layout-container-inner h-100 d-flex flex-column"}>
        <UserPanel
          closeUserPanel={closeUserPanel}
          historyPush={history.push}
          location={location}
          panelOpen={userPanelOpen}
        />
        <LoginModal />
        <Header
          history={history}
          location={location}
          saleType={get(this.state, 'post.sale_type')}
          searchType={get(this.state, 'post.search_type')}
          locationTerm={get(this.state, 'post.location')}
        />
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
          {get(wpp, 'instance.settings.configuration.base_slug', null) &&
            <Route path={"/" + get(wpp, 'instance.settings.configuration.base_slug')} render={props => {
              return <Bundle load={loadMapSearchResults} nprogress={nprogress}>
                {(Comp) => (Comp
                  ? <Comp {...paramsToSet} />
                  : null
                )}
              </Bundle>
            }} />
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
        <Footer/>
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
