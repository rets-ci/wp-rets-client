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
        <nav>
          {
            links.length
              ?
              <ul className="clearfix">
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
                      if (link.url === currentUrl) {
                        return (<li key={key} className="active"><a href={link.url}>{link.title}</a></li>)
                      } else {
                        return (<li key={key}><a href={link.url}>{link.title}</a></li>)
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