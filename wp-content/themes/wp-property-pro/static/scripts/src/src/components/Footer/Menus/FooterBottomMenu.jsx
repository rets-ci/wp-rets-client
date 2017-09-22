import React from 'react';
import {Lib} from '../../../lib.jsx';
import get  from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

const FooterBottomMenu = ({historyPush, menu}) => {

  return (
    <div className="col-md-12 col-lg-7">
      {
        isEmpty(menu)
          ? null
          :
          <ul className={`${Lib.THEME_CLASSES_PREFIX}footer-bottom-menu-links p-0`}>
            {
              get(menu, 'items', null)
                ?
                menu.items.map((item, i) =>
                  <li className={Lib.THEME_CLASSES_PREFIX+"footer-bottom-menu-link"} key={i}><a href={item.url} onClick={(eve) => {
                    eve.preventDefault();
                    historyPush(get(item, 'relative_url', null));
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
