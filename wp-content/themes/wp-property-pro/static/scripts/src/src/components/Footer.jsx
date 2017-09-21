import React from 'react';
import {withRouter} from 'react-router';
import FooterTop from "./Footer/FooterTop.jsx"
import FooterBottom from "./Footer/FooterBottom.jsx"
import {Lib} from '../lib.jsx';
import _ from 'lodash';

const Footer = ({history}) => {
  let pathRoot = _.get(location, 'pathname', '').replace(/\//g, '');

  // Don't display footer for properties base page and guide
  if(pathRoot === _.get(wpp, 'instance.settings.configuration.base_slug', '') || pathRoot.indexOf('guide') !== -1){
    return null;
  }

  return (
    _.get(bundle, 'footer', null)
      ?
      <footer className={`${Lib.THEME_CLASSES_PREFIX}footer-container row no-gutters`}>
        <FooterTop historyPush={history.push} />
        <FooterBottom historyPush={history.push} />
      </footer>
      : null
  )
};


export default withRouter(Footer);