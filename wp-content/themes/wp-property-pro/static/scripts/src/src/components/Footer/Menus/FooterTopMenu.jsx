import React from 'react';
import _ from 'lodash';

const FooterTop = ({menu}) => {

  return (
    <div className="col-6 col-sm-6 col-lg-3">
      {
        _.isEmpty(menu)
          ? null
          :
          <div>
            <h5>{menu.title}</h5>
            <ul>
              {
                _.get(menu, 'items', null)
                ?
                menu.items.map((item, i) =>
                  <li key={i}><a href={item.url}>{item.title}</a></li>
                )
                : null
              }
            </ul>
          </div>
      }
    </div>
  );
};

export default FooterTop;
