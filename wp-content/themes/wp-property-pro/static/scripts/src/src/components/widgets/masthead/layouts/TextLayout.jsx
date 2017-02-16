import React from 'react';
import {connect} from 'react-redux'

const SearchLayout = ({widget_cell}) => {
    return (
        <div className="container">
            <p className="hidden-sm-down">{widget_cell.widget.fields.subtitle}</p>
            <h1>{widget_cell.widget.fields.title}</h1>
        </div>
    );
};

export default SearchLayout;