import React from 'react';
import {Lib} from '../../../lib.jsx';
import _ from 'lodash';

const FooterBottomMenu = ({historyPush, menu}) => {

  return (
    <div className="col-md-12 col-lg-7">
      {
        _.isEmpty(menu)
          ? null
          :
          <ul className={`${Lib.THEME_CLASSES_PREFIX}footer-bottom-menu-links p-0`}>
            {
              _.get(menu, 'items', null)
                ?
                menu.items.map((item, i) =>
                  <li className={Lib.THEME_CLASSES_PREFIX+"footer-bottom-menu-link"} key={i}><a href={item.url} onClick={(eve) => {
                    eve.preventDefault();
                    historyPush(_.get(item, 'relative_url', null));
                  }}>{item.title}</a></li>
                )
                : null
            }
          </ul>
      }
    </div>
  );
};

export default FooterBottomMenu;
