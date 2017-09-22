import React from 'react';
import {get, isEmpty} from 'lodash';

const IconItem = ({historyPush, item}) =>
  isEmpty(item)
    ? null
    : <a href={item.url} title={item.title} onClick={(eve) => {
      eve.preventDefault();
      historyPush(get(item, 'relative_url', null))
    }}>
      <img src={bundle.static_images_url + get(item, 'classes.0', '') + "-icon.svg"}
           alt={item.title}/>
      <span>{item.title}</span>
    </a>;


export default IconItem;