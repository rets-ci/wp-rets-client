import React from 'react';
import {browserHistory} from 'react-router';
import {Lib} from '../../../lib.jsx';
import _ from 'lodash';

const Navigation = ({openUserPanel}) => (
  <nav className={`navbar navbar-toggleable-md ${Lib.THEME_CLASSES_PREFIX}navigation-navbar`}>
    <div className={`${Lib.THEME_CLASSES_PREFIX}navigation-items px-3`}>
      {
        _.get(bundle, 'static_images_url', null)
          ?
          <a href="#" className={`${Lib.THEME_CLASSES_PREFIX}menu-icon hidden-md-up my-auto mr-2`} onClick={openUserPanel}>
            <img src={bundle.static_images_url + "menu-icon.svg"} alt="Menu icon"
                 className={Lib.THEME_CLASSES_PREFIX + "logo"}/>
          </a>
          : null
      }
      <a className={`${Lib.THEME_CLASSES_PREFIX}navigation-logo-container navbar-brand mr-auto`}
         href={_.get(bundle, 'site_url', '')}
         onClick={(eve) => {
           eve.preventDefault();
           browserHistory.push('')
         }} title={_.get(bundle, 'site_name', '')}>
        {
          _.get(bundle, 'logos.horizontal_logo', null)
            ? <img src={bundle.logos.horizontal_logo} alt={_.get(bundle, 'site_name', '')}
                   className={`hidden-sm-down ${Lib.THEME_CLASSES_PREFIX}logo ${Lib.THEME_CLASSES_PREFIX}horizontal-logo`}/>
            : null
        }
        {
          _.get(bundle, 'logos.square_logo', null)
            ? <img src={bundle.logos.square_logo} alt={_.get(bundle, 'site_name', '')}
                   className={`hidden-md-up ${Lib.THEME_CLASSES_PREFIX}logo ${Lib.THEME_CLASSES_PREFIX}square-logo`}/>
            : null
        }
      </a>
      <ul className={`navbar-nav ${Lib.THEME_CLASSES_PREFIX}navigation-cotrols`}>
        <li className="nav-item">
          <a href="#" className={`btn btn-primary ${Lib.THEME_CLASSES_PREFIX}login-box`}>Login</a>
        </li>
        <li className="nav-item hidden-sm-down">
          <button type="button" className={Lib.THEME_CLASSES_PREFIX+"navigation-menu-button"} onClick={openUserPanel}><span>☰</span> Menu</button>
        </li>
      </ul>
    </div>
  </nav>
);
export default Navigation;
