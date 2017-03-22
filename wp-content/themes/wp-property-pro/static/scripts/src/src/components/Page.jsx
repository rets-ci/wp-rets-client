import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Masthead from './widgets/masthead/Masthead.jsx';
import _ from 'lodash';
import Callout from './widgets/callout/Callout.jsx';
import Testimonials from './widgets/testimonials/Testimonials.jsx';
import ListingCarousel from './widgets/listing_carousel/ListingCarousel.jsx';
import Subnavigation from './widgets/subnavigation/Subnavigation.jsx';
import Tour from './widgets/tour/Tour.jsx';
import Footer from './Footer.jsx';

class Page extends Component {
  static propTypes = {
    rows: PropTypes.array
  }

  render() {
    let {
      rows
    } = this.props
    return (
      <div>
        {
          rows.map((row) => {
            let cells = _.get(row, 'cells', []);

            return cells.map(((cell) => {
                  switch (_.get(cell, 'widget.panels_info.class', '')) {
                    case 'Property_Pro_Masthead_Widget':
                      return <Masthead widget_cell={cell}/>;
                      break;
                    case 'Property_Pro_Subnavigation_Widget':
                      return <Subnavigation widget_cell={cell}/>;
                      break;
                    case 'Property_Pro_Tour_Widget':
                      return <Tour widget_cell={cell}/>;
                      break;
                    case 'Property_Pro_Listing_Carousel_Widget':
                      return <ListingCarousel widget_cell={cell}/>;
                      break;
                    case 'Property_Pro_Callout_Widget':
                      return <Callout widget_cell={cell}/>;
                      break;
                    case 'Property_Pro_Testimonials_Widget':
                      return <Testimonials widget_cell={cell}/>;
                      break;
                  }
                }
              )
            )
          })
        }
        <Footer/>
      </div>
    )
  }
}

export default Page;
