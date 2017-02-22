import React from 'react';
import Navigation from './Navigation.jsx';

const Header = () => {

    return (
        <header className="pageheader">
            <div className="container-fluid">
                <Navigation />
            </div>
        </header>
    );
};

export default Header;