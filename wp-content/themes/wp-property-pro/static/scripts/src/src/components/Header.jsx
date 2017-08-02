import React from 'react';
import {connect} from 'react-redux';
import {toggleUserPanel} from '../actions/index.jsx';
import HeaderDefault from './Headers/HeaderDefault.jsx';
import HeaderPropertiesSingle from './Headers/HeaderPropertySingle.jsx';
import HeaderSearch from './Headers/HeaderSearch.jsx';
import Util from './Util.jsx';
import {Lib} from '../lib.jsx';
import _ from 'lodash';

const mapStateToProps = (state, ownProps) => {
  return {
    front_page_post_content: ownProps.front_page_post_content,
    location: ownProps.location,
    saleTypesPanelOpen: _.get(state, 'headerSearch.saleTypesPanelOpen', false)
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    openUserPanel: () => {
      dispatch(toggleUserPanel(true));
    }
  }
};

const HeaderContent = ({front_page_post_content, location, openUserPanel, saleTypesPanelOpen}) => {
  let pathname = _.get(location, 'pathname', '');
  // this will ensure that all "/" characters is removed from the string
  let pathRoot = pathname.replace(/\//g, '');
  let headerElement;
  let sectionClassnames = Lib.THEME_CLASSES_PREFIX + "toolbar";
  if (pathRoot.indexOf('guide') !== -1) {
    return null;
  } else if (pathRoot === _.get(wpp, 'instance.settings.configuration.base_slug', '')) {
    let searchFilters = Util.getSearchFiltersFromURL(window.location.href, true);
    headerElement = <HeaderSearch front_page_post_content={front_page_post_content} openUserPanel={openUserPanel} searchFilters={searchFilters}/>;
    sectionClassnames += " " + Lib.THEME_CLASSES_PREFIX + "header-search px-3";

    if (saleTypesPanelOpen) {
      sectionClassnames += " " + Lib.THEME_CLASSES_PREFIX + "header-search-with-open-sale-types-panel";
    }
  } else if (pathRoot.indexOf(_.get(wpp, 'instance.settings.configuration.base_slug', '')) !== -1) {
    headerElement = <HeaderPropertiesSingle openUserPanel={openUserPanel}/>;
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
