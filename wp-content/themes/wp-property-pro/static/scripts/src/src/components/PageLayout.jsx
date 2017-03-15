import React, {Component, PropTypes} from 'react';
import Header from './Header.jsx';
import LoadingAccordion from './LoadingAccordion.jsx';
import UserPanel from './UserPanel.jsx';
import Util from './Util.jsx';

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
    Util.getPageContent(window.location.pathname, (data) => {
      this.setState({post: data.post});
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
