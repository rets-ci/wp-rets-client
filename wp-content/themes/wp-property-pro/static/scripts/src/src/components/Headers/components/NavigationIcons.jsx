import React from 'react';
import UserPanelIcon from './UserPanelIcon.jsx';

const NavigationIcons = ({openUserPanel}) => (
  <ul>
    {/*<li className="hidden-sm-down col-4">
      <a href="#" title="Favorites" className={Lib.THEME_CLASSES_PREFIX + "favorite"}>
        <i className={`fa fa-heart ${Lib.THEME_CLASSES_PREFIX}navbar-navigation-icon`}></i>
      </a>
    </li>*/}
    {/*<li className="col-4">
      <a href="#" title="Notification" className={Lib.THEME_CLASSES_PREFIX + "notification"}>
        <i className={`fa fa-bell ${Lib.THEME_CLASSES_PREFIX}navbar-navigation-icon`}></i> 
        <span className={`${Lib.THEME_CLASSES_PREFIX}indicator`}>
          <i className="fa fa-circle"></i>
        </span>
      </a>
    </li>*/}
    <li className="hidden-sm-down">
      <UserPanelIcon openUserPanel={openUserPanel} />
    </li>
  </ul>
);

export default  NavigationIcons;