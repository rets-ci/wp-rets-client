import React from 'react';
import Search from './Search.jsx'
import _ from 'lodash'

const Masthead = ({rows}) => {

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

    // @TODO wait for fix markup and set background image for widget
    let headerStyle = {
        background: "rgba(0,0,0,.4) url(" + widget_cell.widget.fields.image_src + ") center center no-repeat"
    };

    if (widget_cell.widget.fields.layout === 'option_2')
        return (
            <div>
                <p className="hidden-sm-down">{widget_cell.widget.fields.subtitle}</p>
                <h1>{widget_cell.widget.fields.title}</h1>
                <Search options={widget_cell.widget.fields.search_options}/>
            </div>
        );


    return (
        <div>
            <h1>{widget_cell.widget.fields.title}</h1>
            <p className="hidden-sm-down">{widget_cell.widget.fields.subtitle}</p>
            <Search options={widget_cell.widget.fields.search_options}/>
        </div>
    );
};

export default Masthead;