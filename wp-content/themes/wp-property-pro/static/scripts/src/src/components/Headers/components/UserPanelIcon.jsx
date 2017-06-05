import React from 'react';
import {Lib} from '../../../lib.jsx';

const UserPanelIcon = ({openUserPanel}) => (
  <a
    href="#"
    onClick={openUserPanel}
    className={Lib.THEME_CLASSES_PREFIX + "side-navigation"}
    >
      <span className={`${Lib.THEME_CLASSES_PREFIX}navbar-navigation-icon`}>☰</span>
  </a>
);

export default UserPanelIcon;