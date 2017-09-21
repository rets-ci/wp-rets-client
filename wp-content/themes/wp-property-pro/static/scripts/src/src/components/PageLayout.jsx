import {
  raiseErrorMessage,
  resetErrorMessage,
  routeChanged,
  setPropertyTypeOptions,
  toggleUserPanel
} from '../actions/index.jsx';
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
import _ from 'lodash';


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
    userPanelOpen: state.userPanel.open,
    errorMessage: state.errorMessage 
  }
};

const mapDispatchToProps = dispatch => {
  return {
    closeUserPanel: () => {
      dispatch(toggleUserPanel(false));
    },

    raiseError: (msg) => {
      dispatch(raiseErrorMessage(msg))
    },

    resetErrorMessage: () => {
      dispatch(resetErrorMessage());
    },

    routeChanged: () => {
      dispatch(routeChanged());
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

  fetchData(url) {
    // Get page content query
    let self = this;
    nprogress.start();
    this.APIRequest = Api.makeRequest({
      query: {
        pageType: 'json',
      },
      url: url
    }, (err, data) => {
      if (err) {
        nprogress.done();
        return self.props.raiseError(err);
      }
      if (_.get(data, 'post', null)) {
        document.title = _.get(data, 'page_title', '');
        if (data.property_search_options) {
          self.props.setPropertyTypeOptions(data.property_search_options);
        }
        self.setState({
          agents: _.get(data, 'agents'),
          search_options: _.get(data, 'search_options'),
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
    if (this.props.errorMessage) {
      this.props.resetErrorMessage();
    }
    this.props.routeChanged();
  }

  render() {
    let {
      children,
      closeUserPanel,
      errorMessage,
      history,
      location,
      userPanelOpen
    } = this.props;
    let paramsToSet = {
      agents: _.get(this.state, 'agents', null),
      history: history,
      location: location,
      search_options: _.get(this.state, 'search_options', null),
      post: _.get(this.state, 'post', {}),
      rows: _.get(this.state, 'post.custom_content', null) ? this.state.post.post_content : []
    };

    this.props.history.listen((location, action) => {
      this.routeUpdate();
    });
    return (
      <div className={Lib.THEME_CLASSES_PREFIX + "page-layout-container h-100"}>
        {Object.keys(this.state.post).length ?
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
              saleType={_.get(this.state, 'post.sale_type')}
              searchType={_.get(this.state, 'post.search_type')}
              locationTerm={_.get(this.state, 'post.location')}
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
              {_.get(bundle, 'property_single_url', null) &&
                <Route exact path={"/" + _.get(bundle, 'property_single_url') + "/:propertySlug"} render={props =>
                  <Bundle load={loadPropertySingle} nprogress={nprogress}>
                    {(Comp) => (Comp
                      ? <Comp {...paramsToSet} />
                      : null
                    )}
                  </Bundle>
                } />
              }
              {_.get(wpp, 'instance.settings.configuration.base_slug', null) &&
                <Route path={"/" + _.get(wpp, 'instance.settings.configuration.base_slug')} render={props => {
                  return <Bundle load={loadMapSearchResults} nprogress={nprogress}>
                    {(Comp) => (Comp
                      ? <Comp {...paramsToSet} />
                      : null
                    )}
                  </Bundle>
                }} />
              }
              {_.get(bundle, 'blog_base', null) &&
                <Route path={"/" + _.get(bundle, 'blog_base').replace(/\//g, '')} render={props =>
                  <Bundle load={loadArchive} nprogress={nprogress}>
                    {(Comp) => (Comp
                      ? <Comp {...paramsToSet} />
                      : null
                    )}
                  </Bundle>
                } />
              }
              {_.get(bundle, 'category_base', null) &&
                <Route path={"/" + _.get(bundle, 'blog_base').replace(/\//g, '') + "/:categoryTitle"} render={props =>
                  <Bundle load={loadArchive} nprogress={nprogress}>
                    {(Comp) => (Comp
                      ? <Comp {...paramsToSet} />
                      : null
                    )}
                  </Bundle>
                } />
              }
              {_.get(bundle, 'guide_category_base', null) &&
                <Route path={"/" + _.get(bundle, 'guide_category_base').replace(/\//g, '') + "/:guideCategoryTitle"} render={props =>
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
          : null}
      </div>
    );
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageLayout);
