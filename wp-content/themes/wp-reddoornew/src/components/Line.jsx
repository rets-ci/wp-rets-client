import React from 'react';
import Cell from './Cell.jsx';
import Util from './Util.jsx';

const CellsList = ({cells, style}) => (
    <div className="line" style={style} >
        {cells.map(function(cell, i){
            let cellProps = {
                title: cell.widget.title,
                content: cell.widget.text,
                type: cell.widget.panels_info.class,
                cellClass: cells.length
            };

            let style = Util.stringStyleToObject(cell.widget.panels_info.style.widget_css || "");

            return (<Cell key={i} cell={cellProps} style={style} />)
        })}
        <div className="clear"></div>
    </div>
);

export default CellsList