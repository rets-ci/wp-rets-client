import get from 'lodash/get';
import {Lib} from '../../../../lib.jsx';
import React from 'react';
import renderHTML from 'react-render-html';
import Util from '../../../Util.jsx';

const DefaultLayout = ({item, openFormModal}) => {
  let formModalId = get(item, 'button.css_class', null) ? Util.getFormModalIdFromCSSClass(item.button.css_class.split(' ')) : null;
  return (
    <div className="container">
      <div className="row">
        <div className={`${Lib.THEME_CLASSES_PREFIX}callout-container col-12`}>
          { get(item, 'title', null) &&
            <div className={`${Lib.THEME_CLASSES_PREFIX}callout-title`}>{renderHTML(item.title)}</div>
          }
          { get(item, 'button.label', null) &&
            <a
              href="#"
              onClick={formModalId ? ((event) => { event.preventDefault(); openFormModal(formModalId, true)}) : null}
              className={`${Lib.THEME_CLASSES_PREFIX}callout-button btn`}
            >
              {item.button.label}
            </a>
          }
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;