import React from 'react';
import {connect} from 'react-redux';
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
      <div className="row">
        {
          links.length
            ?
            <ul>
              {
                _.isEmpty(btn)
                  ? null
                  :
                  <li className="subnavigation-btn">
                    <a href={btn.url} className="btn" style={style}>{btn.title}</a>
                  </li>
              }
              {
                links.map((link, key) => {
                    let classes = link.url === currentUrl ? 'active' : '';
                    return (<li key={key} className={classes}><a href={link.url}>{link.title}</a></li>)
                  }
                )
              }
            </ul>
            : null
        }
      </div>
  );
};

export default TextLayout;