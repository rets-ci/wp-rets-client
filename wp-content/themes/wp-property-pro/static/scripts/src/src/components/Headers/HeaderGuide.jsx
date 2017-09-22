import React from 'react';
import {Lib} from '../../lib.jsx';
import {get} from 'lodash';

const HeaderGuide = ({historyPush}) => {

  return (
    <section className={`${Lib.THEME_CLASSES_PREFIX}toolbar ${Lib.THEME_CLASSES_PREFIX}guide-toolbar`}>
      <nav className="navbar navbar-toggleable-md">
        <div className={`${Lib.THEME_CLASSES_PREFIX}navigation-items mx-3`}>
        {
          get(bundle, 'template_url', null)
            ?
            <a className="navbar-brand mr-auto" href={get(bundle, 'site_url', '')} onClick={(eve) => {
              eve.preventDefault();
              historyPush('/');
            }}>
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
            </a>
            : null
        }
        {
          get(bundle, 'site_url', null)
            ?
            <ul className={`navbar-nav ${Lib.THEME_CLASSES_PREFIX}navigation-cotrols`}>
              <li className="nav-item">
                <a href={bundle.site_url} onClick={(eve) => {<the></the>
                  eve.preventDefault();
                  historyPush('/');
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
