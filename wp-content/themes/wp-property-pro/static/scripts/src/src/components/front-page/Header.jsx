import React from 'react';
import Navigation from './Navigation.jsx';
import {connect} from 'react-redux'
import {setUserData} from '../../actions/index.jsx';
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

const HeaderContent = ({openUserPanel}) => {

  return (
    <header className="pageheader">
      {
        _.get(bundle, 'template_url', null)
        ?
        <span className="menu-icon hidden-md-up" onClick={openUserPanel}>
          <img src={bundle.template_url + "/static/images/src/menu-icon.svg"} alt="Menu icon"/>
        </span>
        : null
      }
      <div className="container-fluid">
        <Navigation openUserPanel={openUserPanel}/>
      </div>
    </header>
  );
};

const Header = connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderContent);

export default Header;