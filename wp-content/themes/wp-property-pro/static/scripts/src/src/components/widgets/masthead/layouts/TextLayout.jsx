import React from 'react';
import {connect} from 'react-redux'
import _ from 'lodash'
import renderHTML from 'react-render-html'

const SearchLayout = ({widget_cell}) => {
    return (
        <div className="container">
            {renderHTML(_.get(widget_cell, 'widget.fields.subtitle', '') ? '<p class="hidden-sm-down">' + widget_cell.widget.fields.subtitle + '</p>' : '')}
            {renderHTML(_.get(widget_cell, 'widget.fields.title', '') ? '<h1>' + widget_cell.widget.fields.title + '</h1>' : '')}
        </div>
    );
};

export default SearchLayout;