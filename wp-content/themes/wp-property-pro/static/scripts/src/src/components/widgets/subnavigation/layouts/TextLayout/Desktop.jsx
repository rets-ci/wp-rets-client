import React from 'react';
import TextItem from '../item/TextItem.jsx';
import {Lib} from '../../../../../lib.jsx';
import _ from 'lodash';
import Util from '../../../../Util.jsx';


const Desktop = ({currentUrl, items, openFormModal, pageModalData}) => {
  let btn = {};
  let links = [];
  for (let i in items) {
    let item = items[i];
    if (_.get(items[i], 'classes.0', null) === 'btn') {
      btn = item;
      btn['formModalId'] = Util.getFormModalIdFromCSSClass(item.classes);
    } else {
      links.push(item);
    }
  }
  
  return (_.isEmpty(items)
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
                      return (<li key={key} className={Lib.THEME_CLASSES_PREFIX + "active"}><TextItem item={link}/></li>)
                    } else {
                      return (<li key={key}><TextItem item={link}/></li>)
                    }
                  }
                )
              }
              {
                _.isEmpty(btn)
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