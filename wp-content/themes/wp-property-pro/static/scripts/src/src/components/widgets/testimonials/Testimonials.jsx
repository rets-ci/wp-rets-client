import React from 'react';
import {connect} from 'react-redux'
import WidgetsUtil from '../WidgetsUtil.jsx'
import DefaultLayout from './layouts/DefaultLayout.jsx'

const mapStateToProps = (state) => {
    return {
        rows: state.postState.rows
    }
};

const TestimonialsContent = ({rows}) => {

    let widget_cell = WidgetsUtil.getWidgetByKey('Property_Pro_Testimonials_Widget', rows);

    if (!widget_cell)
        return (
            <section className="testimonial"></section>
        );

    let testimonials_reviews = _.get(widget_cell, 'widget.fields.testimonials', []).map((testimonial, i) => (
        <li className={i === 0 ? "active-slide" : ""} key={i}>
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
        <li className={i === 0 ? "active" : ""} key={i}>
            <a href="#">
                <div className="userBox">
                    <img src={_.get(testimonial, 'image_src', '')} alt={_.get(testimonial, 'title', '')}/>
                    <p className="hidden-sm-down">{_.get(testimonial, 'title', '')}</p>
                    <span className="hidden-sm-down">{_.get(testimonial, 'subtitle', '')}</span>
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
    mapStateToProps
)(TestimonialsContent);

export default Testimonials;