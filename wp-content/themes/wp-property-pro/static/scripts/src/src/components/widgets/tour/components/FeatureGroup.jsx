import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import Feature from './Feature.jsx';

const FeatureGroup = ({featureGroup, key}) => {

  let counter = 1;
  let featuresCount = _.get(featureGroup, 'features', []).length;

  let featureGroupBackgroundClasses = _.get(featureGroup, 'layout', null) === 'left' && _.get(featureGroup, 'background', null) !== 'full' ? "col-lg-7 push-lg-5 background" : "col-lg-7 background";
  let featureGroupContentClasses = _.get(featureGroup, 'layout', null) === 'left' ? "col-lg-6" : "col-lg-5 push-lg-7";

  let backgroundStyle = _.get(featureGroup, 'image_section.image_src', null) !== null
    ? {
      "background": "url(" + featureGroup.image_section.image_src + ")",
      "backgroundPosition": featureGroup.image_section.image_position
    }
    : {};

  if (_.get(featureGroup, 'background', null) === 'full') {
    backgroundStyle = Object.assign({}, backgroundStyle, {
      "backgroundSize": "cover",
      "minWidth": "100%",
    });
  }

  return (
    <section className="widget-box" key={key}>
      <div className="row no-gutters background-block">
        <div className={featureGroupBackgroundClasses} style={backgroundStyle}></div>
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
                      return (<Feature feature={feature} last={last} key={k}/>)
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