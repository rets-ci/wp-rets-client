import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

const TextLayout = ({items, currentUrl}) => {
  let contactUs = {};
  let links = [];
  for (let i in items) {
    if (_.get(items[i], 'classes.0', null) === 'btn') {
      contactUs = items[i];
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
          _.isEmpty(contactUs)
            ? null
            :
            <div className="col-lg-4 push-lg-8 text-center">
              <a href={contactUs.url} className="btn" style={style}>{contactUs.title}</a>
            </div>
        }
        {
          links.length
            ?
            <div className="col-lg-8 pull-lg-4">
              <ul>
                {
                  links.map((link, key) => {
                      let classes = link.url === currentUrl ? 'active' : '';
                      return (<li key={key} className={classes}><a href={link.url}>{link.title}</a></li>)
                    }
                  )
                }
              </ul>
            </div>
            : null
        }
      </div>
  );
};

export default TextLayout;