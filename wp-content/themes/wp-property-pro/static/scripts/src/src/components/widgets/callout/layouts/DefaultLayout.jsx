import React from 'react';
import {connect} from 'react-redux'

const DefaultLayout = ({item}) => {
  return (
    <div className="container">
      <p>{item.title}</p> <a href={item.button.url} className="btn btn-contact">{item.button.label}</a>
    </div>
  );
};

export default DefaultLayout;