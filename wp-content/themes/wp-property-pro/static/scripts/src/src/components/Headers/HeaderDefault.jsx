import {Lib} from '../../lib.jsx';
import React from 'react';
import Navigation from './components/Navigation.jsx';

const HeaderDefault = ({openUserPanel}) => {
  return (
    <section className={Lib.THEME_CLASSES_PREFIX + "toolbar"}>
      <Navigation openUserPanel={openUserPanel}/>
    </section>
  );
};
export default HeaderDefault;
