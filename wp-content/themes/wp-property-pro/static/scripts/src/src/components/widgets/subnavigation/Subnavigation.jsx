import React from 'react';
import {connect} from 'react-redux'
import _ from 'lodash'
import IconLayout from './layouts/IconLayout.jsx'
import TextLayout from './layouts/TextLayout.jsx'

const mapStateToProps = (state) => {
  return {
    currentUrl: _.get(state, 'postState.post.post_url', ''),
  }
};

const SubnavigationContent = ({widget_cell, currentUrl}) => {

  if (!widget_cell) {
    return null;
  }

  let items = _.get(widget_cell, 'widget.fields.menu_items', []);

  let container;
  let classes = "subnavigation";
  switch (widget_cell.widget.fields.layout) {
    case 'icon_layout':
      container = <IconLayout items={items} currentUrl={currentUrl}/>;
      break;
    case 'text_layout':
      classes = "subnavigation module2";
    default:
      container = <TextLayout items={items} currentUrl={currentUrl}/>
      break;
  }

  return (
    <section className={classes}>
      <div className="container">
        {container}
      </div>
    </section>
  );
};

const Subnavigation = connect(
  mapStateToProps
)(SubnavigationContent);

export default Subnavigation;