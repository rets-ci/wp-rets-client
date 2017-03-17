import React from 'react';
import {connect} from 'react-redux';
import {Lib} from '../../../../lib.jsx';
import _ from 'lodash';

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
          <div className={Lib.THEME_CLASSES_PREFIX+"sliderContent"}>
            <ul className={Lib.THEME_CLASSES_PREFIX+"slides"}>
              {testimonials_reviews}
            </ul>
          </div>
      }

      {
        _.isEmpty(testimonials_authors)
          ? null
          :
          <div className={Lib.THEME_CLASSES_PREFIX+"userInfo"}>
            <ul className={Lib.THEME_CLASSES_PREFIX+"slides"}>
              {testimonials_authors}
            </ul>
          </div>
      }
    </div>
  );
};

export default DefaultLayout;