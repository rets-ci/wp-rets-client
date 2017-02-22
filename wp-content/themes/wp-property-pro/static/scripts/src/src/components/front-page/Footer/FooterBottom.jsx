import React from 'react';
import FooterBottomMenu from "./Menus/FooterBottomMenu.jsx";
import FooterBottomSocialMenu from "./Menus/FooterBottomSocialMenu.jsx";

const FooterBottom = () => {

    return (
        <div className="bottom-footer">
            <div className="container">
                <div className="row">
                            <FooterBottomMenu menu={bundle.footer.bottom_footer.menu}/>

                    <FooterBottomSocialMenu menu={bundle.footer.bottom_footer.social_menu}/>
                </div>
            </div>
        </div>
    );
};

export default FooterBottom;