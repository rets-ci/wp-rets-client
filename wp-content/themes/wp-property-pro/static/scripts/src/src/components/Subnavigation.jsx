import React from 'react';
import {connect} from 'react-redux'
import _ from 'lodash'

const mapStateToProps = (state) => {
    return {
        rows: state.postState.rows
    }
};

const SubnavigationContent = ({rows}) => {

    let widget_cell;
    for (let row_index in rows) {

        let cells = rows[row_index].cells;

        if (widget_cell = _.find(cells, function (cell) {
                return cell.widget.panels_info.class === 'Property_Pro_Subnavigation_Widget';
            }))
            break;
    }

    if (!widget_cell)
        return (
            <section className="subnavigation"></section>
        );

    let items = _.get(widget_cell, 'widget.fields.menu_items', []).map((item, i) => (
        <li>
            <a href={item.url} title={item.title}>
                <img src={bundle.template_url+ '/static/images/src/' + _.get(item, 'classes.0', '') + "-icon.svg"} alt={item.title}/>
                <span>{item.title}</span>
            </a>
        </li>
    ));


    return (
        <section className="subnavigation">

            <div className="container">
                <ul className="clearfix">
                    {items}
                </ul>
            </div>
        </section>
    );
};

const Subnavigation = connect(
    mapStateToProps
)(SubnavigationContent);

export default Subnavigation;