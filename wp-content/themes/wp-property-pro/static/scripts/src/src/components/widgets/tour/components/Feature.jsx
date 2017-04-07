import React from 'react';
import {connect} from 'react-redux';
import {Lib} from '../../../../lib.jsx';
import _ from 'lodash';

const Feature = ({feature, last, ind}) => {
  return (
    <div key={ind}>
      {
        _.get(feature, 'title', null)
          ? <h3>{feature.title}</h3>
          : null
      }
      {
        _.get(feature, 'description', null)
          ? <p>{feature.description}</p>
          : null
      }
      {
        _.get(feature, 'button_section.label', null) && _.get(feature, 'button_section.url', null)
          ? <a href={feature.button_section.url} className={`btn btn-primary ${Lib.THEME_CLASSES_PREFIX}tour-widget-content-button`}>{feature.button_section.label}</a>
          : null
      }
      {
        _.get(feature, 'testimonial_section.review', null)
          ? <blockquote>
            {
              _.get(feature, 'testimonial_section.review', null)
                ? <p>{feature.testimonial_section.review}</p>
                : null
            }
            <cite className="clearfix">
              {
                _.get(feature, 'testimonial_section.image_src', null)
                  ? <span><img src={feature.testimonial_section.image_src}
                               alt={_.get(feature, 'testimonial_section.name', '')}/></span>
                  : null
              }
              {
                _.get(feature, 'testimonial_section.name', null)
                  ? <h5>{feature.testimonial_section.name}</h5>
                  : null
              }
              {
                _.get(feature, 'testimonial_section.location', null)
                  ? <p>{feature.testimonial_section.location}</p>
                  : null
              }
            </cite>
          </blockquote>
          : null
      }

      {
        last
          ? null
          : <hr />
      }
    </div>

  );
};

export default Feature;