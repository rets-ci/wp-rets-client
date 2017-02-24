import React, {Component, PropTypes} from 'react';
import Masthead from './widgets/masthead/Masthead.jsx';
import Testimonials from './widgets/testimonials/Testimonials.jsx';
import Subnavigation from './widgets/subnavigation/Subnavigation.jsx';
import Footer from './Footer.jsx';

export default class PageContent extends Component {

  render() {
    return (
      <div>
        <Masthead />
        <Subnavigation />
        <Testimonials />
        <Footer />
      </div>
    )
  }
};
