import React from 'react';
import Util from '../../Util.jsx';
import {Lib} from '../../../lib.jsx';
import _ from 'lodash';

const FooterTop = ({menu}) => {

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
                    Util.goToUrl(_.get(item, 'relative_url', null))
                  }}>{item.title}</a></li>
                )
                : null
            }
          </ul>
      }
    </div>
  );
};

export default FooterTop;
