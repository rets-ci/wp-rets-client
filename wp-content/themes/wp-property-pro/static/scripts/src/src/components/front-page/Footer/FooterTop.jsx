import React from 'react';
import FooterTopMenu from "./Menus/FooterTopMenu.jsx";

const FooterTop = () => {

    return (
        <div className="top-footer">

            <div className="container">
                <div className="row">
                    <div className="col-lg-3 footer-logo">
                        <a href={bundle.site_url} title={bundle.site_name}>
                            <img src={bundle.logos.vertical_logo} alt={bundle.site_name}
                                 className="svg"/>
                        </a>
                    </div>

                    <div className="col-md-12 col-lg-9 footer-menu">
                        <div className="row">
                            {
                                bundle.footer.top_footer.map((menu, i) =>
                                    <FooterTopMenu key={i} menu={menu}/>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default FooterTop;
