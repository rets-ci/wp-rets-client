import React from 'react';
import {Lib} from '../../../lib.jsx';
import get  from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import Util from 'app_root/components/Util.jsx';

const FooterBottomMenu = ({historyPush, menu, openFormModal}) => {
  let menu_items = get(menu, 'items', []).map(d => {
    if (d.classes.filter(d => d.indexOf(Lib.FORM_MODAL_PREFIX_ACTION) >= 0).length) {
      d['formModalId'] = Util.getFormModalIdFromCSSClass(d.classes);
    }
    return d;
  });
  return (
    <div className="col-md-12 col-lg-7">
      {
        isEmpty(menu)
          ? null
          :
          <ul className={`${Lib.THEME_CLASSES_PREFIX}footer-bottom-menu-links p-0`}>
            {
              menu_items.length
                ?
                menu_items.map((item, i) =>
                  <li className={Lib.THEME_CLASSES_PREFIX+"footer-bottom-menu-link"} key={i}>
                    <a href={item.url} className={item.classes.length ? item.classes.join(' ') : null} onClick={(eve) => {
                      eve.preventDefault();
                      item.formModalId ? openFormModal(item.formModalId, true) : historyPush(get(item, 'relative_url', null))
                    }}>{item.title}</a>
                    </li>
                )
                : null
            }
          </ul>
      }
    </div>
  );
};

export default FooterBottomMenu;
