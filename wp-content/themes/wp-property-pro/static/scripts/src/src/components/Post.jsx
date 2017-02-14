import React from 'react'
import Line from './Line.jsx'
import Util from './Util.jsx'

const RowsList = ({rows}) => (
    <div>
        {rows.map((row, i) => {

            let style = Util.stringStyleToObject(row.style.row_css || "");

            return (<Line key={i} cells={row.cells} style={style} />)
        }

        )}
    </div>
);

export default RowsList