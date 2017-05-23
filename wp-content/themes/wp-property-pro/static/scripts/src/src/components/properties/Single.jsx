import _ from 'lodash';
import {Lib} from '../../lib.jsx'
import React from 'react';
import renderHTML from 'react-render-html';

const Single = ({post}) => {

  return (
    <div className={Lib.THEME_CLASSES_PREFIX+"single-container"}>
      {
        _.get(post, 'output', null)
          ? renderHTML(_.get(post, 'output'))
          : null
      }
    </div>
  );
};

export default Single;