import React from 'react';
import {Lib} from '../../../lib.jsx';
import _ from 'lodash';

const FooterTopMenu = ({historyPush, menu}) => {

  return (
    <div className="col-6 col-sm-6 col-lg-3">
      {
        _.isEmpty(menu)
          ? null
          :
          <div className={Lib.THEME_CLASSES_PREFIX+"footer-top-menu-container"}>
            <h5 className={Lib.THEME_CLASSES_PREFIX+"footer-top-menu-title"}>{menu.title}</h5>
            <ul className={`${Lib.THEME_CLASSES_PREFIX}footer-top-menu-links p-0`}>
              {
                _.get(menu, 'items', null)
                  ?
                  menu.items.map((item, i) =>
                    <li className={Lib.THEME_CLASSES_PREFIX+"footer-top-menu-link"} key={i}><a href={item.url} onClick={(eve) => {
                      eve.preventDefault();
                      historyPush(_.get(item, 'relative_url', null));
                    }}>{item.title}</a></li>
                  )
                  : null
              }
            </ul>
          </div>
      }
    </div>
  );
};

export default FooterTopMenu;
