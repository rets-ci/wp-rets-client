import React from 'react';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

const TextItem = ({historyPush, item}) =>
  isEmpty(item)
    ? null
    : <a href={item.url} onClick={(eve) => {
      eve.preventDefault();
      historyPush(get(item, 'relative_url', null));
    }}>{item.title}</a>;


export default TextItem;