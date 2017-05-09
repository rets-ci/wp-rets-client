import React from 'react';
import FooterTop from "./Footer/FooterTop.jsx"
import FooterBottom from "./Footer/FooterBottom.jsx"
import {Lib} from '../lib.jsx';
import _ from 'lodash';

const Footer = () => {
  let pathRoot = _.get(location, 'pathname', '').replace(/\//g, '');

  // Don't display footer for properties base page and guide
  if(pathRoot === _.get(wpp, 'instance.settings.configuration.base_slug', '') || pathRoot.indexOf('guide') !== -1){
    return null;
  }

  return (
    _.get(bundle, 'footer', null)
      ?
      <footer className={`${Lib.THEME_CLASSES_PREFIX}footer-container row no-gutters`}>
        <FooterTop />
        <FooterBottom/>
      </footer>
      : null
  )
};


export default Footer;