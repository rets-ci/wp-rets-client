import React from 'react';
import {connect} from 'react-redux'
import Search from '../components/Search.jsx'
import _ from 'lodash'

const SubtitleTitleLayout = ({widget_cell}) => {
    return (
        <div className="container">
            {
                _.get(widget_cell, 'widget.fields.title', '')
                    ? <p className="hidden-sm-down">{widget_cell.widget.fields.title}</p>
                    : null
            }
            {
                _.get(widget_cell, 'widget.fields.subtitle', '')
                ? <h1>{widget_cell.widget.fields.subtitle}</h1>
                : null
            }
            <Search options={_.get(widget_cell, 'widget.fields.search_options', [])}/>
        </div>
    );
};

export default SubtitleTitleLayout;