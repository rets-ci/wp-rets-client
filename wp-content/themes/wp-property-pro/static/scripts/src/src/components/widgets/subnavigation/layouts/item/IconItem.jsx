import React from 'react';
import Util from '../../../../Util.jsx';
import _ from 'lodash';

const IconItem = ({item}) =>
  _.isEmpty(item)
    ? null
    : <a href={item.url} title={item.title} onClick={(eve) => {
      eve.preventDefault();
      Util.goToUrl(_.get(item, 'relative_url', null))
    }}>
      <img src={bundle.static_images_url + _.get(item, 'classes.0', '') + "-icon.svg"}
           alt={item.title}/>
      <span>{item.title}</span>
    </a>;


export default IconItem;