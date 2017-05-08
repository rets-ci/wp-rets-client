import React from 'react';
import FooterTopMenu from './Menus/FooterTopMenu.jsx';
import Util from '../Util.jsx';
import {Lib} from '../../lib.jsx';
import _ from 'lodash';

const FooterTop = () => {

  return (
    <div className={Lib.THEME_CLASSES_PREFIX + "top-footer"}>
      <div className={Lib.THEME_CLASSES_PREFIX + "top-footer-container"}>
        <div className="row no-gutters">
          <div className={`col-lg-3 ${Lib.THEME_CLASSES_PREFIX}footer-logo text-center`}>
            {
              _.get(bundle, 'logos.vertical_logo', null)
                ?
                <a href={bundle.site_url} title={bundle.site_name} onClick={(eve) => {
                  eve.preventDefault();
                  Util.goToUrl('/')
                }}>
                  <img src={bundle.logos.vertical_logo} alt={bundle.site_name}
                       className={`${Lib.THEME_CLASSES_PREFIX}svg ${Lib.THEME_CLASSES_PREFIX}vertical-logo`}/>
                </a>

                : null
            }
          </div>

          <div className={`col-md-12 col-lg-9 ${Lib.THEME_CLASSES_PREFIX}footer-menu`}>
            <div className="container-fluid">
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

    </div>
  );
};

export default FooterTop;
