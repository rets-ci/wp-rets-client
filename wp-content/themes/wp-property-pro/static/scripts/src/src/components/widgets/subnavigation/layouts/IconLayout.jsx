import React from 'react';
import IconItem from './item/IconItem.jsx';
import {Lib} from '../../../../lib.jsx';
import isEmpty from 'lodash/isEmpty';

const IconLayout = ({historyPush, items, currentUrl}) =>
  isEmpty(items)
    ? null
    : <nav>
      <ul>
        {
          items.map((item, i) => {
            if (item.url === currentUrl) {
              return (<li key={i} className={Lib.THEME_CLASSES_PREFIX+"active"}><IconItem historyPush={historyPush} item={item}/></li>);
            } else {
              return (<li key={i}><IconItem historyPush={historyPush} item={item}/></li>);
            }
          })
        }
      </ul>
    </nav>;


export default IconLayout;