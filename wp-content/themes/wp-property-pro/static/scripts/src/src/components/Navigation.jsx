import React from 'react';
import {connect} from 'react-redux'
import {setUserData} from '../actions/index.jsx';
import _ from 'lodash'

const mapStateToProps = (state) => {
    return {
        userData: _.get(state, 'userDataState', {})
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        openUserPanel: () => {
            let userData = Object.assign({}, ownProps.userData, {
                panelOpened: true
            });

            dispatch(setUserData(userData));
        }
    }
};

const NavigationContent = ({openUserPanel}) => (
    <nav className="navbar navbar-toggleable-md bg-faded">
        <a className="navbar-brand" href="/">
            <img src="http://clients.codelabgh.com/reddoorcomp.dev/img/logo.svg" alt={bundle.site_name}
                 className="hidden-sm-down"/>
            <img src="http://clients.codelabgh.com/reddoorcomp.dev/img/logo-mobile.svg" alt={bundle.site_name}
                 className="hidden-md-up"/>
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

const Navigation = connect(
    mapStateToProps,
    mapDispatchToProps
)(NavigationContent);

export default Navigation;
