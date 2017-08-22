import {Lib} from '../../../lib.jsx';
import React, { Component } from 'react';

function PropertySingleDataDiv ({data, head, content}) {
  return <div className={`${Lib.THEME_CLASSES_PREFIX}property-single-div`} key={head + JSON.stringify(content)}>
    <h3>{head}</h3>
    <ul>
      {content.map(c =>
        <li key={JSON.stringify(c)}>
          <span className={`${Lib.THEME_CLASSES_PREFIX}item-name`}>{c.name}:</span> {c.value ? _.get(data, c.value) : 'N/A'}
        </li>
      )}
    </ul>
  </div>
}

export default PropertySingleDataDiv;