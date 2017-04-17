import React from 'react';
import {connect} from 'react-redux';
import DefaultLayout from './layouts/DefaultLayout.jsx';
import {setTestimonialsActiveItem} from '../../../actions/index.jsx';
import {Lib} from '../../../lib.jsx';
import _ from 'lodash';

const mapStateToProps = (state) => {
  return {
    activeItem: _.get(state, 'testimonialsCarouselState.activeItem', 0)
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    switchActiveTestimonial: (activeItem) => {
      dispatch(setTestimonialsActiveItem(activeItem));
    }
  }
};

const TestimonialsContent = ({widget_cell, activeItem, switchActiveTestimonial}) => {

  if (!widget_cell) {
    return null;
  }

  let testimonials_reviews = _.get(widget_cell, 'widget.fields.testimonials', []).map((testimonial, i) => (
    <li className={i === activeItem ? Lib.THEME_CLASSES_PREFIX + "active-slide" : ""} key={i}>
      <blockquote>
        <div className="rating">
          <i className="fa fa-star" aria-hidden="true"></i>
          <i className="fa fa-star" aria-hidden="true"></i>
          <i className="fa fa-star" aria-hidden="true"></i>
          <i className="fa fa-star" aria-hidden="true"></i>
          <i className="fa fa-star" aria-hidden="true"></i>
        </div>

        <p>{_.get(testimonial, 'review', '')}</p>
      </blockquote>
    </li>
  ));

  let testimonials_authors = _.get(widget_cell, 'widget.fields.testimonials', []).map((testimonial, i) => (
    <li className={Lib.THEME_CLASSES_PREFIX + "user-item" + (i === activeItem ? " " + Lib.THEME_CLASSES_PREFIX + "active" : "")} key={i}>
      <a href="#" onClick={(event) => {
        switchActiveTestimonial(i);
        event.preventDefault();
        event.stopPropagation();
      }}>
        <div className={Lib.THEME_CLASSES_PREFIX + "user-box"}>
          <div className={Lib.THEME_CLASSES_PREFIX + "user-image"}>
            {
              _.get(testimonial, 'image_src', '')
                ? <img src={testimonial.image_src} alt={testimonial.title}/>
                : null
            }
          </div>
          <div className={Lib.THEME_CLASSES_PREFIX + "user-info"}>
            {    _.get(testimonial, 'title', '')
              ? <p className="hidden-sm-down">{testimonial.title}</p>
              : null
            }
            {
              _.get(testimonial, 'subtitle', '')
                ? <span className="hidden-sm-down">{testimonial.subtitle}</span>
                : null
            }
          </div>
        </div>
      </a>
    </li>
  ));

  let container;
  switch (widget_cell.widget.fields.layout) {
    case 'default_layout':
    default:
      container = <DefaultLayout widget_cell={widget_cell} testimonials_reviews={testimonials_reviews}
                                 testimonials_authors={testimonials_authors}/>;
      break;
  }

  return (
    <section className={`${Lib.THEME_CLASSES_PREFIX}testimonial text-center`}>
      {container}
    </section>
  );
};

const Testimonials = connect(
  mapStateToProps,
  mapDispatchToProps
)(TestimonialsContent);

export default Testimonials;