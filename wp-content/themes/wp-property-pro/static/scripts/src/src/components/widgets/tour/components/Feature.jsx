import React from 'react';
import {Lib} from '../../../../lib.jsx';
import renderHTML from 'react-render-html';
import {get} from 'lodash';
import Util from '../../../Util.jsx';

const Feature = ({browserHistoryPush, feature, last, openFormModal, ind}) => {
  let formModalId = get(feature, 'button_section.css_class', null) ? Util.getFormModalIdFromCSSClass(feature.button_section.css_class.split(' ')) : null;
  let mainLinkOnClick = formModalId ? ((event) => { event.preventDefault(); openFormModal(formModalId, true)}) : ((event) => {event.preventDefault(); browserHistoryPush(feature.button_section.url); });
  return (
    <div className={Lib.THEME_CLASSES_PREFIX+"tour-widget-content-container"} key={ind}>
      {
        get(feature, 'title', null)
          ? <h3>{feature.title}</h3>
          : null
      }
      {
        get(feature, 'description', null)
          ? <p>{renderHTML(feature.description)}</p>
          : null
      }
      {
        get(feature, 'button_section.label', null) && get(feature, 'button_section.url', null)
          ? <a href="#" onClick={mainLinkOnClick} className={`btn btn-primary ${Lib.THEME_CLASSES_PREFIX}tour-widget-content-button`}>{feature.button_section.label}</a>
          : null
      }
      {
        get(feature, 'testimonial_section.review', null)
          ? <blockquote>
            {
              get(feature, 'testimonial_section.review', null)
                ? <p>{feature.testimonial_section.review}</p>
                : null
            }
            <cite className="clearfix">
              {
                get(feature, 'testimonial_section.image_src', null)
                  ? <span><img className="rounded-circle" src={feature.testimonial_section.image_src}
                               alt={get(feature, 'testimonial_section.name', '')}/></span>
                  : null
              }
              {
                get(feature, 'testimonial_section.name', null)
                  ? <h5>{feature.testimonial_section.name}</h5>
                  : null
              }
              {
                get(feature, 'testimonial_section.location', null)
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