import React, {Component, PropTypes} from 'react';
import Header from './Header.jsx';
import LoadingAccordion from './LoadingAccordion.jsx';
import UserPanel from './UserPanel.jsx';
import {Lib} from '../lib.jsx';
import _ from 'lodash';

export default class PageLayout extends Component {
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
    jQuery.ajax({
      url: url,
      type: 'GET',
      data: {
        pageType: 'json'
      },
      dataType: 'json',
      success: data => {
        if (_.get(data, 'post', null)) {
          self.setState({post: data.post});
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
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
      children,
      location
    } = this.props;
    return (
      <div className={Lib.THEME_CLASSES_PREFIX + "page-layout-container"}>
        {Object.keys(this.state.post).length ?
          <div className={Lib.THEME_CLASSES_PREFIX + "page-layout-container-inner container-fluid"}>
            <UserPanel location={location}/>
            <Header location={location}/>
            {React.Children.map(children, (child, i) => React.cloneElement(child, {
              post: _.get(this.state, 'post', {}),
              rows: _.get(this.state, 'post.custom_content', null) ? this.state.post.post_content : []
            }))}
          </div>
          : <LoadingAccordion />}
      </div>
    );
  }
};
