import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

const DefaultLayout = ({items}) =>
  _.isEmpty(items)
    ? null
    :
    <div className="container">
      <ul className="clearfix">
        {items}
      </ul>
    </div>;


export default DefaultLayout;