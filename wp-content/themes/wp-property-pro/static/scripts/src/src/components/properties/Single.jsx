import _ from 'lodash';
import React from 'react';
import renderHTML from 'react-render-html';

const Single = ({post}) => {

  console.log(_.get(post, 'output', null));

  return (
    <div>
      {
        _.get(post, 'output', null)
          ? renderHTML(_.get(post, 'output'))
          : null
      }
    </div>
  );
};

export default Single;