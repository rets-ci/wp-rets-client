import React, { Component } from 'react';
import ContentLoader, { Rect, Circle } from 'react-content-loader';

import { Lib } from 'app_root/lib.jsx';


const Placeholder = () => {
  return (
    <div className={ `${Lib.THEME_CLASSES_PREFIX}headtitle ${Lib.THEME_CLASSES_PREFIX}content-placeholder` }>
      <h1 className={`${Lib.THEME_CLASSES_PREFIX}headtitle__title`}>
        <ContentLoader primaryColor={ '#8b8c8d' }>
          <Rect />
        </ContentLoader>
      </h1>
      <p className={`${Lib.THEME_CLASSES_PREFIX}headtitle__text`}>
        <ContentLoader primaryColor={ '#dcdcdc' }>
          <Rect />
        </ContentLoader>
      </p>
    </div>
  );
};

export default Placeholder;
