import React from 'react';
import {connect} from 'react-redux'
import Search from '../components/Search.jsx'
import _ from 'lodash'

const TitleDescriptionLayout = ({widget_cell}) => {
    return (
        <div className="container">
            {
                _.get(widget_cell, 'widget.fields.title', '')
                    ? <h1>{widget_cell.widget.fields.title}</h1>
                    : null
            }
            {
                _.get(widget_cell, 'widget.fields.subtitle', '')
                    ? <p className="hidden-sm-down">{widget_cell.widget.fields.subtitle}</p>
                    : null
            }
            <Search options={_.get(widget_cell, 'widget.fields.search_options', null) ? (_.isEmpty(widget_cell.widget.fields.search_options) ? {} : widget_cell.widget.fields.search_options) : {}} />
        </div>
    );
};

export default TitleDescriptionLayout;