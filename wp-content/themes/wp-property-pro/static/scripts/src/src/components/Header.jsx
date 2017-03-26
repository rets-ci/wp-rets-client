import React from 'react';
import {connect} from 'react-redux'
import {toggleUserPanel} from '../actions/index.jsx';
import HeaderDefault from './Headers/HeaderDefault.jsx'
import HeaderSearch from './Headers/HeaderSearch.jsx'
import _ from 'lodash'

const mapStateToProps = (state, ownProps) => {
  return {
    location: ownProps.location
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    openUserPanel: () => {
      dispatch(toggleUserPanel(true));
    }
  }
};

const HeaderContent = ({location, openUserPanel}) => {
  let pathname = location.pathname;
  // this will ensure that all "/" characters is removed from the string
  let pathRoot = pathname.replace(/\//g, '');
  let headerElement;
  if(pathRoot === _.get(wpp, 'instance.settings.configuration.base_slug', '')){
    let searchFilters = {};
    for (var k in location.query) {
      if (k.startsWith('wpp_search')) {
        searchFilters[k] = location.query[k];
      }
    }
    headerElement = <HeaderSearch openUserPanel={openUserPanel} searchFilters={searchFilters} />;
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
