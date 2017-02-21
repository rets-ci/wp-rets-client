import React from 'react';
import FooterTopMenu from "./Menus/FooterTopMenu.jsx";

const FooterTop = () => {

    return (
        <div className="top-footer">

            <div className="container">
                <div className="row">
                    <div className="col-lg-3 footer-logo">
                        <a href={bundle.site_url} title="Red Door Company">
                            <img src={`${bundle.template_url}/static/images/src/footer-logo.svg`} alt={bundle.site_name}
                                 className="svg"/>
                        </a>
                    </div>

                    <div className="col-md-12 col-lg-9 footer-menu">
                        <div className="row">
                            {
                                bundle.footer.top_footer.map((menu) =>
                                    <FooterTopMenu menu={menu}/>
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