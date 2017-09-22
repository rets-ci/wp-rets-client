import React from 'react';
import {Lib} from '../../../lib.jsx'
import {get, isEmpty} from 'lodash';

const FooterTop = ({menu}) => {

  return (
    <div className="col-md-12 col-lg-5">
      {
        isEmpty(menu)
          ? null
          :
          <div className={`${Lib.THEME_CLASSES_PREFIX}social text-right`}>
            <span>{menu.title}</span>
            {
              get(menu, 'items', null)
              ?
              menu.items.map((item, i) =>
                <a key={i} className={`${item.title.toLowerCase()} text-center rounded-circle`} href={item.url} target="_blank" title={item.title} rel="noopener"><i
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
