import React from 'react';
import {connect} from 'react-redux';
import Search from '../components/Search.jsx';
import {Lib} from '../../../../lib.jsx';
import _ from 'lodash';

const TitleDescriptionLayout = ({widget_cell}) => {
    return (
        <div className={`container ${Lib.THEME_CLASSES_PREFIX}masthead-title-container pt-4 pb-3`}>
            {
                _.get(widget_cell, 'widget.fields.title', '')
                    ? <h1 className={`${Lib.THEME_CLASSES_PREFIX}masthead-title mb-2`}>{widget_cell.widget.fields.title}</h1>
                    : null
            }
            {
                _.get(widget_cell, 'widget.fields.subtitle', '')
                    ? <p className={`${Lib.THEME_CLASSES_PREFIX}masthead-subtitle mb-2 px-5 hidden-sm-down`}>{widget_cell.widget.fields.subtitle}</p>
                    : null
            }
            <Search options={_.get(widget_cell, 'widget.fields.search_options', null) ? (_.isEmpty(widget_cell.widget.fields.search_options) ? {} : widget_cell.widget.fields.search_options) : {}} />
        </div>
    );
};

export default TitleDescriptionLayout;