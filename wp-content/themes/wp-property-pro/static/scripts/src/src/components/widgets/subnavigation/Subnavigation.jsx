import React from 'react';
import IconLayout from './layouts/IconLayout.jsx';
import TextLayout from './layouts/TextLayout.jsx';
import {Lib} from '../../../lib.jsx';
import get from 'lodash/get';
import { withRouter } from 'react-router'

const Subnavigation = ({currentUrl, history, post_title, widget_cell}) => {

  if (!widget_cell) {
    return null;
  }

  let items = get(widget_cell, 'widget.fields.menu_items', []);

  let container;
  let classes = Lib.THEME_CLASSES_PREFIX + "subnavigation";
  switch (widget_cell.widget.fields.layout) {
    case 'icon_layout':
      classes += ` ${Lib.THEME_CLASSES_PREFIX}subnavigation-icon-layout`;
      container = <IconLayout historyPush={history.push} items={items} currentUrl={currentUrl}/>;
      break;
    case 'text_layout':
      classes += ` ${Lib.THEME_CLASSES_PREFIX}subnavigation-text-layout`;
    default:
      container = <TextLayout historyPush={history.push} items={items} currentUrl={currentUrl}/>
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

export default withRouter(Subnavigation);