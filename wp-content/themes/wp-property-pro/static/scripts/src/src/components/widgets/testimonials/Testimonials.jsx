import React from 'react';
import {connect} from 'react-redux'
import WidgetsUtil from '../WidgetsUtil.jsx'
import DefaultLayout from './layouts/DefaultLayout.jsx'
import {setTestimonialsActiveItem} from '../../../actions/index.jsx'
import _ from 'lodash'
import renderHTML from 'react-render-html'

const mapStateToProps = (state) => {
    return {
        rows: state.postState.rows,
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

const TestimonialsContent = ({rows, activeItem, switchActiveTestimonial}) => {


    let widget_cell = WidgetsUtil.getWidgetByKey('Property_Pro_Testimonials_Widget', rows);

    if (!widget_cell)
        return (
            <section className="testimonial"></section>
        );

    let testimonials_reviews = _.get(widget_cell, 'widget.fields.testimonials', []).map((testimonial, i) => (
        <li className={i === activeItem ? "active-slide" : ""} key={i}>
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
        <li className={i === activeItem ? "active" : ""} key={i}>
            <a href="#" onClick={(event) => {
                switchActiveTestimonial(i);
                event.preventDefault();
                event.stopPropagation();
            }}>
                <div className="userBox">
                    {renderHTML(
                        (_.get(testimonial, 'image_src', '') ? '<img src="' + testimonial.image_src + '" alt="' + testimonial.title + '" />' : '') +
                        (_.get(testimonial, 'title', '') ? '<p class="hidden-sm-down">' + testimonial.title + '</p>' : '') +
                        (_.get(testimonial, 'subtitle', '') ? '<span class="hidden-sm-down">' + testimonial.subtitle + '</span>' : '')
                    )}

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
        <section className="testimonial">
            {container}
        </section>
    );
};

const Testimonials = connect(
    mapStateToProps,
    mapDispatchToProps
)(TestimonialsContent);

export default Testimonials;