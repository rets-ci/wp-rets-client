import React from 'react';
import {connect} from 'react-redux';
import {Lib} from '../../../../lib.jsx';
import _ from 'lodash';

const DefaultLayout = ({item}) => {
  return (
    <div className="container">
      <div className="row">
        <div className={`${Lib.THEME_CLASSES_PREFIX}callout-container mx-auto`}>
          <nav className="navbar navbar-toggleable-md">
              {
                _.get(item, 'title', null)
                  ?
                  <p className="navbar-brand mr-auto my-auto">{item.title}</p>
                  : null
              }
              {
                _.get(item, 'button.label', null)
                  ?
                  <ul className="navbar-nav">
                    <li>
                      <a href={_.get(item, 'button.url', bundle.site_url)}
                         className={`btn ${Lib.THEME_CLASSES_PREFIX}btn-contact`}>{item.button.label}</a>
                    </li>
                  </ul>
                  : null
              }
          </nav>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;