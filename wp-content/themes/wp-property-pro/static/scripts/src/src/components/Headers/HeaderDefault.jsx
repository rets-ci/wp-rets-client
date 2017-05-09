import React from 'react';
import Navigation from './components/Navigation.jsx';

const HeaderDefault = ({openUserPanel}) => {
  return (
    <Navigation openUserPanel={openUserPanel}/>
  );
};
export default HeaderDefault;
