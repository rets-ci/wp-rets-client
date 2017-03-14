import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {Lib} from '../lib.jsx'
import {browserHistory} from 'react-router';
import _ from 'lodash'


class Util extends React.Component {

  static stringStyleToObject(stringStyle) {

    let style = {};
    let styleArray = stringStyle.split("\n");

    for (let i in styleArray) {
      let styleRow = styleArray[i].split(":");
      let styleRowObject = {};
      styleRowObject[styleRow[0]] = styleRow[1];
      style = Object.assign({}, style, styleRowObject);
    }

    return style;
  }

  static getThumbnailUrlBySize(thumbnailUrl, size) {
    let urlArray = _.split(thumbnailUrl, Lib.URL_DELIMITER);
    let fileName = _.last(urlArray);
    let fileNameArray = _.split(fileName, Lib.EXTENSION_DELIMITER)

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

  static getPageContent(url, callback){

    jQuery.ajax({
      url: url,
      type: 'get',
      data: {
        pageType: 'json'
      },
      dataType: 'json',
      success: function (data) {
       callback(data);
      }
    });

  }

  static goToUrl(url){

    if(_.isEmpty(url)){
      return null;
    }

    browserHistory.push(url);
  }
}

export default Util;
