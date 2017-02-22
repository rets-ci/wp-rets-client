import React, {Component, PropTypes} from 'react';
import Header from './Header.jsx';
import UserPanel from './UserPanel.jsx';
import Masthead from '../widgets/masthead/Masthead.jsx';
import Testimonials from '../widgets/testimonials/Testimonials.jsx';
import Subnavigation from '../widgets/subnavigation/Subnavigation.jsx';
import Footer from '../Footer.jsx';

export default class Home extends Component {
    static propTypes = {
      children: PropTypes.object.isRequired
    }

    render() {
      return (
        <div>
          <UserPanel />
          <Header />
          <Masthead />
          <Subnavigation />
          {this.props.children}
          <Testimonials />
          <Footer />
        </div>
      )
    }
};
