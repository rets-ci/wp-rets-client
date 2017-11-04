import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import { Lib } from 'app_root/lib.jsx';

const Masonry = require('react-masonry-component');


function showContentValue(data, dataReference) {
  if (typeof dataReference !== 'function') {
    console.log(dataReference + ' is not a function');
    // TODO: TEMP solution until everything is changed to function
    return "old style value";
  } else {
    let value = dataReference(data);
    if (typeof value === 'object') {
      // this should never happen
      console.log(dataReference + ' needs to be fixed');
      return 'Obj';
    } else if (!value) {
      return 'N/A';
    } else {
      return value;
    }
  }
}

function getContent(items, data) {
  let contentElements = items.sort((a, b) => a.order - b.order).map((c, i) => {
    return ['N/A', '0'].indexOf(showContentValue(data, c.value)) < 0 ?
      <li key={JSON.stringify(c)}>
        <span>{c.name}:</span> {showContentValue(data, c.value)}
      </li>
      : null;
  });
  return contentElements;
}


class AttributeTabSingle extends Component {

  render() {
    let { content, esProperty } = this.props;
    let elements = [];
    let visibleTabs = {};

    let masonryOptions = {
      horizontalOrder: true,
      itemSelector: `.${Lib.THEME_CLASSES_PREFIX}property-single-div`,
      percentPosition: true,
      // columnWidth: 200,
      gutter: 10,
      transitionDuration: 0
    };
    let itemClasses = [`${Lib.THEME_CLASSES_PREFIX}property-single-div`];
    itemClasses.push((content.children.length % 2 === 0) ? `${Lib.THEME_CLASSES_PREFIX}property-single-div-50` : `${Lib.THEME_CLASSES_PREFIX}property-single-div-30`)
    return (
      <Masonry
        className={'my-masonry-div'}
        elementType={'div'}
        options={masonryOptions}
        disableImagesLoaded={false}
        updateOnEachImageLoad={false}
      >
      {content.children.sort((a, b) => a.order - b.order).map(c =>
        <div className={itemClasses.join(' ')} key={`key-${c.name}`}>
          <h3>{c.name}</h3>
          <ul className={`${Lib.THEME_CLASSES_PREFIX}details-list`}>
            {getContent(c.items, esProperty)}
          </ul>
        </div>
      )}
      </Masonry>
    );
  }
}

AttributeTabSingle.propTypes = {
  content: PropTypes.object.isRequired,
  esProperty: PropTypes.object
};

export default AttributeTabSingle;