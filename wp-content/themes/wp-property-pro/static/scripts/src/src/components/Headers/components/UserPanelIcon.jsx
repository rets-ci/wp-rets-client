import React from 'react';
import {Lib} from '../../../lib.jsx';

const UserPanelIcon = ({openUserPanel}) => (
  <a
    href="#"
    onClick={(event) => {event.preventDefault(); openUserPanel()}}
    className={`${Lib.THEME_CLASSES_PREFIX}side-navigation`}
    >
      <span className={`${Lib.THEME_CLASSES_PREFIX}navbar-navigation-icon fa fa-bars`}></span>
  </a>
);

export default UserPanelIcon;