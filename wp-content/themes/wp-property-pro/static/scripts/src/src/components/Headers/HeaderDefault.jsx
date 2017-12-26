import React from 'react';
import Navigation from './components/Navigation.jsx';

const HeaderDefault = ({ openUserPanel, openLoginModal }) => {
  return (
    <Navigation openUserPanel={openUserPanel} openLoginModal={openLoginModal}/>
  );
};
export default HeaderDefault;
