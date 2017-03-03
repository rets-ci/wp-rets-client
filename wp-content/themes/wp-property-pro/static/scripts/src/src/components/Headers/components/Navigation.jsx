import React from 'react';
import _ from 'lodash'

const Navigation = ({openUserPanel}) => (
    <nav className="navbar navbar-toggleable-md bg-faded">
        <a className="navbar-brand" href={bundle.site_url} title={bundle.site_name}>
          {
            _.get(bundle, 'logos.horizontal_logo', null)
              ? <img src={bundle.logos.horizontal_logo} alt={bundle.site_name}
                     className="hidden-sm-down logo"/>
              : null
          }
          {
            _.get(bundle, 'logos.square_logo', null)
              ? <img src={bundle.logos.square_logo} alt={bundle.site_name}
                     className="hidden-md-up logo"/>
              : null
          }
        </a>
        <ul className="nav navbar-toggler-right">
            <li className="nav-item">
                <a href="#" className="btn btn-primary login-box">Login</a>
            </li>
            <li className="nav-item hidden-sm-down">
                <button className="navbar-toggler" type="button" onClick={openUserPanel}><span>☰</span> Menu</button>
            </li>
        </ul>
    </nav>
);

export default Navigation;
