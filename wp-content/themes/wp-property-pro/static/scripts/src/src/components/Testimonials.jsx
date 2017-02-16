import React from 'react';
import {connect} from 'react-redux'
import _ from 'lodash'

const mapStateToProps = (state) => {
    return {
        rows: state.postState.rows
    }
};

const TestimonialsContent = ({rows}) => {

    let widget_cell;
    for (let row_index in rows) {

        let cells = rows[row_index].cells;

        if (widget_cell = _.find(cells, function (cell) {
                return cell.widget.panels_info.class === 'Property_Pro_Testimonials_Widget';
            }))
            break;
    }

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
            <div className="userBox">
                <img src={_.get(testimonial, 'image_src', '')} alt={_.get(testimonial, 'title', '')}/>
                <p className="hidden-sm-down">{_.get(testimonial, 'title', '')}</p>
                <span className="hidden-sm-down">{_.get(testimonial, 'subtitle', '')}</span>
            </div>
        </li>
    ));


    return (
        <section className="testimonial">

            <div className="container">

                <h4>{_.get(widget_cell, 'widget.fields.title', '')}</h4>

                <div className="sliderContent">
                    <ul className="slides">
                        {testimonials_reviews}
                    </ul>
                </div>
                <div className="userInfo">
                    <ul className="slides">
                        {testimonials_authors}
                    </ul>
                </div>
            </div>
        </section>
    );
};

const Testimonials = connect(
    mapStateToProps
)(TestimonialsContent);

export default Testimonials;