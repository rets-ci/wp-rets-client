import React from 'react';
import {connect} from 'react-redux';
import WidgetsUtil from '../WidgetsUtil.jsx';
import DefaultLayout from './layouts/DefaultLayout.jsx';
import _ from 'lodash';

const mapStateToProps = (state) => {
  return {
    rows: _.get(state, 'postState.rows', [])
  }
};

const TourContent = ({rows}) => {

  let widget_cell = WidgetsUtil.getWidgetByKey('Property_Pro_Tour_Widget', rows);

  if (!widget_cell) {
    return null;
  }

  let container;
  console.log(widget_cell.widget.fields);
  switch (widget_cell.widget.fields.layout) {
    case 'default_layout':
    default:
      container = <DefaultLayout item={widget_cell.widget.fields}/>;
      break;
  }

  return (
    <section className="tour-section">
      {container}
    </section>
  );
};

const Tour = connect(
  mapStateToProps
)(TourContent);

export default Tour;