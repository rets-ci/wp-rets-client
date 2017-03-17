import React from 'react';
import {connect} from 'react-redux';
import TextItem from './item/TextItem.jsx';
import {Lib} from '../../../../lib.jsx';
import _ from 'lodash';

const TextLayout = ({items, currentUrl}) => {
  let btn = {};
  let links = [];
  for (let i in items) {
    if (_.get(items[i], 'classes.0', null) === 'btn') {
      btn = items[i];
    } else {
      links.push(items[i]);
    }
  }

  let primaryColor = _.get(bundle, 'colors.primary_color', null);
  let style =
      primaryColor !== null
        ?
        {
          "backgroundColor": primaryColor
        }
        : {}
    ;

  return (_.isEmpty(items)
      ? null
      :
      <nav>
        {
          links.length
            ?
            <ul className="clearfix">
              {
                _.isEmpty(btn)
                  ? null
                  :
                  <li className={Lib.THEME_CLASSES_PREFIX+"subnavigation-btn"}>
                    <a href={btn.url} className="btn" style={style}>{btn.title}</a>
                  </li>
              }
              {
                links.map((link, key) => {
                    if (link.url === currentUrl) {
                      return (<li key={key} className={Lib.THEME_CLASSES_PREFIX+"active"}><TextItem item={link} /></li>)
                    } else {
                      return (<li key={key}><TextItem item={link} /></li>)
                    }
                  }
                )
              }
            </ul>
            : null
        }
      </nav>
  );
};

export default TextLayout;