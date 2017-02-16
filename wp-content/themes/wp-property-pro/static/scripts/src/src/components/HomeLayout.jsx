import React, {Component, PropTypes} from 'react';
import Header from './Header.jsx';
import UserPanel from './UserPanel.jsx';
import Map from './Map.jsx';
import Testimonials from './Testimonials.jsx';
import Subnavigation from './Subnavigation.jsx';

export default class Home extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  }

  render() {
    return (
      <div>
        <UserPanel />
        <Header />
        <Subnavigation />
        <Map />
        {this.props.children}
        <Testimonials />
      </div>
    )
  }
};
