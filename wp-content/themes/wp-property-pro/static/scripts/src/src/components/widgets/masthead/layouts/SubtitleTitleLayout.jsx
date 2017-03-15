import React from 'react';
import {connect} from 'react-redux'
import Search from '../components/Search.jsx'
import _ from 'lodash'

const SubtitleTitleLayout = ({widget_cell}) => {
    return (
        <div className="container masthead-subtitle-container">
            {
                _.get(widget_cell, 'widget.fields.subtitle', '')
                    ? <p className="hidden-sm-down">{widget_cell.widget.fields.subtitle}</p>
                    : null
            }
            {
                _.get(widget_cell, 'widget.fields.title', '')
                ? <h1 className="bottom-title">{widget_cell.widget.fields.title}</h1>
                : null
            }
            <Search options={_.get(widget_cell, 'widget.fields.search_options', null) ? (_.isEmpty(widget_cell.widget.fields.search_options) ? {} : widget_cell.widget.fields.search_options) : {}} />
        </div>
    );
};

export default SubtitleTitleLayout;