import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {
  openLoginModal,
  toggleUserPanel
} from '../actions/index.jsx';
import HeaderDefault from './Headers/HeaderDefault.jsx';
import HeaderPropertySingle from './Headers/HeaderPropertySingle.jsx';
import HeaderSearch from './Headers/HeaderSearch.jsx';
import Util from './Util.jsx';
import {Lib} from '../lib.jsx';
import get from 'lodash/get';

const mapStateToProps = (state, ownProps) => {
  return {
    location: ownProps.location,
    saleTypesPanelOpen: get(state, 'headerSearch.saleTypesPanelOpen', false)
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    openLoginModal: () => {
      dispatch(openLoginModal(true));
    },

    openUserPanel: () => {
      dispatch(toggleUserPanel(true));
    }
  }
};

const HeaderContent = ({history, location, locationTerm, openLoginModal, openUserPanel, saleType, saleTypesPanelOpen, searchType}) => {
  let pathname = get(location, 'pathname', '');
  // this will ensure that all "/" characters is removed from the string
  let pathRoot = pathname.replace(/\//g, '');
  let headerElement;
  let sectionClassnames = Lib.THEME_CLASSES_PREFIX + "toolbar";
  if (pathRoot.indexOf('guide') !== -1) {
    return null;
  } else if (pathRoot === get(wpp, 'instance.settings.configuration.base_slug', '')) {
    let searchFilters = Util.getSearchFiltersFromURL(window.location.href, true);
    headerElement = <HeaderSearch historyPush={history.push} openUserPanel={openUserPanel} searchFilters={searchFilters}/>;
    sectionClassnames += " " + Lib.THEME_CLASSES_PREFIX + "header-search px-3";

    if (saleTypesPanelOpen) {
      sectionClassnames += " with-sale-types-panel-open";
    }
  } else if (pathRoot.indexOf(get(wpp, 'instance.settings.configuration.base_slug', '')) !== -1) {
    headerElement = <HeaderPropertySingle historyPush={history.push} locationTerm={locationTerm} saleType={saleType} searchType={searchType} openUserPanel={openUserPanel}/>;
  } else {
    headerElement = <HeaderDefault historyPush={history.push} openUserPanel={openUserPanel} openLoginModal={openLoginModal} />;
    sectionClassnames += " " + Lib.THEME_CLASSES_PREFIX + "header-default row no-gutters";
  }

  return (
    <section className={sectionClassnames}>
      {headerElement}
    </section>
  );
};

const Header = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderContent));

export default Header;
