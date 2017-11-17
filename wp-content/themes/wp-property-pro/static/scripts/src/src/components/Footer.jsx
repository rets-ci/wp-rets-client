import React from 'react';
import {withRouter} from 'react-router';
import FooterTop from "./Footer/FooterTop.jsx"
import FooterBottom from "./Footer/FooterBottom.jsx"
import {Lib} from '../lib.jsx';
import get from 'lodash/get';

const Footer = ({history, openFormModal}) => {
  let pathRoot = get(location, 'pathname', '').replace(/\//g, '');

  // Don't display footer for properties base page and guide
  if(pathRoot === get(wpp, 'instance.settings.configuration.base_slug', '') || pathRoot.indexOf('search') >= 0 || pathRoot.indexOf('guide') !== -1){
    return null;
  }
  return (
    get(bundle, 'footer', null)
      ?
      <footer className={`${Lib.THEME_CLASSES_PREFIX}footer-container row no-gutters`}>
        <FooterTop historyPush={history.push} />
        <FooterBottom historyPush={history.push} openFormModal={openFormModal} />
      </footer>
      : null
  )
};


export default withRouter(Footer);