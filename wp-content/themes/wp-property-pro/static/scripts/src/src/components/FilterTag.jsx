import {Lib} from '../lib.jsx';
import React from 'react';

const FilterTag = ({handleRemoveFilter, display, value}) => (
  <span className={`${Lib.THEME_CLASSES_PREFIX}tag badge badge-default`}>
    <span>
      <i className="fa fa-times" onClick={() => handleRemoveFilter(value)}></i>
    </span>
    {display}
  </span>
);

export default FilterTag;
