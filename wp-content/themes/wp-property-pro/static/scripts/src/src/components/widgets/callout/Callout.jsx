import React from 'react';
import {connect} from 'react-redux'
import WidgetsUtil from '../WidgetsUtil.jsx'
import DefaultLayout from './layouts/DefaultLayout.jsx'

const mapStateToProps = (state) => {
    return {
        rows: state.postState.rows
    }
};

const CalloutContent = ({rows}) => {

    let widget_cell = WidgetsUtil.getWidgetByKey('Property_Pro_Callout_Widget', rows);

    if (!widget_cell)
        return null;

    let container;
    switch (widget_cell.widget.fields.layout) {
        case 'default_layout':
        default:
            container = <DefaultLayout item={widget_cell.widget.fields}/>;
            break;
    }


    return (
    <section className="callout">
      {container}
    </section>
    );
};

const Callout = connect(
    mapStateToProps
)(CalloutContent);

export default Callout;