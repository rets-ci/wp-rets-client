import React from 'react';
import FooterTopMenu from './Menus/FooterTopMenu.jsx';
import _ from 'lodash'

const FooterTop = () => {

  return (
    <div className="top-footer">

      <div className="container">
        <div className="row">
          <div className="col-lg-3 footer-logo">
            {
              _.get(bundle, 'logos.vertical_logo', null)
                ?
                <a href={bundle.site_url} title={bundle.site_name}>
                  <img src={bundle.logos.vertical_logo} alt={bundle.site_name}
                       className="svg vertical-logo"/>
                </a>

                : null
            }
          </div>

          <div className="col-md-12 col-lg-9 footer-menu">
            <div className="row">
              {
                _.get(bundle, 'footer.top_footer', null)
                  ? bundle.footer.top_footer.map((menu, i) =>
                    <FooterTopMenu key={i} menu={menu}/>
                  )
                  : null
              }
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FooterTop;
