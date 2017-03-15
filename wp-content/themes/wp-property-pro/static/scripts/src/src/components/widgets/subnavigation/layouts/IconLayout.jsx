import React from 'react';
import IconItem from './item/IconItem.jsx';
import _ from 'lodash';

const IconLayout = ({items, currentUrl}) =>
  _.isEmpty(items)
    ? null
    : <nav>
      <ul className="clearfix">
        {
          items.map((item, i) => {
            if (item.url === currentUrl) {
              return (<li key={i} className='active'><IconItem item={item}/></li>);
            } else {
              return (<li key={i}><IconItem item={item}/></li>);
            }
          })
        }
      </ul>
    </nav>;


export default IconLayout;