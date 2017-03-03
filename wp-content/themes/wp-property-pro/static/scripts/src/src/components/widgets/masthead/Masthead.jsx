import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import WidgetsUtil from '../WidgetsUtil.jsx';
import TitleDescriptionLayout from './layouts/TitleDescriptionLayout.jsx';
import SubtitleTitleLayout from './layouts/SubtitleTitleLayout.jsx';
import Modal from './components/Modal.jsx';

const mapStateToProps = (state) => {
    return {
        rows: _.get(state, 'postState.rows', []),
        open: state.modal ? state.modal.openModal : false
    }
};

const MastheadContent = ({rows, open}) => {

    let widget_cell = WidgetsUtil.getWidgetByKey('Property_Pro_Masthead_Widget', rows);

    if (!widget_cell){
        return null;
    }

    let headerStyle = {
        background: "rgba(0,0,0,.4) url(" + widget_cell.widget.fields.image_src + ") " + widget_cell.widget.fields.image_position + " no-repeat"
    };

    if(open){
      headerStyle = Object.assign(headerStyle, {
        zIndex: "11"
      });
    }

    let container;
    let modal;
    switch (widget_cell.widget.fields.layout) {
        case 'subtitle_title_layout':
            container = <SubtitleTitleLayout widget_cell={widget_cell} />;
            break;
        case 'title_description_layout':
        default:
            modal = <Modal />;
            container = <TitleDescriptionLayout widget_cell={widget_cell} />;
            break;
    }

    return (
        <section className="masthead" style={headerStyle}>
            {modal}
            <div className="intro-wrap">
                {container}
            </div>
        </section>
    );
};

const Masthead = connect(
    mapStateToProps
)(MastheadContent);

export default Masthead;