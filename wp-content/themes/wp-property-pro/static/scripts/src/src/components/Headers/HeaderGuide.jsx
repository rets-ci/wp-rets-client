import React from 'react';
import Util from '../Util.jsx';
import {Lib} from '../../lib.jsx';
import _ from 'lodash';

const HeaderGuide = () => {

  return (
    <section className={`${Lib.THEME_CLASSES_PREFIX}toolbar ${Lib.THEME_CLASSES_PREFIX}guide-toolbar`}>
      <nav className="navbar navbar-toggleable-md">
        <div className={`${Lib.THEME_CLASSES_PREFIX}navigation-items mx-3`}>
        {
          _.get(bundle, 'template_url', null)
            ?
            <a className="navbar-brand mr-auto" href={_.get(bundle, 'site_url', '')} onClick={(eve) => {
              eve.preventDefault();
              Util.goToUrl('/');
            }}>
              {
                _.get(bundle, 'logos.horizontal_logo', null)
                  ? <img src={bundle.logos.horizontal_logo} alt={_.get(bundle, 'site_name')}
                         className={`hidden-sm-down ${Lib.THEME_CLASSES_PREFIX}logo ${Lib.THEME_CLASSES_PREFIX}horizontal-logo`}/>
                  : null
              }
              {
                _.get(bundle, 'logos.square_logo', null)
                  ? <img src={bundle.logos.square_logo} alt={_.get(bundle, 'site_name')}
                         className={`hidden-md-up ${Lib.THEME_CLASSES_PREFIX}logo ${Lib.THEME_CLASSES_PREFIX}square-logo`}/>
                  : null
              }
            </a>
            : null
        }
        {
          _.get(bundle, 'site_url', null)
            ?
            <ul className={`navbar-nav ${Lib.THEME_CLASSES_PREFIX}navigation-cotrols`}>
              <li className="nav-item">
                <a href={bundle.site_url} onClick={(eve) => {<the></the>
                  eve.preventDefault();
                  Util.goToUrl('/');
                }} className={`btn btn-primary ${Lib.THEME_CLASSES_PREFIX}btn-back-to-home`}>
                  <fa className="fa fa-arrow-left"></fa>
                  <span className={Lib.THEME_CLASSES_PREFIX+"btn-back-to-home-content"}>Return Home</span>
                </a>
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
