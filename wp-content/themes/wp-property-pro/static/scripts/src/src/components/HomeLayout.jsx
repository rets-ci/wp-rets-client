import React, {Component, PropTypes} from 'react';
import Header from './Header.jsx';
import UserPanel from './UserPanel.jsx';

export default class Home extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  }

  render() {
    return (
      <div>
        <UserPanel />
        <Header />
        {this.props.children}
      </div>
    )
  }
};
