import React from 'react';
import Navigation from './components/Navigation.jsx';
import _ from 'lodash'

const HeaderDefault = ({openUserPanel}) => {

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
export default HeaderDefault;