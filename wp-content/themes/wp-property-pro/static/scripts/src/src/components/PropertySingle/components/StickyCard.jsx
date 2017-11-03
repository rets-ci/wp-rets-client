import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sticky from 'react-sticky-state';

import { Lib } from 'app_root/lib.jsx';


const StickyCard = ({ fromMapView }) => {
  return (
    <Sticky>
      <div className="container sticky sticky-at-top"><div className="row"><div className="col-lg-8">
        <h3>Sticky Content</h3>
      </div></div></div>
    </Sticky>
  );
};

StickyCard.propTypes = {
}

export default StickyCard;