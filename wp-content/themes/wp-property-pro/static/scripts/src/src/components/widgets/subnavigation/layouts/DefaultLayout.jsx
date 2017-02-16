import React from 'react';
import {connect} from 'react-redux'

const DefaultLayout = ({items}) => {
    return (
        <div className="container">
            <ul className="clearfix">
                {items}
            </ul>
        </div>
    );
};

export default DefaultLayout;