import React from 'react';
import {connect} from 'react-redux';
import {Lib} from '../../../../lib.jsx';
import _ from 'lodash';

const DefaultLayout = ({item}) => {
  return (
    <div className="container">
      {
        _.get(item, 'title', null)
          ?
          <p>{item.title}</p>
          : null
      }
      {
        _.get(item, 'button.label', null)
          ?
          <a href={_.get(item, 'button.url', bundle.site_url)} className={`btn ${Lib.THEME_CLASSES_PREFIX}btn-contact`}>{item.button.label}</a>
          : null
      }
    </div>
  );
};

export default DefaultLayout;