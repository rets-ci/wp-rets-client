import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Masonry from 'react-masonry-component';
import get from 'lodash/get';

import { Lib } from 'app_root/lib.jsx';


function showContentValue(data, dataReference) {
  if (typeof dataReference !== 'function') {
    // console.log(dataReference + ' is not a function');
    // TODO: TEMP solution until everything is changed to function
    return "old style value";
  } else {
    let value = dataReference(data);
    if (value === null) {
      // console.log(dataReference + ' is null');
      return null;
    } else if (value === false) {
      return "No";
    } else {
      return value;
    }
  }
}

function getContent(items, data) {
  let contentElements = items.sort((a, b) => a.order - b.order).map((c, i) => {
    //TODO: Remove these console.logs before going live, these are meant for development only
    // console.log('name: ', c.name);
    // console.log('value: ', showContentValue(data, c.value));
    // console.log('-------------------');
    return [null].indexOf(showContentValue(data, c.value)) < 0 ?
      <div key={JSON.stringify(c)}>
        <span>{c.name}: </span>
        <span>{showContentValue(data, c.value)}</span>
      </div>
      : null;
  });
  return contentElements;
}


class AttributeTabSingle extends Component {

  render() {
    let { content, esProperty, isOneColumn } = this.props;
    let elements = [];
    let visibleTabs = {};
    let masonryOptions = {
      horizontalOrder: true,
      itemSelector: `.${Lib.THEME_CLASSES_PREFIX}attr-group`,
      percentPosition: true,
      gutter: 48,
      transitionDuration: 0
    };

    let items = [];
    content.children.sort((a, b) => a.order - b.order).forEach(d => {
      let item = {};
      item['category'] = d.name;
      let insideContent = getContent(d.items, esProperty);
      item['insideContent'] = insideContent;
      // check to see at least some of the items are not null
      if (insideContent.some(d => d !== null)) {
        items.push(item);
      }
    });

    let itemClasses = [`${Lib.THEME_CLASSES_PREFIX}attr-group`];
    if (!isOneColumn) {
      itemClasses.push(`${Lib.THEME_CLASSES_PREFIX}attr-group-50`);
    }

    return (
      <Masonry
        className={'my-masonry-div'}
        elementType={'div'}
        options={masonryOptions}
        disableImagesLoaded={false}
        updateOnEachImageLoad={false}
      >
      {items.map(c =>
        <div className={itemClasses.join(' ')} key={`key-${c.category}`}>
          <div className={ `${Lib.THEME_CLASSES_PREFIX}attr-group-title` }>{ c.category }</div>
          <div className={ `${Lib.THEME_CLASSES_PREFIX}attr-group-content` }>
            { c.insideContent }
          </div>
        </div>
      )}
      </Masonry>
    );
  }
}

AttributeTabSingle.propTypes = {
  content: PropTypes.object.isRequired,
  esProperty: PropTypes.object,
  isOneColumn: PropTypes.bool.isRequired,
};

export default AttributeTabSingle;