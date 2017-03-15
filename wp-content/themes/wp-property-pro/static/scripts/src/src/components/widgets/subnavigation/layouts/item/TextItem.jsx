import React from 'react';
import Util from '../../../../Util.jsx';
import _ from 'lodash';

const TextItem = ({item}) =>
  _.isEmpty(item)
    ? null
    : <a href={item.url} onClick={(eve) => {
      eve.preventDefault();
      Util.goToUrl(_.get(item, 'relative_url', null));
    }}>{item.title}</a>;


export default TextItem;