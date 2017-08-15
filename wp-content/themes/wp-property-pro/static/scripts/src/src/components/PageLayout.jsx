import {
  raiseErrorMessage,
} from '../actions/index.jsx';
import Api from '../containers/Api.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import Footer from './Footer.jsx';
import LoginModal from './Modals/LoginModal.jsx';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Header from './Header.jsx';
import nprogress from 'nprogress/nprogress.js';
import UserPanel from './UserPanel.jsx';
import {Lib} from '../lib.jsx';
import _ from 'lodash';

require('nprogress-css');

nprogress.configure({
  showSpinner: false,
  template: `<div class="${Lib.THEME_CLASSES_PREFIX}bar bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>`
});

const mapStateToProps = state => {
  return {
   errorMessage: state.errorMessage 
  }
};

const mapDispatchToProps = dispatch => {
  return {
    raiseError: (msg) => {
      dispatch(raiseErrorMessage(msg))
    }
  }
}

class PageLayout extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
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
    Api.makeRequest({
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
        nprogress.done();
        document.title = _.get(data, 'page_title', '');
        self.setState({
          agents: _.get(data, 'agents'),
          front_page_post_content: data.front_page_post_content,
          search_options: _.get(data, 'search_options'),
          post: data.post
        });
      }
    });
  }

  componentDidMount() {
    let url = window.location.pathname + window.location.search;
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

  render() {
    let {
      errorMessage,
      children,
      location
    } = this.props;
    return (
      <div className={Lib.THEME_CLASSES_PREFIX + "page-layout-container h-100"}>
        {!errorMessage ?
          (Object.keys(this.state.post).length ?
            <div className={Lib.THEME_CLASSES_PREFIX + "page-layout-container-inner h-100 d-flex flex-column"}>
              <UserPanel location={location}/>
              <LoginModal />
              <Header front_page_post_content={_.get(this.state, 'front_page_post_content', null)} search_options={_.get(this.state, 'search_options', null)} location={location} />
              {React.Children.map(children, (child, i) => React.cloneElement(child, {
                agents: _.get(this.state, 'agents', null),
                front_page_post_content: _.get(this.state, 'front_page_post_content', null),
                search_options: _.get(this.state, 'search_options', null),
                post: _.get(this.state, 'post', {}),
                rows: _.get(this.state, 'post.custom_content', null) ? this.state.post.post_content : []
              }))}
              <Footer/>
            </div>
          : null)
        : <ErrorMessage message={errorMessage} />}
      </div>
    );
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageLayout);
