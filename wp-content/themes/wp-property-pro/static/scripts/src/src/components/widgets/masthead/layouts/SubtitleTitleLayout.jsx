import React from 'react';
import Search from '../components/Search.jsx';
import {Lib} from '../../../../lib.jsx';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import renderHTML from 'react-render-html';

const SubtitleTitleLayout = ({widget_cell}) => {
  return (
    <div className={`${Lib.THEME_CLASSES_PREFIX}masthead-container mx-auto`}>
      {
        get(widget_cell, 'widget.fields.subtitle', '')
          ? <p
            className={`${Lib.THEME_CLASSES_PREFIX}masthead-subtitle-top`}>{renderHTML(widget_cell.widget.fields.subtitle)}</p>
          : null
      }
      {
        get(widget_cell, 'widget.fields.title', '')
          ? <h1 className={Lib.THEME_CLASSES_PREFIX + "bottom-title"}>{renderHTML(widget_cell.widget.fields.title)}</h1>
          : null
      }
      <Search
        options={get(widget_cell, 'widget.fields.search_options', null) ? (isEmpty(widget_cell.widget.fields.search_options) ? {} : widget_cell.widget.fields.search_options) : {}}/>
    </div>
  );
};

export default SubtitleTitleLayout;