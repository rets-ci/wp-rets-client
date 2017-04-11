import React from 'react';
import {connect} from 'react-redux';
import TitleDescriptionLayout from './layouts/TitleDescriptionLayout.jsx';
import SubtitleTitleLayout from './layouts/SubtitleTitleLayout.jsx';
import BlogSingleLayout from './layouts/BlogSingleLayout.jsx'
import GuideLayout from './layouts/GuideLayout.jsx'
import GuideSingleLayout from './layouts/GuideSingleLayout.jsx'
import Modal from './components/Modal.jsx';
import {Lib} from '../../../lib.jsx';
import _ from 'lodash';

const mapStateToProps = (state) => {
  return {
    open: state.locationModal ? state.locationModal.open : false
  }
};

const MastheadContent = ({widget_cell, open, returnToArchiveHandler, nextArticleHandler}) => {

  if (!widget_cell) {
    return null;
  }

  let headerStyle = {
    background: "rgba(0,0,0,.4) url(" + widget_cell.widget.fields.image_src + ") " + _.get(widget_cell, 'widget.fields.image_position', '') + " no-repeat"
  };

  if (open) {
    headerStyle = Object.assign(headerStyle, {
      zIndex: "11"
    });
  }

  let container;
  let modal;

  if (!_.isEmpty(_.get(widget_cell, 'widget.fields.search_options', {}))) {
    modal = <Modal />;
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
          <GuideLayout widget_cell={widget_cell} />
        </section>
      );
      break;
    case 'guide_single_layout':
      return (
        <GuideSingleLayout widget_cell={widget_cell} headerStyle={headerStyle} returnToArchiveHandler={returnToArchiveHandler} nextArticleHandler={nextArticleHandler} />
      );
      break;
    case 'title_description_layout':
    default:
      container = <TitleDescriptionLayout widget_cell={widget_cell}/>;
      break;
  }

  return (
    <section className={`jumbotron ${Lib.THEME_CLASSES_PREFIX}masthead`} style={headerStyle}>
      {modal}
      {container}
    </section>
  );
};

const Masthead = connect(
  mapStateToProps
)(MastheadContent);

export default Masthead;
