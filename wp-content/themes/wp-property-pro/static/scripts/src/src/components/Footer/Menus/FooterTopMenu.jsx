import React from 'react';
import {Link} from 'react-router-dom';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import {Lib} from 'app_root/lib.jsx';


const FooterTopMenu = ({ menu }) => {

  return (
    <div className="col-6 col-sm-6 col-lg-3">
      { !isEmpty(menu) &&
        <div className={Lib.THEME_CLASSES_PREFIX+"footer-top-menu-container"}>
          <h5 className={Lib.THEME_CLASSES_PREFIX+"footer-top-menu-title"}>{menu.title}</h5>
          <ul className={`${Lib.THEME_CLASSES_PREFIX}footer-top-menu-links p-0`}>
            { get(menu, 'items', null) &&
              menu.items.map((item, i) =>
                <li className={Lib.THEME_CLASSES_PREFIX+"footer-top-menu-link"} key={i}>
                  <Link to={item.relative_url}>{item.title}</Link>
                </li>
              )
            }
          </ul>
        </div>
      }
    </div>
  );
};

export default FooterTopMenu;
