import React from 'react';
import {connect} from 'react-redux';
import {toggleUserPanel} from '../actions/index.jsx';
import HeaderDefault from './Headers/HeaderDefault.jsx';
import HeaderSearch from './Headers/HeaderSearch.jsx';
import Util from './Util.jsx';
import {Lib} from '../lib.jsx';
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
  let sectionClassnames = Lib.THEME_CLASSES_PREFIX + "toolbar";
  if (pathRoot.indexOf('guide') !== -1) {
    return null;
  } else if (pathRoot === _.get(wpp, 'instance.settings.configuration.base_slug', '')) {
    let searchFilters = Util.getSearchFiltersFromURL(window.location.href, true);
    headerElement = <HeaderSearch openUserPanel={openUserPanel} searchFilters={searchFilters}/>;
    sectionClassnames += " " + Lib.THEME_CLASSES_PREFIX + "header-search";
  } else {
    headerElement = <HeaderDefault openUserPanel={openUserPanel}/>;
    sectionClassnames += " " + Lib.THEME_CLASSES_PREFIX + "header-default row no-gutters";
  }

  return (
    <section className={sectionClassnames}>
      {headerElement}
    </section>
  );
};

const Header = connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderContent);

export default Header;
