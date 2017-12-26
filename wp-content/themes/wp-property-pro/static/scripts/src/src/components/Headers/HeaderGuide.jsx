import React from 'react';
import {Link} from 'react-router-dom';
import get from 'lodash/get';

import {Lib} from 'app_root/lib.jsx';


const HeaderGuide = ({historyPush}) => {

  return (
    <section className={`${Lib.THEME_CLASSES_PREFIX}toolbar ${Lib.THEME_CLASSES_PREFIX}guide-toolbar`}>
      <nav className="navbar navbar-toggleable-md">
        <div className={`${Lib.THEME_CLASSES_PREFIX}navigation-items mx-3`}>
        {
          get(bundle, 'template_url', null)
            ?
            <Link to="/" className="navbar-brand mr-auto">
              {
                get(bundle, 'logos.horizontal_logo', null)
                  ? <img src={bundle.logos.horizontal_logo} alt={get(bundle, 'site_name')}
                         className={`hidden-sm-down ${Lib.THEME_CLASSES_PREFIX}logo ${Lib.THEME_CLASSES_PREFIX}horizontal-logo`}/>
                  : null
              }
              {
                get(bundle, 'logos.square_logo', null)
                  ? <img src={bundle.logos.square_logo} alt={get(bundle, 'site_name')}
                         className={`hidden-md-up ${Lib.THEME_CLASSES_PREFIX}logo ${Lib.THEME_CLASSES_PREFIX}square-logo`}/>
                  : null
              }
            </Link>
            : null
        }
        {
          get(bundle, 'site_url', null)
            ?
            <ul className={`navbar-nav ${Lib.THEME_CLASSES_PREFIX}navigation-cotrols`}>
              <li className="nav-item">
                <Link to="/" className={`btn btn-primary ${Lib.THEME_CLASSES_PREFIX}btn-back-to-home`}>
                  <fa className="fa fa-arrow-left"></fa>
                  <span className={Lib.THEME_CLASSES_PREFIX+"btn-back-to-home-content"}>Return Home</span>
                </Link>
              </li>
            </ul>
            : null
        }
        </div>
      </nav>
    </section>
  );
};

export default HeaderGuide;
