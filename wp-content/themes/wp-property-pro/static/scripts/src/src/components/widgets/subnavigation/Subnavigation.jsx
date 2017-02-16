import React from 'react';
import {connect} from 'react-redux'
import WidgetsUtil from '../WidgetsUtil.jsx'
import _ from 'lodash'
import DefaultLayout from './layouts/DefaultLayout.jsx'

const mapStateToProps = (state) => {
    return {
        rows: state.postState.rows
    }
};

const SubnavigationContent = ({rows}) => {

    let widget_cell = WidgetsUtil.getWidgetByKey('Property_Pro_Subnavigation_Widget', rows);

    if (!widget_cell)
        return (
            <section className="subnavigation"></section>
        );

    let items = _.get(widget_cell, 'widget.fields.menu_items', []).map((item, i) => (
        <li key={i}>
            <a href={item.url} title={item.title}>
                <img src={bundle.template_url + '/static/images/src/' + _.get(item, 'classes.0', '') + "-icon.svg"}
                     alt={item.title}/>
                <span>{item.title}</span>
            </a>
        </li>
    ));

    let container;
    switch (widget_cell.widget.fields.layout) {
        case 'default_layout':
        default:
            container = <DefaultLayout items={items}/>;
            break;
    }


    return (
        <section className="subnavigation">
            {container}
        </section>
    );
};

const Subnavigation = connect(
    mapStateToProps
)(SubnavigationContent);

export default Subnavigation;