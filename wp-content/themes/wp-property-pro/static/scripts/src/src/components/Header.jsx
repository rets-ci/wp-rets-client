import React from 'react';
import {connect} from 'react-redux'
import {toggleUserPanel} from '../actions/index.jsx';
import HeaderDefault from './Headers/HeaderDefault.jsx'
import HeaderSearch from './Headers/HeaderSearch.jsx'
import _ from 'lodash'

const mapStateToProps = (state) => {
  return {
    routing: state.routing
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    openUserPanel: () => {
      dispatch(toggleUserPanel(true));
    }
  }
};

const HeaderContent = ({routing, openUserPanel}) => {
  let pathname = routing.locationBeforeTransitions.pathname;
  let headerElement;
  if( _.replace(pathname, '/', '') === _.get(wpp, 'instance.settings.configuration.base_slug', '')){
    headerElement = <HeaderSearch openUserPanel={openUserPanel} />;
  } else {
    headerElement = <HeaderDefault openUserPanel={openUserPanel} />;
  }

  return (
    <div>{headerElement}</div>
  );
};

const Header = connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderContent);

export default Header;
