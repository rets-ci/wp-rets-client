import React from 'react';
import FooterBottomMenu from "./Menus/FooterBottomMenu.jsx";
import FooterBottomSocialMenu from "./Menus/FooterBottomSocialMenu.jsx";
import {Lib} from '../../lib.jsx';
import _ from 'lodash';

const FooterBottom = () => {

    return (
        <div className={Lib.THEME_CLASSES_PREFIX+"bottom-footer"}>
            <div className={`container ${Lib.THEME_CLASSES_PREFIX}bottom-footer-container`}>
                <div className="row">
                    <FooterBottomMenu menu={_.get(bundle, 'footer.bottom_footer.menu', {})}/>
                    <FooterBottomSocialMenu menu={_.get(bundle, 'footer.bottom_footer.social_menu', {})}/>
                </div>
            </div>
        </div>
    );
};

export default FooterBottom;