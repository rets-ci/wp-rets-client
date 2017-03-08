import React from 'react';
import {connect} from 'react-redux'
import {setUserData} from '../actions/index.jsx';
import HeaderDefault from './Headers/HeaderDefault.jsx'
import HeaderSearch from './Headers/HeaderSearch.jsx'
import _ from 'lodash'

const mapStateToProps = (state) => {
  return {
    post: _.get(state, 'postState.post', {}),
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

const HeaderContent = ({post, openUserPanel}) => {
  if(_.get(post, 'propertypro_toolbar_layout', null) !== null || _.replace(location.pathname, '/', '') === _.get(wpp, 'instance.settings.configuration.base_slug', '')){
    return (
      <HeaderSearch openUserPanel={openUserPanel} />
    );
  }

  return (
    <HeaderDefault openUserPanel={openUserPanel} />
  );
};

const Header = connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderContent);

export default Header;