import React from 'react';
import {Lib} from '../../../lib.jsx';
import get from 'lodash/get';

const Navigation = ({historyPush, openUserPanel, openLoginModal}) => (
  <nav className={`navbar navbar-toggleable-md ${Lib.THEME_CLASSES_PREFIX}navigation-navbar`}>
    <div className={`${Lib.THEME_CLASSES_PREFIX}navigation-items mx-3`}>
      {
        get(bundle, 'static_images_url', null)
          ?
          <a href="#" className={`${Lib.THEME_CLASSES_PREFIX}menu-icon hidden-md-up my-auto mr-3`} onClick={(eve) => { eve.preventDefault();  openUserPanel(); }}>
            <span className="fa fa-bars"></span>
          </a>
          : null
      }
      <a className={`${Lib.THEME_CLASSES_PREFIX}navigation-logo-container navbar-brand mr-auto`}
         href={get(bundle, 'site_url', '')}
         onClick={(eve) => {
           eve.preventDefault();
           historyPush('')
         }} title={get(bundle, 'site_name', '')}>
        {
          get(bundle, 'logos.horizontal_logo', null)
            ? <img src={bundle.logos.horizontal_logo} alt={get(bundle, 'site_name', '')}
                   className={`hidden-sm-down ${Lib.THEME_CLASSES_PREFIX}logo ${Lib.THEME_CLASSES_PREFIX}horizontal-logo`}/>
            : null
        }
        {
          get(bundle, 'logos.square_logo', null)
            ? <img src={bundle.logos.square_logo} alt={get(bundle, 'site_name', '')}
                   className={`hidden-md-up ${Lib.THEME_CLASSES_PREFIX}logo ${Lib.THEME_CLASSES_PREFIX}square-logo`}/>
            : null
        }
      </a>
      <ul className={`navbar-nav ${Lib.THEME_CLASSES_PREFIX}navigation-cotrols`}>
        <li className="nav-item mr-4">
          <a href="#" className={`btn btn-primary ${Lib.THEME_CLASSES_PREFIX}login-box`} onClick={openLoginModal}>Login</a>
        </li>
        <li className="nav-item hidden-sm-down">
          <button type="button" className={Lib.THEME_CLASSES_PREFIX+"navigation-menu-button d-flex align-items-center"} onClick={openUserPanel}>
            <span className="fa fa-bars mr-3"></span>Menu
          </button>
        </li>
      </ul>
    </div>
  </nav>
);
export default Navigation;
