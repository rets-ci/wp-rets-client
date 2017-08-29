import {Lib} from '../../../../lib.jsx';
import React from 'react';
import _ from 'lodash';
import FeatureGroup from './../components/FeatureGroup.jsx';

const DefaultLayout = ({browserHistoryPush, formModalOpen, item, openFormModal}) => {
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
                <p>{item.subtitle}</p>
                : null
            }
          </div>
        </div>
      </div>

      {
        _.get(item, 'feature_groups', []).map((featureGroup, key) =>
          <FeatureGroup browserHistoryPush={browserHistoryPush} featureGroup={featureGroup} ind={key} openFormModal={openFormModal} key={key}/>
        )
      }
    </div>
  );
};

export default DefaultLayout;