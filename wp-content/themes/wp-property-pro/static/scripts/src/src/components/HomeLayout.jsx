import React, {Component, PropTypes} from 'react';
import Header from './Header.jsx';
import UserPanel from './UserPanel.jsx';
import Map from './Map.jsx';

export default class Home extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  }

  render() {
    return (
      <div>
        <UserPanel />
        <Header />
        <Map />
        {this.props.children}
      </div>
    )
  }
};
