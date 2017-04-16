import React from 'react';
import {connect} from 'react-redux';
import {toggleUserPanel} from '../actions/index.jsx';
import HeaderDefault from './Headers/HeaderDefault.jsx';
import HeaderSearch from './Headers/HeaderSearch.jsx';
import Util from './Util.jsx';
import _ from 'lodash';

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
  let pathname = _.get(location, 'pathname', '');
  // this will ensure that all "/" characters is removed from the string
  let pathRoot = pathname.replace(/\//g, '');
  let headerElement;
  if (pathRoot.indexOf('guide') !== -1) {
    return null;
  } else if (pathRoot === _.get(wpp, 'instance.settings.configuration.base_slug', '')) {
    let searchFilters = Util.getSearchFiltersFromURL(window.location.href, true);
    headerElement = <HeaderSearch openUserPanel={openUserPanel} searchFilters={searchFilters}/>;
  } else {
    headerElement = <HeaderDefault openUserPanel={openUserPanel}/>;
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
