import React from 'react';
import TitleDescriptionLayout from './layouts/TitleDescriptionLayout.jsx';
import SubtitleTitleLayout from './layouts/SubtitleTitleLayout.jsx';
import BlogSingleLayout from './layouts/BlogSingleLayout.jsx'
import GuideLayout from './layouts/GuideLayout.jsx'
import GuideSingleLayout from './layouts/GuideSingleLayout.jsx'
import LocationModal from '../../Modals/LocationModal.jsx';
import {Lib} from '../../../lib.jsx';
import {get, isEmpty} from 'lodash';

const Masthead = ({closeLocationModal, widget_cell, returnToArchiveHandler, nextArticleHandler}) => {

  if (!widget_cell) {
    return null;
  }

  let headerStyle = {
    background: "rgba(0,0,0,.4) url(" + widget_cell.widget.fields.image_src + ") " + get(widget_cell, 'widget.fields.image_position', '') + " no-repeat"
  };

  let container;
  let modal;

  if (!isEmpty(get(widget_cell, 'widget.fields.search_options', {}))) {
    modal = <LocationModal closeModal={closeLocationModal} />;
  }

  switch (widget_cell.widget.fields.layout) {
    case 'subtitle_title_layout':
      container = <SubtitleTitleLayout widget_cell={widget_cell}/>;
      break;
    case 'blog_single_layout':
      container = <BlogSingleLayout widget_cell={widget_cell}/>;
      break;
    case 'guide_layout':
      return (
        <section className={Lib.THEME_CLASSES_PREFIX + "guide-masthead"} style={headerStyle}>
          <GuideLayout widget_cell={widget_cell}/>
        </section>
      );
      break;
    case 'guide_single_layout':
      return (
        <GuideSingleLayout widget_cell={widget_cell} headerStyle={headerStyle}
                           returnToArchiveHandler={returnToArchiveHandler} nextArticleHandler={nextArticleHandler}/>
      );
      break;
    case 'title_description_layout':
    default:
      container = <TitleDescriptionLayout widget_cell={widget_cell}/>;
      break;
  }

  return (
    <section className={`jumbotron ${Lib.THEME_CLASSES_PREFIX}masthead text-center`} style={headerStyle}>
      {modal}
      <div className="container">
        <div className="row">
          {container}
        </div>
      </div>
    </section>
  );
};

export default Masthead;
