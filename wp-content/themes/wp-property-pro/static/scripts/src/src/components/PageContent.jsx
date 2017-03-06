import React, {Component, PropTypes} from 'react';
import Masthead from './widgets/masthead/Masthead.jsx';
import Callout from './widgets/callout/Callout.jsx';
import Testimonials from './widgets/testimonials/Testimonials.jsx';
import ListingCarousel from './widgets/listing_carousel/ListingCarousel.jsx';
import Subnavigation from './widgets/subnavigation/Subnavigation.jsx';
import Tour from './widgets/tour/Tour.jsx';
import Footer from './Footer.jsx';

export default class PageContent extends Component {

  render() {
    return (
      <div>
        <Masthead />
        <Subnavigation />
        <Tour />
        <ListingCarousel />
        <Callout />
        <Testimonials />
        <Footer />
      </div>
    )
  }
};
