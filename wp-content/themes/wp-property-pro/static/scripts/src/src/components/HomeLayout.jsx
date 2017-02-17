import React, {Component, PropTypes} from 'react';
import Header from './Header.jsx';
import UserPanel from './UserPanel.jsx';
import Map from './Map.jsx';
import Modal from './Modal.jsx';
import Masthead from './widgets/masthead/Masthead.jsx';
import Testimonials from './widgets/testimonials/Testimonials.jsx';
import Subnavigation from './widgets/subnavigation/Subnavigation.jsx';

export default class Home extends Component {
    static propTypes = {
      children: PropTypes.object.isRequired
    }

    render() {
      return (
        <div>
          <UserPanel />
          <Modal />
          <Header />
          <Masthead />
          <Subnavigation />
          <Map />
          {this.props.children}
          <Testimonials />
        </div>
      )
    }
};
