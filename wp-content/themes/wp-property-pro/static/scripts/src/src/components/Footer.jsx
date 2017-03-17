import React from 'react';
import FooterTop from "./Footer/FooterTop.jsx"
import FooterBottom from "./Footer/FooterBottom.jsx"
import {Lib} from '../lib.jsx';
import _ from 'lodash';

const Footer = () =>
  _.get(bundle, 'footer', null)
    ?
    <footer className={Lib.THEME_CLASSES_PREFIX+"pagefooter"}>
      <FooterTop />
      <FooterBottom/>
    </footer>
    : null;

export default Footer;