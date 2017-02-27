import React from 'react';
import {connect} from 'react-redux'
import _ from 'lodash'

const DefaultLayout = ({widget_cell, testimonials_reviews, testimonials_authors}) => {
  return (
    <div className="container">

      {
        _.get(widget_cell, 'widget.fields.title', '')
          ? <h4>{widget_cell.widget.fields.title}</h4>
          : null
      }

      {
        _.isEmpty(testimonials_reviews)
          ? null
          :
          <div className="sliderContent">
            <ul className="slides">
              {testimonials_reviews}
            </ul>
          </div>
      }

      {
        _.isEmpty(testimonials_authors)
          ? null
          :
          <div className="userInfo">
            <ul className="slides">
              {testimonials_authors}
            </ul>
          </div>
      }
    </div>
  );
};

export default DefaultLayout;