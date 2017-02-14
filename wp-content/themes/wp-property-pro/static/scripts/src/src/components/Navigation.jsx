import React from 'react';

const Navigation = () => (
    <nav className="navbar navbar-toggleable-md bg-faded">

        <a className="navbar-brand" href="/">
            <img src="/" alt={bundle.site_name}
                 className="hidden-sm-down"/>
            <img src="/" alt={bundle.site_name}
                 className="hidden-md-up"/>
        </a>

        <ul className="nav navbar-toggler-right">
            <li className="nav-item">
                <a href="#" className="btn btn-primary login-box">Login</a>
            </li>
            <li className="nav-item hidden-sm-down">
                <button className="navbar-toggler" type="button"><span>☰</span> Menu</button>
            </li>
        </ul>
    </nav>
);

export default Navigation;