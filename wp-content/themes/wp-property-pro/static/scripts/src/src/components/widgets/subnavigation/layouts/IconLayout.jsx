import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

const IconLayout = ({items}) =>
    _.isEmpty(items)
      ? null
      :

      <ul className="clearfix">
        {
          items.map((item, i) => (
            <li key={i}>
              <a href={item.url} title={item.title}>
                <img src={bundle.static_images_url + _.get(item, 'classes.0', '') + "-icon.svg"}
                     alt={item.title}/>
                <span>{item.title}</span>
              </a>
            </li>
          ))
        }
      </ul>
  ;


export default IconLayout;