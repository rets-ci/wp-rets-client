import React from 'react';
import {connect} from 'react-redux';
import TextItem from '../item/TextItem.jsx';
import {Lib} from '../../../../../lib.jsx';
import _ from 'lodash';

const Desktop = ({items, currentUrl}) => {
  let btn = {};
  let links = [];
  for (let i in items) {
    if (_.get(items[i], 'classes.0', null) === 'btn') {
      btn = items[i];
    } else {
      links.push(items[i]);
    }
  }

  return (_.isEmpty(items)
      ? null
      :
      <div className={`${Lib.THEME_CLASSES_PREFIX}subnavigation-desktop hidden-sm-down`}>
        {
          links.length
            ?
            <ul>
              {
                links.map((link, key) => {
                    if (link.url === currentUrl) {
                      return (<li key={key} className={Lib.THEME_CLASSES_PREFIX + "active"}><TextItem item={link}/></li>)
                    } else {
                      return (<li key={key}><TextItem item={link}/></li>)
                    }
                  }
                )
              }
              {
                _.isEmpty(btn)
                  ? null
                  :
                  <li className={Lib.THEME_CLASSES_PREFIX + "subnavigation-btn"}>
                    <a href={btn.url} className="btn">{btn.title}</a>
                  </li>
              }
            </ul>
            : null
        }
      </div>
  );
};

export default Desktop;