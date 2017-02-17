import React from 'react';
import {connect} from 'react-redux'
import _ from 'lodash'

const SearchLayout = ({widget_cell}) => {
    return (
        <div className="container">
            {
                _.get(widget_cell, 'widget.fields.subtitle', '')
                    ? <p className="hidden-sm-down">{widget_cell.widget.fields.subtitle}</p>
                    : null
            }
            {
                _.get(widget_cell, 'widget.fields.title', '')
                ? <h1>{widget_cell.widget.fields.title}</h1>
                : null
            }
        </div>
    );
};

export default SearchLayout;