import React from 'react';
import Navigation from './components/Navigation.jsx';

const HeaderDefault = ({historyPush, openUserPanel, openLoginModal}) => {
  return (
    <Navigation historyPush={historyPush} openUserPanel={openUserPanel} openLoginModal={openLoginModal}/>
  );
};
export default HeaderDefault;
