import React from 'react';
import {get, isEmpty} from 'lodash';

const TextItem = ({historyPush, item}) =>
  isEmpty(item)
    ? null
    : <a href={item.url} onClick={(eve) => {
      eve.preventDefault();
      historyPush(get(item, 'relative_url', null));
    }}>{item.title}</a>;


export default TextItem;