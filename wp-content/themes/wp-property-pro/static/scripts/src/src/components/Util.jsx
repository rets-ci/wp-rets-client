import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {Lib} from '../lib.jsx'
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

  static es_geo_bounding_box_obj_format(params) {
    let {
      sw,
      ne
    } = params;
    let coors = {
      topLeft: {
        lat: sw.lat,
        lon: ne.lon
      },
      bottomRight: {
        lat: ne.lat,
        lon: sw.lon
      }
    };
    return coors;
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
}

export default Util;
