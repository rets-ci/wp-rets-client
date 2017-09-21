import React from 'react';
import _ from 'lodash';

const TextItem = ({historyPush, item}) =>
  _.isEmpty(item)
    ? null
    : <a href={item.url} onClick={(eve) => {
      eve.preventDefault();
      historyPush(_.get(item, 'relative_url', null));
    }}>{item.title}</a>;


export default TextItem;