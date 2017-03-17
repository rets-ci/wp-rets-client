import React from 'react';
import {browserHistory} from 'react-router';
import {Lib} from '../../../lib.jsx';
import _ from 'lodash';

const Navigation = ({openUserPanel}) => (
  <nav className="navbar navbar-toggleable-md bg-faded">
    <a className="navbar-brand" href={bundle.site_url} onClick={(eve) => {eve.preventDefault();browserHistory.push('')}} title={bundle.site_name}>
      {
        _.get(bundle, 'logos.horizontal_logo', null)
          ? <img src={bundle.logos.horizontal_logo} alt={bundle.site_name}
                 className={`hidden-sm-down ${Lib.THEME_CLASSES_PREFIX}logo ${Lib.THEME_CLASSES_PREFIX}horizontal-logo`}/>
          : null
      }
      {
        _.get(bundle, 'logos.square_logo', null)
          ? <img src={bundle.logos.square_logo} alt={bundle.site_name}
                 className={`hidden-md-up ${Lib.THEME_CLASSES_PREFIX}logo ${Lib.THEME_CLASSES_PREFIX}square-logo`}/>
          : null
      }
    </a>
    <ul className="nav navbar-toggler-right">
      <li className="nav-item">
        <a href="#" className={`btn btn-primary ${Lib.THEME_CLASSES_PREFIX}login-box`}>Login</a>
      </li>
      <li className="nav-item hidden-sm-down">
        <button className="navbar-toggler" type="button" onClick={openUserPanel}><span>☰</span> Menu</button>
      </li>
    </ul>
  </nav>
);

export default Navigation;
