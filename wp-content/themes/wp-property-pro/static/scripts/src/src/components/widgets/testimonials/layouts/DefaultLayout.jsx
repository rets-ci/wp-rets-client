import React from 'react';
import {Lib} from '../../../../lib.jsx';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import renderHTML from 'react-render-html';

const DefaultLayout = ({widget_cell, testimonials_reviews, testimonials_authors}) => {
  return (
    <div className="container">
      <div className="row">
        <div className={`${Lib.THEME_CLASSES_PREFIX}testimonials-container mx-auto`} >
             {
               get(widget_cell, 'widget.fields.title', '')
                 ? <h4>{renderHTML(widget_cell.widget.fields.title)}</h4>
                 : null
             }

             {
               isEmpty(testimonials_reviews)
                 ? null
                 :
                 <div className={Lib.THEME_CLASSES_PREFIX + "slider-content"}>
                   <ul className={`${Lib.THEME_CLASSES_PREFIX}slides p-0`}>
                     {testimonials_reviews}
                   </ul>
                 </div>
             }

             {
               isEmpty(testimonials_authors)
                 ? null
                 :
                 <div className={Lib.THEME_CLASSES_PREFIX + "author-info"}>
                   <ul className={`${Lib.THEME_CLASSES_PREFIX}slides p-0`}>
                     {testimonials_authors}
                   </ul>
                 </div>
             }
      </div>
    </div>
  </div>
  )
  ;
};

export default DefaultLayout;