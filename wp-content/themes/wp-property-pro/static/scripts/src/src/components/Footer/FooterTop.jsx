import React from 'react';
import {Link} from 'react-router-dom';
import get from 'lodash/get';

import FooterTopMenu from 'app_root/components/Footer/Menus/FooterTopMenu.jsx';
import {Lib} from 'app_root/lib.jsx';


const FooterTop = (props) => {

  return (
    <div className={Lib.THEME_CLASSES_PREFIX + "top-footer"}>
      <div className={`${Lib.THEME_CLASSES_PREFIX}top-footer-container mx-auto`}>
        <div className="row no-gutters">
          <div className={`col-lg-3 ${Lib.THEME_CLASSES_PREFIX}footer-logo text-center`}>
            { get(bundle, 'logos.vertical_logo', null) &&
              <Link to="/" title={bundle.site_name}>
                <img src={bundle.logos.vertical_logo} alt={bundle.site_name}
                     className={`${Lib.THEME_CLASSES_PREFIX}svg ${Lib.THEME_CLASSES_PREFIX}vertical-logo`} />
              </Link>
            }
          </div>

          <div className={`col-md-12 col-lg-9 ${Lib.THEME_CLASSES_PREFIX}footer-menu`}>
            <div className="container-fluid">
              <div className="row">
                { get(bundle, 'footer.top_footer', null) &&
                  bundle.footer.top_footer.map((menu, i) =>
                    <FooterTopMenu key={i} menu={menu}/>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FooterTop;
