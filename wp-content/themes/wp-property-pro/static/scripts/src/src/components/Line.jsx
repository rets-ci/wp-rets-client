import React from 'react';
import Cell from './Cell.jsx'
import Util from './Util.jsx'
import _ from 'lodash'

const CellsList = ({cells, style}) => (
    <div className="line" style={style}>
        {cells.map(function (cell, i) {
            let cellProps = {
                title: _.get(cell, 'widget.title', ''),
                content: _.get(cell, 'widget.text', ''),
                type: _.get(cell, 'widget.panels_info.class', ''),
                cellClass: cells.length
            };

            let style = Util.stringStyleToObject(_.get(cell, 'widget.panels_info.style.widget_css', ''));

            return (<Cell key={i} cell={cellProps} style={style}/>)
        })}
        <div className="clear"></div>
    </div>
);

export default CellsList