import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import Feature from './Feature.jsx';

const FeatureGroup = ({featureGroup, key}) => {

  let counter = 1;
  let featuresCount = _.get(featureGroup, 'features', []).length;

  let widgetBoxClasses = _.get(featureGroup, 'background', null) === 'full' ? "widget-box widget-bg widget2" : "widget-box";
  let featureGroupBackgroundClasses = _.get(featureGroup, 'layout', null) === 'left' ? "col-lg-7 push-lg-5" : "col-lg-7";
  let featureGroupContentClasses = _.get(featureGroup, 'layout', null) === 'left' ? "col-lg-6" : "col-lg-5 push-lg-7";

  return (
    <section className={widgetBoxClasses} key={key}>
      <div className="row no-gutters">
        <div className={featureGroupBackgroundClasses}>
          {
            _.get(featureGroup, 'image_section.image_src', null)
              ? <img src={featureGroup.image_section.image_src} alt="" className="img-fluid" />
              : null
          }
        </div>
      </div>
      <div className="widget-inner">
        <div className="container">
          <div className="row no-gutters">
            <div className={featureGroupContentClasses}>
              <div className="tour-widget-content">
                {
                  _.get(featureGroup, 'features', []).map((feature, k) => {
                      let last = featuresCount === counter;
                      counter++;
                      return (<Feature feature={feature} last={last} key={k} />)
                    }
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureGroup;