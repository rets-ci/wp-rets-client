import React from 'react';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import { Lib } from 'app_root/lib.jsx';
import Util from 'app_root/components/Util.jsx';
import TextItem from 'app_root/components/widgets/subnavigation/layouts/item/TextItem.jsx';


const Desktop = ({ currentUrl, items, openFormModal, pageModalData }) => {
  let btn = {};
  let links = [];
  for (let i in items) {
    let item = items[i];
    if (get(items[i], 'classes.0', null) === 'btn') {
      btn = item;
      if (btn.classes.filter(d => d.indexOf(Lib.FORM_MODAL_PREFIX_ACTION) >= 0).length) {
        btn['formModalId'] = Util.getFormModalIdFromCSSClass(item.classes);
      }
    } else {
      links.push(item);
    }
  }
  return (isEmpty(items)
      ? null
      :
      <div className={`${Lib.THEME_CLASSES_PREFIX}subnavigation-desktop hidden-sm-down`}>
        {
          links.length
            ?
            <ul>
              {
                links.map((link, key) => {
                    if (link.url === currentUrl) {
                      return (<li key={key} className={Lib.THEME_CLASSES_PREFIX + "active"}><TextItem item={link} /></li>)
                    } else {
                      return (<li key={key}><TextItem item={link} /></li>)
                    }
                  }
                )
              }
              {
                isEmpty(btn)
                  ? null
                  :
                  <li className={Lib.THEME_CLASSES_PREFIX + "subnavigation-btn"}>
                    <a href='#' onClick={btn.formModalId ? ((event) => { event.preventDefault(); openFormModal(btn.formModalId, true)}) : null} className={btn.classes.join(' ')}>{btn.title}</a>
                  </li>
              }
            </ul>
            : null
        }
      </div>
  );
};

export default Desktop;