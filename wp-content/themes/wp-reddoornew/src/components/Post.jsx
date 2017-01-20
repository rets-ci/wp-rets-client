import React from 'react'
import Line from './Line.jsx'

const RowsList = ({rows}) => (
    <div>
        {rows.map((row, i) =>
            <Line key={i} cells={row.cells}/>
        )}
    </div>
);

export default RowsList