import React from 'react';
import {render} from 'react-dom';
import {browserHistory} from 'react-router';
import {Provider} from 'react-redux';
import URI from 'urijs';
import qs from 'qs';
import {Lib} from '../lib.jsx';
import _ from 'lodash';

class Util extends React.Component {

  static getSearchFiltersFromURL(url) {
    let uri = new URI(url);
    let query = qs.parse(uri.query());

    return !_.isEmpty(query) ? _.get(query, Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX, {}) : {};
  }

  static getThumbnailUrlBySize(thumbnailUrl = '', size = Lib.PROPERTY_LISTING_IMAGE_SIZE) {
    let urlArray = _.split(thumbnailUrl, Lib.URL_DELIMITER);
    let fileName = !_.isEmpty(urlArray) ? _.last(urlArray) : '';
    let fileNameArray = _.split(fileName, Lib.EXTENSION_DELIMITER)

    if (_.isEmpty(fileNameArray)) {
      return '';
    }

    let fileNameWithSize = _.join([
      fileNameArray[0],
      size
    ], Lib.STRING_ARRAY_DELIMITER);

    let newFileName = _.join([
        fileNameWithSize,
        fileNameArray[1]
      ],
      Lib.EXTENSION_DELIMITER);

    return _.replace(thumbnailUrl, fileName, newFileName);
  }

  static esGeoBoundingBoxObjFormat(params) {
    let {
      sw,
      ne
    } = params;
    return {
      topLeft: {
        lat: ne.lat,
        lon: sw.lon
      },
      bottomRight: {
        lat: sw.lat,
        lon: ne.lon
      }
    };
  }

  static goToUrl(url) {

    if (_.isEmpty(url)) {
      return null;
    }

    browserHistory.push(url);
  }

  static removeQueryFromURL(currentUrl, key, value) {
    let uri = new URI(currentUrl);
    uri.removeSearch({[key]: value});
    return uri.pathname() + uri.search();
  }
}

export default Util;
