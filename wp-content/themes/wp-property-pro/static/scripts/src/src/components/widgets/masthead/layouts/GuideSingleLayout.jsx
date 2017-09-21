import React from 'react';
import {Lib} from '../../../../lib.jsx';
import {get} from 'lodash';

const GuideSingleLayout = ({widget_cell, headerStyle, returnToArchiveHandler, nextArticleHandler}) => {

  let prevLinkText = 'Return to Guide';
  let nextLinkText = 'Next Article';

  if (window.innerWidth < Lib.MOBILE_WIDTH) {
    prevLinkText = 'Guide';
    nextLinkText = 'Next';
  }

  return (
    <section className={Lib.THEME_CLASSES_PREFIX + "article-masthead"} style={headerStyle}>
      <header className={Lib.THEME_CLASSES_PREFIX + "article-header"}>
        <div className={`${Lib.THEME_CLASSES_PREFIX}article-header-container mx-auto text-center`}>
          {
            get(widget_cell, 'widget.fields.title', '')
              ? <h1 className={`${Lib.THEME_CLASSES_PREFIX}guide-title`}>{widget_cell.widget.fields.title}</h1>
              : null
          }
          {
            get(widget_cell, 'widget.fields.subtitle', '')
              ? <p className={`hidden-xs-down ${Lib.THEME_CLASSES_PREFIX}article-excerpt`}>{widget_cell.widget.fields.subtitle}</p>
              : null
          }
        </div>
      </header>

      <nav className={`navbar navbar-toggleable-md ${Lib.THEME_CLASSES_PREFIX}guide-navigation`}>
        <div className={`${Lib.THEME_CLASSES_PREFIX}navigation-items`}>
          <ul className={`navbar-nav ${Lib.THEME_CLASSES_PREFIX}guide-navigation-cotrols`}>
            <li className={`${Lib.THEME_CLASSES_PREFIX}nav-item-prev text-center`}>
              <a href="#" onClick={(eve) => {
                eve.preventDefault();
                returnToArchiveHandler();
              }}>
                <fa className="fa fa-arrow-left"></fa>
                {prevLinkText}
              </a>
            </li>
            <li className={`${Lib.THEME_CLASSES_PREFIX}nav-item-next text-center`}>
              <a href="#" onClick={(eve) => {
                eve.preventDefault();
                nextArticleHandler();
              }}>
                {nextLinkText}
                <fa className="fa fa-arrow-right"></fa>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </section>
  );
};

export default GuideSingleLayout;