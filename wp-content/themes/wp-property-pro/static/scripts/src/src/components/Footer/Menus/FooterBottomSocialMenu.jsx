import React from 'react';
import {Lib} from '../../../lib.jsx'
import _ from 'lodash';

const FooterTop = ({menu}) => {

  return (
    <div className="col-md-12 col-lg-5">
      {
        _.isEmpty(menu)
          ? null
          :
          <div className={Lib.THEME_CLASSES_PREFIX+"social"}>
            <span>{menu.title}</span>
            {
              _.get(menu, 'items', null)
              ?
              menu.items.map((item, i) =>
                <a key={i} className={item.title.toLowerCase()} href={item.url} target="_blank" title={item.title} rel="noopener"><i
                  className={`fa fa-${item.title.toLowerCase() === 'facebook ' ? item.title.toLowerCase() + '-f' : item.title.toLowerCase()}`}></i></a>
              )
              : null
            }
          </div>
      }
    </div>
  );
};

export default FooterTop;
