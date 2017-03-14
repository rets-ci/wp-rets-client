import React from 'react';
import _ from 'lodash';

const Icon = ({item}) =>
  _.isEmpty(item)
    ? null
    : <a href={item.url} title={item.title}>
      <img src={bundle.static_images_url + _.get(item, 'classes.0', '') + "-icon.svg"}
           alt={item.title}/>
      <span>{item.title}</span>
    </a>;


export default Icon;