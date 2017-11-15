import React from 'react';
import Search from '../components/Search.jsx';
import {Lib} from '../../../../lib.jsx';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

const TitleDescriptionLayout = ({title, searchOptions, subtitle}) => {
  return (
    <div className={`${Lib.THEME_CLASSES_PREFIX}masthead-container mx-auto`}>
      {
        title
          ? <h1 className={`${Lib.THEME_CLASSES_PREFIX}masthead-title`}>{title}</h1>
          : null
      }
      {
        subtitle
          ? <p
            className={`${Lib.THEME_CLASSES_PREFIX}masthead-subtitle hidden-sm-down`}>{subtitle}</p>
          : null
      }
      <Search options={searchOptions ? (isEmpty(searchOptions) ? {} : searchOptions) : {}}/>
    </div>
  )
    ;
};

export default TitleDescriptionLayout;