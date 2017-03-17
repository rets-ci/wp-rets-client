import React, {Component, PropTypes} from 'react';
import Header from './Header.jsx';
import LoadingAccordion from './LoadingAccordion.jsx';
import UserPanel from './UserPanel.jsx';
import _ from 'lodash';

export default class PageLayout extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      post: {}
    };
  }

  componentDidMount() {

    // Get page content query
    let url = window.location.pathname + window.location.search;

    let self = this;

    jQuery.ajax({
      url: url,
      type: 'get',
      data: {
        pageType: 'json'
      },
      dataType: 'json',
      success: function (data) {
        if(_.get(data, 'post', null))
          self.setState({post: data.post});
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
    });
  }

  render() {
    return (
      <div style={{height: '100%'}}>
        {Object.keys(this.state.post).length ?
          <div>
            <UserPanel />
            <Header />
            {this.props.children}
          </div>
        : <LoadingAccordion style={{display: 'flex', width: '100%', height: '100%'}} />}
      </div>
    );
  }
};
