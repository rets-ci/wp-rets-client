import numeral from 'numeral';
import React from 'react';
import {browserHistory} from 'react-router';
import URI from 'urijs';
import qs from 'qs';
import {Lib} from '../lib.jsx';
import _ from 'lodash';

class Util extends React.Component {

  static calculateCenterCoors(params) {
    let {
      ne,
      sw
    } = params;
    let calculateCenter = (
      new google.maps.LatLngBounds(
      {
        lat: +sw.lat,
        lng: +sw.lon
        }, {
        lat: +ne.lat,
        lng: +ne.lon
      }
      )
    ).getCenter();
    let centerPoint = {
      lat: calculateCenter.lat(),
      lng: calculateCenter.lng()
    };
    return centerPoint;
  }

  static formatPriceValue(price) {
    return numeral(price).format('$0,0');
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

  static getFormModalIdFromCSSClass(classes) {
    let formModalIdClass = classes.filter(c => c.indexOf(Lib.FORM_MODAL_PREFIX_ACTION) >= 0);
    let formModalIdClassExists = formModalIdClass.length;
    return formModalIdClassExists ? formModalIdClass[0].replace(Lib.FORM_MODAL_PREFIX_ACTION, '') : null;
  }

  static getGoogleStreetViewThumbnailURL(params) {

    let key = _.get(bundle, 'google_api_key', null);

    if (!params.size || !params.location || !key) {
      console.log('Missed params');
      return '';
    }

    return `${Lib.GOOGLE_STREETVIEW_URL}?size=${params.size}&location=${params.location}&key=${key}`;
  }

  static getSearchTypeParameters(options) {
    // Hack for changing Sale to Buy in dropdown options
    // TODO: ideally this should be done in the server-side and send down to the client to not pollute the client-side code
    let labels = Object.keys(options).map(o => {
      let labelsArr = o.split(Lib.STRING_ARRAY_DELIMITER);
      return labelsArr[0] === 'Sale' ? 'Buy' : labelsArr[0];
    });
    let saleTypes = Object.keys(options).map(o => {
      let labelsArr = o.split(Lib.STRING_ARRAY_DELIMITER);
      return labelsArr[1];
    });
    let propertyTypes = Object.keys(options).map(o => {
      let labelsArr = o.split(Lib.STRING_ARRAY_DELIMITER);
      return labelsArr.slice(2).join(Lib.STRING_ARRAY_DELIMITER);
    });
    return {
      labels,
      saleTypes,
      propertyTypes
    };
  }

  static getSearchDataFromPropertyTypeOptionsBySearchType(searchType, propertyTypeOptionsObject) {
    let returnObject = {
      error: false,
      msg: ''
    };
    if (!searchType) {
      returnObject.error = true;
      returnObject.msg = 'search type was not specified';
      return returnObject;
    }
    if (!propertyTypeOptionsObject[searchType]) {
      returnObject.error = true;
      returnObject.msg = `search type ${searchType} wasn't found in property type options`;
      return returnObject;
    }
    let propertyTypes = _.get(propertyTypeOptionsObject, `[${searchType}][0].property_types`);
    let saleType = _.get(propertyTypeOptionsObject, `[${searchType}][0].sale_type`);
    if (!propertyTypes) {
      returnObject.error = true;
      returnObject.msg = 'property types are missing from the data source';
      return returnObject;
    }
    if (!saleType) {
      returnObject.error = true;
      returnObject.msg = 'sale type are missing from the data source';
      return returnObject;
    }
    if (!(propertyTypes instanceof Array)) {
      propertyTypes = Object.values(propertyTypes);
    }
    returnObject.propertyTypes = propertyTypes;
    returnObject.saleType = saleType;
    return returnObject;
  }

  static getQS(currentUrl, searchFilters) {
    let uri = new URI(currentUrl);
    uri.setSearch(searchFilters);
    let query = qs.parse(uri.query());
    return query;
  }

  static googleGeoFormatToElasticsearch(params) {
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

  static elasticsearchGeoFormatToGoogle(params) {
    let {
      bottomRight,
      topLeft
    } = params;

    return {
      ne: {
        lat: topLeft.lat,
        lon: bottomRight.lon
      },
      sw: {
        lat: bottomRight.lat,
        lon: topLeft.lon
      }
    }
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

  static loadScripts(scripts) {
    for (let i in scripts) {
      let script = scripts[i];

      let scriptNode = document.createElement("script");

      scriptNode.type = 'text/javascript';

      if (_.get(script, 'src', null)) {
        scriptNode.src = _.get(script, 'src');
      }
      if (_.get(script, 'content', null)) {
        scriptNode.text = _.get(script, 'content');
      }

      scriptNode.async = true;

      document.body.appendChild(scriptNode);
    }
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

  static withoutSearchFilters(url) {
    let uri = new URI(url);
    let urlQuery = uri.query();
    let query = qs.parse(urlQuery);
    delete query[Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX];
  }
}

export default Util;
