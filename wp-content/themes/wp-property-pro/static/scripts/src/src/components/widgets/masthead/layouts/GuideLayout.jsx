import React from 'react';
import {Lib} from '../../../../lib.jsx';
import get from 'lodash/get';

const GuideLayout = ({widget_cell}) => {
  return (
    <header className={Lib.THEME_CLASSES_PREFIX + "guide-header"}>
      <div className={`${Lib.THEME_CLASSES_PREFIX}guide-header-container mx-auto text-center`}>
        {
          get(widget_cell, 'widget.fields.title', '')
            ? <h1 className={`${Lib.THEME_CLASSES_PREFIX}guide-title`}>{widget_cell.widget.fields.title}</h1>
            : null
        }
        {
          get(widget_cell, 'widget.fields.subtitle', '')
            ? <p className={`hidden-xs-down ${Lib.THEME_CLASSES_PREFIX}guide-excerpt`}>{widget_cell.widget.fields.subtitle}</p>
            : null
        }
      </div>
    </header>
  );
};

export default GuideLayout;