import get from 'lodash/get'

import BootstrapModal from './Modals/components/BootstrapModal.jsx'
import React from 'react';
import {Link} from 'react-router-dom';
import {Lib} from '../lib.jsx';
import Util from 'app_root/components/Util.jsx';

const UserPanel = ({closeUserPanel, historyPush, openFormModal, panelOpen, menu_items}) => {
  menu_items = menu_items.map(d => {
    if (d.classes.filter(d => d.indexOf(Lib.FORM_MODAL_PREFIX_ACTION) >= 0).length) {
      d['formModalId'] = Util.getFormModalIdFromCSSClass(d.classes);
    }
    return d;
  });
  let items = menu_items.map((item) => {
    return (
      <li key={item.title}>
        <Link
          to={item.relative_url}
          className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link" + (item.classes.length && item.classes.join(' ') ? " " + item.classes.join(' ') : "")}
          title="Home For Sale"
          onClick={item.formModalId ? (() => { closeUserPanel(); openFormModal(item.formModalId, true); }) : null}
        >
              <span>
                {
                  item.classes.length && item.classes[0]
                  ? <img src={bundle.static_images_url + item.classes[0] + ".svg"} />
                    : null
                }
              </span>
          {item.title}
        </Link>
      </li>
    );
  });

  return (
    <BootstrapModal
      classes={["sidebar", "sidebar-right"]}
      id={'UserPanel'}
      closeModal={closeUserPanel}
      open={panelOpen}
      >
      <div className={Lib.THEME_CLASSES_PREFIX + "user-navigation"}>
        <ol className={`${Lib.THEME_CLASSES_PREFIX}user-navigation-list clearfix`}>
          {items}
        </ol>
      </div>
    </BootstrapModal>
  ); 
};

export default UserPanel