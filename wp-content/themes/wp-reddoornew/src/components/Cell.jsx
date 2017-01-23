import React from 'react';

const Cell = function ({cell, style}) {
    let type = cell.type;
    let title = cell.title;
    let content = cell.content;
    let cellClass = cell.cellClass ? " cell-" + cell.cellClass : "";

    let classes = "cell-item" + cellClass + " " + type;
    return (
        <div className={classes} style={style}>
            <div className="cell-title">{title}</div>
            <div className="cell-content">{content}</div>
        </div>
    )
};

export default Cell