import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import FeatureGroup from './../components/FeatureGroup.jsx';

const DefaultLayout = ({item}) => {
  return (
    <div className="widget-tour">
      <div className="headtitle text-center">
        <div className="container">
          {
            _.get(item, 'title', null)
              ?
              <h2>{item.title}</h2>
              : null
          }
          {
            _.get(item, 'subtitle', null)
              ?
              <p>{item.subtitle}</p>
              : null
          }
        </div>
      </div>
      {
        _.get(item, 'feature_groups', []).map((featureGroup, key) =>
          <FeatureGroup featureGroup={featureGroup} key={key} />
        )
      }
    </div>
  );
};

export default DefaultLayout;