import React from 'react';
import { Link } from 'react-router-dom';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';


const TextItem = ({ item }) => {
  if (isEmpty(item)) {
    return null;
  } else {
    return (<Link to={get(item, 'relative_url', '/')}>{item.title}</Link>);
  }
}

export default TextItem;
