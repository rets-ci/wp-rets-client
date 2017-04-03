import React from 'react';
import {connect} from 'react-redux';
import FeatureGroup from './../components/FeatureGroup.jsx';
import {Lib} from '../../../../lib.jsx';
import _ from 'lodash';

const DefaultLayout = ({item}) => {
  return (
    <div className={Lib.THEME_CLASSES_PREFIX+"widget-tour"}>
      <div className={`${Lib.THEME_CLASSES_PREFIX}headtitle text-center`}>
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
          <FeatureGroup featureGroup={featureGroup} ind={key} key={key} />
        )
      }
    </div>
  );
};

export default DefaultLayout;