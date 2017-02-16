import React from 'react';
import {connect} from 'react-redux'
import Search from '../components/Search.jsx'

const SearchLayout = ({widget_cell}) => {
    return (
        <div className="container">

            <h1>{widget_cell.widget.fields.title}</h1>
            <p className="hidden-sm-down">{widget_cell.widget.fields.subtitle}</p>

            <Search options={widget_cell.widget.fields.search_options}/>
        </div>
    );
};

export default SearchLayout;