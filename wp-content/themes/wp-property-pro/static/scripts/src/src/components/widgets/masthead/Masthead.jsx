import React from 'react';
import {connect} from 'react-redux'
import WidgetsUtil from '../WidgetsUtil.jsx'
import SearchLayout from './layouts/SearchLayout.jsx'
import TextLayout from './layouts/TextLayout.jsx'
import Modal from './components/Modal.jsx'

const mapStateToProps = (state) => {
    return {
        rows: state.postState.rows
    }
};

const MastheadContent = ({rows}) => {

    let widget_cell = WidgetsUtil.getWidgetByKey('Property_Pro_Masthead_Widget', rows);

    if (!widget_cell)
        return (
            <div></div>
        );

    let headerStyle = {
        background: "rgba(0,0,0,.4) url(" + widget_cell.widget.fields.image_src + ") center center no-repeat"
    };


    let container;
    let modal;
    switch (widget_cell.widget.fields.layout) {
        case 'text_layout':
            container = <TextLayout widget_cell={widget_cell} />;
            break;
        case 'search_layout':
        default:
            modal = <Modal />;
            container = <SearchLayout widget_cell={widget_cell} />;
            break;
    }

    return (
        <div className="masthead" style={headerStyle}>
            {modal}
            <div className="intro-wrap">
                {container}
            </div>
        </div>
    );
};

const Masthead = connect(
    mapStateToProps
)(MastheadContent);

export default Masthead;