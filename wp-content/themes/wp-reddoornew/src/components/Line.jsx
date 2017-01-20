import React from 'react';
import Cell from './Cell.jsx';

const CellsList = ({cells}) => (
    <div className="line">
        {cells.map(function(cell, i){
            let cellProps = {
                title: cell.widget.title,
                content: cell.widget.text,
                type: cell.widget.panels_info.class,
                cellClass: cells.length
            };
            return (<Cell key={i} cell={cellProps} />)
        })}
        <div className="clear"></div>
    </div>
);

export default CellsList