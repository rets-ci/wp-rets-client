import PropTypes from 'prop-types';
import React, {Component} from 'react';

function PropertyInfoTabs(props) {
  return <div className="card text-center mb-4">
    <div className="card-header">
      <ul className="nav nav-tabs card-header-tabs">
        <li className="nav-item">
          <a className="nav-link active" href="#">Active</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Link</a>
        </li>
        <li className="nav-item">
          <a className="nav-link disabled" href="#">Disabled</a>
        </li>
      </ul>
    </div>
    <div className="card-block">
      <h4 className="card-title">Special title treatment</h4>
      <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
      <a href="#" className="btn btn-primary">Go somewhere</a>
    </div>
  </div>;
}

export default PropertyInfoTabs;