import React from 'react';
import Navigation from './components/Navigation.jsx';
import _ from 'lodash'

const HeaderDefault = ({openUserPanel}) => {

  return (
    <section className="toolbar">
      {
        _.get(bundle, 'template_url', null)
          ?
          <span className="menu-icon hidden-md-up" onClick={openUserPanel}>
          <img src={bundle.static_images_url + "menu-icon.svg"} alt="Menu icon" className="logo" />
        </span>
          : null
      }
      <div className="container-fluid">
        <Navigation openUserPanel={openUserPanel}/>
      </div>
    </section>
  );
};
export default HeaderDefault;