import React from 'react';
import {connect} from 'react-redux'
import Search from './Search.jsx'
import _ from 'lodash'

const mapStateToProps = (state) => {
    return {
        rows: state.postState.rows
    }
};

const MastheadContent = ({rows}) => {

    let widget_cell;
    for (let row_index in rows) {

        let cells = rows[row_index].cells;

        if (widget_cell = _.find(cells, function (cell) {
                return cell.widget.panels_info.class === 'Property_Pro_Masthead_Widget';
            }))
            break;
    }

    if (!widget_cell)
        return (
            <div></div>
        );

    let headerStyle = {
        background: "rgba(0,0,0,.4) url(" + widget_cell.widget.fields.image_src + ") center center no-repeat"
    };

    let container = (
        <div className="container">

            <h1>{widget_cell.widget.fields.title}</h1>
            <p className="hidden-sm-down">{widget_cell.widget.fields.subtitle}</p>

            <Search options={widget_cell.widget.fields.search_options}/>
        </div>
    );

    if (widget_cell.widget.fields.layout === 'option_2')
        container = (
            <div className="container">
                <p className="hidden-sm-down">{widget_cell.widget.fields.subtitle}</p>
                <h1>{widget_cell.widget.fields.title}</h1>
                <Search options={widget_cell.widget.fields.search_options}/>
            </div>
        );


    return (
        <div className="masthead" style={headerStyle}>

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