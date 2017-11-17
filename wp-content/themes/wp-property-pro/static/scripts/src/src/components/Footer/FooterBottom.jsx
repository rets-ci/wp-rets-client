import React from 'react';
import {withRouter} from 'react-router';
import FooterBottomMenu from "./Menus/FooterBottomMenu.jsx";
import FooterBottomSocialMenu from "./Menus/FooterBottomSocialMenu.jsx";
import {Lib} from '../../lib.jsx';
import get from 'lodash/get';

const FooterBottom = ({historyPush, openFormModal}) => {

    return (
        <div className={Lib.THEME_CLASSES_PREFIX+"bottom-footer"}>
            <div className={`container ${Lib.THEME_CLASSES_PREFIX}bottom-footer-container`}>
                <div className="row no-gutters">
                    <FooterBottomMenu historyPush={historyPush} menu={get(bundle, 'footer.bottom_footer.menu', {})} openFormModal={openFormModal} />
                    <FooterBottomSocialMenu menu={get(bundle, 'footer.bottom_footer.social_menu', {})}/>
                </div>
            </div>
        </div>
    );
};

export default withRouter(FooterBottom);