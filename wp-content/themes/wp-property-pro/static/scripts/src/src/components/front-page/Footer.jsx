import React from 'react';
import _ from 'lodash';
import FooterTop from "./Footer/FooterTop.jsx"
import FooterBottom from "./Footer/FooterBottom.jsx"

const Footer = () =>
    _.get(bundle, 'footer', null)
        ? <footer className="pagefooter">
            <FooterTop />
            <FooterBottom/>
        </footer>
        : null;

export default Footer;