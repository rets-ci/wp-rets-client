import React from 'react';
import {connect} from 'react-redux'
import Search from '../components/Search.jsx'
import _ from 'lodash'
import renderHTML from 'react-render-html'

const SearchLayout = ({widget_cell}) => {
    return (
        <div className="container">

            {
                renderHTML(
                    (_.get(widget_cell, 'widget.fields.title', '') ? '<h1>' + widget_cell.widget.fields.title + '</h1>' : '') +
                    (_.get(widget_cell, 'widget.fields.subtitle', '') ? '<p class="hidden-sm-down">' + widget_cell.widget.fields.subtitle + '</p>' : '')
                )
            }

            <Search options={widget_cell.widget.fields.search_options}/>
        </div>
    );
};

export default SearchLayout;