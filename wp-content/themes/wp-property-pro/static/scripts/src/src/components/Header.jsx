import React from 'react';
import {connect} from 'react-redux'
import Navigation from './Navigation.jsx';
import Masthead from './Masthead.jsx'

const mapStateToProps = (state) => {
    return {
        rows: state.postState.rows
    }
};

const HeaderContent = ({rows}) => {

    return (
        <header className="pageheader">
            <div className="intro-wrap">
                <div className="container-fluid">
                    <Navigation />
                    <Masthead rows={rows}/>
                </div>
            </div>
        </header>
    );
};

const Header = connect(
    mapStateToProps
)(HeaderContent);

export default Header;