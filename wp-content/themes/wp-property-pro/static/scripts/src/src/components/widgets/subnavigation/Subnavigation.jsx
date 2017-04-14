import React from 'react';
import IconLayout from './layouts/IconLayout.jsx';
import TextLayout from './layouts/TextLayout.jsx';
import {Lib} from '../../../lib.jsx';
import _ from 'lodash';

const Subnavigation = ({widget_cell, currentUrl}) => {

  if (!widget_cell) {
    return null;
  }

  let items = _.get(widget_cell, 'widget.fields.menu_items', []);

  let container;
  let classes = Lib.THEME_CLASSES_PREFIX + "subnavigation";
  switch (widget_cell.widget.fields.layout) {
    case 'icon_layout':
      container = <IconLayout items={items} currentUrl={currentUrl}/>;
      break;
    case 'text_layout':
      classes = `${Lib.THEME_CLASSES_PREFIX}subnavigation ${Lib.THEME_CLASSES_PREFIX}module2`;
    default:
      container = <TextLayout items={items} currentUrl={currentUrl}/>
      break;
  }

  return (
    <section className={classes}>
      <div className={`container ${Lib.THEME_CLASSES_PREFIX}subnavigation-container`}>
        <div className="row">
          {container}
        </div>
      </div>
    </section>
  );
};

export default Subnavigation;