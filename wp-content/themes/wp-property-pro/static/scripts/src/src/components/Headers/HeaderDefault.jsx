import React from 'react';
import Navigation from './components/Navigation.jsx';
import {Lib} from '../../lib.jsx';
import _ from 'lodash';

const HeaderDefault = ({openUserPanel}) => {

  return (
    <section className={Lib.THEME_CLASSES_PREFIX+"toolbar"}>
      {
        _.get(bundle, 'template_url', null)
          ?
          <span className={`${Lib.THEME_CLASSES_PREFIX}menu-icon hidden-md-up`} onClick={openUserPanel}>
          <img src={bundle.static_images_url + "menu-icon.svg"} alt="Menu icon" className={Lib.THEME_CLASSES_PREFIX+"logo"}/>
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