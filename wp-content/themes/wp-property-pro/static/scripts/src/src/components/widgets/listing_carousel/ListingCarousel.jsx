import React from 'react';
import {connect} from 'react-redux';
import WidgetsUtil from '../WidgetsUtil.jsx';
import Defaultlayout from './layouts/Defaultlayout.jsx';
import _ from 'lodash';

const mapStateToProps = (state) => {
  return {
    rows: _.get(state, 'postState.rows', [])
  }
};

const ListingCarouselContent = ({rows}) => {

  let widget_cell = WidgetsUtil.getWidgetByKey('Property_Pro_Listing_Carousel_Widget', rows);

  if (!widget_cell) {
    return null;
  }

  let container;
  switch (widget_cell.widget.fields.layout) {
    case 'default_layout':
    default:
      container = <Defaultlayout item={widget_cell.widget.fields}/>;
      break;
  }

  return (
    <section className="listings">
      {container}
    </section>
  );
};

const ListingCarousel = connect(
  mapStateToProps
)(ListingCarouselContent);

export default ListingCarousel;
