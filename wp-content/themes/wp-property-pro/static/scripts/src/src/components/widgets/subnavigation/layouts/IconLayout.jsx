import React from 'react';
import Icon from '../components/Icon.jsx';
import _ from 'lodash';

const IconLayout = ({items, currentUrl}) =>
  _.isEmpty(items)
    ? null
    : <ul className="clearfix">
      {
        items.map((item, i) => {
          if (item.url === currentUrl) {
            return (<li key={i} className='active'><Icon item={item}/></li>);
          } else {
            return (<li key={i}><Icon item={item}/></li>);
          }
        })
      }
    </ul>;


export default IconLayout;