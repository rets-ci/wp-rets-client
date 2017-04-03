import React from 'react';
import Util from '../Util.jsx';
import {Lib} from '../../lib.jsx';
import _ from 'lodash';

const HeaderGuide = ({headerStyle}) => {

  return (
    <section className={Lib.THEME_CLASSES_PREFIX + "toolbar"} style={headerStyle}>
      <nav className="navbar navbar-toggleable-md bg-faded">
        {
          _.get(bundle, 'template_url', null)
            ?
            <a className="navbar-brand" href={_.get(bundle, 'site_url', '')} onClick={(eve) => {
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
            <ul className="nav navbar-toggler-right">
              <li className="nav-item">
                <a href={bundle.site_url} onClick={(eve) => {
                  eve.preventDefault();
                  Util.goToUrl('/');
                }} className={`btn btn-primary ${Lib.THEME_CLASSES_PREFIX}btn-back-to-home`}>
                  <fa className="fa fa-arrow-left"></fa>
                  Return Home</a>
              </li>
            </ul>
            : null
        }

      </nav>
    </section>
  );
};
export default HeaderGuide;
