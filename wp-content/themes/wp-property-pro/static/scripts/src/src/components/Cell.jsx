import React from 'react';
import renderHTML from 'react-render-html';
import _ from 'lodash'

const Cell = function ({cell, style}) {
    let type = _.get(cell, 'type', '');
    let title = _.get(cell, 'title', '');
    let content = _.get(cell, 'content', '');
    let cellClass = " cell-" + _.get(cell, 'cellClass', '');

    let classes = "cell-item" + cellClass + " " + type;
    return (
        <div className={classes} style={style}>
            <div className="cell-title">{title}</div>
            <div className="cell-content">{renderHTML(content)}</div>
        </div>
    )
};

export default Cell