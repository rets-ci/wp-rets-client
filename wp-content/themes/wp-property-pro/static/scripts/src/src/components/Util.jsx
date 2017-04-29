import numeral from 'numeral';
import React from 'react';
import {render} from 'react-dom';
import {browserHistory} from 'react-router';
import {Provider} from 'react-redux';
import URI from 'urijs';
import qs from 'qs';
import {Lib} from '../lib.jsx';
import _ from 'lodash';

class Util extends React.Component {

  static formatPriceValue(price) {
    let formattedNumber = numeral(price);
    if (price >= 100000) {
      formattedNumber = formattedNumber.format('$0a')
    } else {
      formattedNumber = formattedNumber.format('$0,0');
    }
    return formattedNumber;
  }

  static formatSQFTValue(sqft) {
    let formattedNumber = numeral(sqft);
    return formattedNumber.format('0,0');
  }

  static formatLotSizeValue(lotSize) {
    let formattedNumber = numeral(lotSize);
    return formattedNumber.format('0.00');
  }

  static getSearchFiltersFromURL(url, withoutPrefix) {

    let searchFilter = {};
    let uri = new URI(url);
    if (!_.isEmpty(uri.query())) {
      if (withoutPrefix) {
        let query = qs.parse(uri.query());
        searchFilter = _.get(query, Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX, {});
      } else {
        let query = uri.search(true);
        for (var k in query) {
          if (k.startsWith(Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX)) {
            searchFilter[k] = query[k];
          }
        }
      }
    }
    return searchFilter;
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

  static getQS(currentUrl, searchFilters) {
    let uri = new URI(currentUrl);
    uri.setSearch(searchFilters);
    let query = qs.parse(uri.query());
    return query;
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

  static lotSizeFilterSearchTagText(filter) {
    if (filter.start === Lib.RANGE_SLIDER_NO_MIN_TEXT || filter.to === Lib.RANGE_SLIDER_NO_MAX_TEXT)  {
      if (filter.start === Lib.RANGE_SLIDER_NO_MIN_TEXT) {
        return 'Under ' + this.formatLotSizeValue(filter.to) + ' ACRES';
      } else {
        return 'Over ' + this.formatLotSizeValue(filter.start) + ' ACRES';
      }
    } else {
      return this.formatLotSizeValue(filter.start) + '-' + this.formatLotSizeValue(filter.to) + ' ACRES';
    }
  }

  static priceFilterSearchTagText(filter) {
    if (filter.start === Lib.RANGE_SLIDER_NO_MIN_TEXT || filter.to === Lib.RANGE_SLIDER_NO_MAX_TEXT)  {
      if (filter.start === Lib.RANGE_SLIDER_NO_MIN_TEXT) {
        return 'Under ' + this.formatPriceValue(filter.to);
      } else {
        return 'Over ' + this.formatPriceValue(filter.start);
      }
    } else {
      return this.formatPriceValue(filter.start) + '-' + this.formatPriceValue(filter.to);
    }
  }

  static sqftFilterSearchTagText(filter) {
    if (filter.start === Lib.RANGE_SLIDER_NO_MIN_TEXT || filter.to === Lib.RANGE_SLIDER_NO_MAX_TEXT)  {
      if (filter.start === Lib.RANGE_SLIDER_NO_MIN_TEXT) {
        return 'Under ' + this.formatSQFTValue(filter.to) + ' SQFT';
      } else {
        return 'Over ' + this.formatSQFTValue(filter.start) + ' SQFT';
      }
    } else {
      return numeral(filter.start).format('0,0') + '-' + numeral(filter.to).format('0,0') + ' SQFT';
    }
  }

  static updateQueryFilter(fullUrl, filter, updateType, returnObject) {
    let url = new URI(fullUrl);
    if (updateType === 'set') {
      url.setSearch(filter);
    } else if (updateType === 'remove') {
      url.removeSearch(filter);
    }
    return returnObject ?  url.search(returnObject) : url.search();
  }
}

export default Util;
