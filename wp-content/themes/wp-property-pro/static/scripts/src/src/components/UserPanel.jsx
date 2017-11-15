import BootstrapModal from './Modals/components/BootstrapModal.jsx'
import React from 'react';
import {Link} from 'react-router-dom';
import {Lib} from '../lib.jsx';

const UserPanel = ({closeUserPanel, historyPush, panelOpen, menu_items}) => {

  let items = menu_items.map((item) => {
    return (
      <li key={item.title}>
        <Link
          to={item.relative_url}
          className={Lib.THEME_CLASSES_PREFIX + "user-navigation-item-link" + (item.classes.length && item.classes.join(' ') ? " " + item.classes.join(' ') : "")}
          title="Home For Sale"
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