import {Lib} from '../../../../lib.jsx';
import React from 'react';
import get from 'lodash/get';
import FeatureGroup from './../components/FeatureGroup.jsx';
import renderHTML from 'react-render-html';

const DefaultLayout = ({browserHistoryPush, formModalOpen, item, openFormModal}) => {
  return (
    <div className={Lib.THEME_CLASSES_PREFIX + "widget-tour"}>
      <div className="container-fluid">
        <div className="row">
          <div className={`${Lib.THEME_CLASSES_PREFIX}headtitle col-12 text-center`}>
            {
              get(item, 'title', null)
                ?
                <h2>{renderHTML(item.title)}</h2>
                : null
            }
            {
              get(item, 'subtitle', null)
                ?
                <p>{renderHTML(item.subtitle)}</p>
                : null
            }
          </div>
        </div>
      </div>

      {
        get(item, 'feature_groups', []).map((featureGroup, key) =>
          <FeatureGroup browserHistoryPush={browserHistoryPush} featureGroup={featureGroup} ind={key} openFormModal={openFormModal} key={key}/>
        )
      }
    </div>
  );
};

export default DefaultLayout;