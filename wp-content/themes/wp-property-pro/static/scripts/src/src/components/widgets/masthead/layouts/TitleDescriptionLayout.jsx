import React from 'react';
import {connect} from 'react-redux';
import Search from '../components/Search.jsx';
import {Lib} from '../../../../lib.jsx';
import _ from 'lodash';

const TitleDescriptionLayout = ({widget_cell}) => {
  return (
    <div className="container">
      <div className="row">
        <div className={`${Lib.THEME_CLASSES_PREFIX}masthead-title-container mx-auto`}>
             {
               _.get(widget_cell, 'widget.fields.title', '')
                 ? <h1 className={`${Lib.THEME_CLASSES_PREFIX}masthead-title`}>{widget_cell.widget.fields.title}</h1>
                 : null
             }
             {
               _.get(widget_cell, 'widget.fields.subtitle', '')
                 ? <p
                   className={`${Lib.THEME_CLASSES_PREFIX}masthead-subtitle hidden-sm-down`}>{widget_cell.widget.fields.subtitle}</p>
                 : null
             }
        <Search
          options={_.get(widget_cell, 'widget.fields.search_options', null) ? (_.isEmpty(widget_cell.widget.fields.search_options) ? {} : widget_cell.widget.fields.search_options) : {}}/>
      </div>
    </div>
  </div>
  )
  ;
};

export default TitleDescriptionLayout;