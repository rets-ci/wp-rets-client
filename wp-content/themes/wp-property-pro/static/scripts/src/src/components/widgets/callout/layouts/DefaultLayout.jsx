import React from 'react';
import {Lib} from '../../../../lib.jsx';
import {get} from 'lodash';
import Util from '../../../Util.jsx';

const DefaultLayout = ({item, openFormModal}) => {
  let formModalId = get(item, 'button.css_class', null) ? Util.getFormModalIdFromCSSClass(item.button.css_class.split(' ')) : null;
  return (
    <div className="container">
      <div className="row">
        <div className={`${Lib.THEME_CLASSES_PREFIX}callout-container mx-auto`}>
          <nav className="navbar navbar-toggleable-md">
            <div className={Lib.THEME_CLASSES_PREFIX + "callout-items"}>
              {
                get(item, 'title', null)
                  ?
                  <p className="navbar-brand mr-auto my-auto">{item.title}</p>
                  : null
              }
              {
                get(item, 'button.label', null)
                  ?
                  <ul className="navbar-nav">
                    <li>
                      <a
                        href="#"
                        onClick={formModalId ? ((event) => { event.preventDefault(); openFormModal(formModalId, true)}) : null}
                         className={`btn ${Lib.THEME_CLASSES_PREFIX}btn-contact`}>{item.button.label}</a>
                    </li>
                  </ul>
                  : null
              }
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;