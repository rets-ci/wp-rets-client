import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

const TextLayout = ({items}) => {
  let contact_us = {};
  let links = [];
  for (let i in items) {
    if (_.get(items[i], 'classes.0', null) === 'contact_us') {
      contact_us = items[i];
    } else {
      links.push(items[i]);
    }
  }

  return (_.isEmpty(items)
      ? null
      :
      <div className="row">

        {
          _.isEmpty(contact_us)
            ? null
            :
            <div className="col-lg-4 push-lg-8 text-center">
              <a href={contact_us.url} className="btn btn-contact">{contact_us.title}</a>
            </div>
        }

        {
          links.length
            ?
            <div className="col-lg-8 pull-lg-4">
              <ul>
                {
                  links.map((link, key) =>
                    <li key={key}><a href={link.url}>{link.title}</a></li>
                  )
                }
              </ul>
            </div>
            : null
        }
      </div>
  );


}

export default TextLayout;