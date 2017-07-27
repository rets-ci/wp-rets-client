import React from 'react';
import {connect} from 'react-redux';
import FeatureGroup from './../components/FeatureGroup.jsx';
import {Lib} from '../../../../lib.jsx';
import _ from 'lodash';

const DefaultLayout = ({item}) => {
  return (
    <div className={Lib.THEME_CLASSES_PREFIX + "widget-tour"}>
      <div className="container-fluid">
        <div className="row">
          <div className={`${Lib.THEME_CLASSES_PREFIX}headtitle mx-auto text-center`}>
            {
              _.get(item, 'title', null)
                ?
                <h2>{item.title}</h2>
                : null
            }
            {
              _.get(item, 'subtitle', null)
                ?
                <p className={`${Lib.THEME_CLASSES_PREFIX}padded-on-desktop`}>{item.subtitle}</p>
                : null
            }
          </div>
          {
            _.get(item, 'feature_groups', []).map((featureGroup, key) =>
              <FeatureGroup featureGroup={featureGroup} ind={key} key={key}/>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;