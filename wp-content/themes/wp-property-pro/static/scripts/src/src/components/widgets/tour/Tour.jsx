import React from 'react';
import DefaultLayout from './layouts/DefaultLayout.jsx';
import {Lib} from '../../../lib.jsx';

const Tour = ({browserHistoryPush, openFormModal, widget_cell}) => {

  if (!widget_cell) {
    return null;
  }

  let container;

  switch (widget_cell.widget.fields.layout) {
    case 'default_layout':
    default:
      container = <DefaultLayout browserHistoryPush={browserHistoryPush} item={widget_cell.widget.fields} openFormModal={openFormModal}/>;
      break;
  }

  return (
    <section className={Lib.THEME_CLASSES_PREFIX+"tour-section"}>
      {container}
    </section>
  );
};

export default Tour;