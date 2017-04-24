import React from 'react';
import IconItem from './item/IconItem.jsx';
import {Lib} from '../../../../lib.jsx';
import _ from 'lodash';

const IconLayout = ({items, currentUrl}) =>
  _.isEmpty(items)
    ? null
    : <nav>
      <ul>
        {
          items.map((item, i) => {
            if (item.url === currentUrl) {
              return (<li key={i} className={Lib.THEME_CLASSES_PREFIX+"active"}><IconItem item={item}/></li>);
            } else {
              return (<li key={i}><IconItem item={item}/></li>);
            }
          })
        }
      </ul>
    </nav>;


export default IconLayout;