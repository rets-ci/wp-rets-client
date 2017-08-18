import React from 'react';
import Feature from './Feature.jsx';
import {Lib} from '../../../../lib.jsx';
import _ from 'lodash';

const FeatureGroup = ({browserHistoryPush, featureGroup, ind, openFormModal}) => {

  let counter = 1;
  const featuresCount = _.get(featureGroup, 'features', []).length;
  const backgroundPosition = _.get(featureGroup, 'layout', null)
  const backgroundSize = _.get(featureGroup, 'background', null)

  let featureGroupBackgroundClasses = backgroundPosition === 'left' && backgroundSize !== 'full' ? `col-lg-7 push-lg-5` : `col-lg-7`;
  featureGroupBackgroundClasses += ` ${Lib.THEME_CLASSES_PREFIX}background-block p-0`;
  if (backgroundSize === 'full') {
    featureGroupBackgroundClasses += ` ${Lib.THEME_CLASSES_PREFIX}background-block-full`;
  }

  let featureGroupContentClasses = backgroundPosition === 'left' ? "col-lg-6" : "col-lg-6 push-lg-6";
  let backgroundStyle = _.get(featureGroup, 'image_section.image_src', null) !== null
    ? {
      "background": "url(" + featureGroup.image_section.image_src + ")",
      "backgroundPosition": featureGroup.image_section.image_position,
      "backgroundSize": "cover"
    }
    : {};


  return (
    <section className={Lib.THEME_CLASSES_PREFIX + "widget-box"} key={ind}>
      <div className="container-fluid">
        <div className="row">
          <div className={featureGroupBackgroundClasses}>
            <div className={Lib.THEME_CLASSES_PREFIX + "background"} style={backgroundStyle}></div>
          </div>
          <div className={Lib.THEME_CLASSES_PREFIX + "widget-inner"}>
            <div className="container">
              <div className="row no-gutters">
                <div className={featureGroupContentClasses}>
                  <div className={Lib.THEME_CLASSES_PREFIX + "tour-widget-content"}>
                    {
                      _.get(featureGroup, 'features', []).map((feature, k) => {
                          let last = featuresCount === counter;
                          counter++;
                          return (<Feature browserHistoryPush={browserHistoryPush} feature={feature} last={last} openFormModal={openFormModal} ind={k} key={k}/>)
                        }
                      )
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureGroup;