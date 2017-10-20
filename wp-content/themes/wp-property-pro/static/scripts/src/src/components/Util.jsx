import numeral from 'numeral';
import React from 'react';
import URI from 'urijs';
import qs from 'qs';
import {Lib} from '../lib.jsx';

import get from 'lodash/get';
import intersection from 'lodash/intersection';
import isEmpty from 'lodash/isEmpty';
import last from 'lodash/last';
import replace from 'lodash/replace';
import join from 'lodash/join';
import split from 'lodash/split';

let minMaxDefaultValues = {0: 'No Min', 1: 'No Max'};

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

  static createSearchURL = (path, p) => {
    if (!p instanceof Array) {
      throw new Error('params arg need to be a collection')
    }
    if (!p.every((d) => d.key && d.values && d.values instanceof Array)) {
      throw new Error('params arg is not in the correct format')
    }
    let searchPath = path.match(/^\//) ? path : '/' + path;
    let params = [];
    // sort params alphabetically by key first
    params = p.sort((a, b) => {
      if (a.key < b.key) return -1;
      if (a.key > b.key) return 1;
      if (a.key === b.key) {
        if (a.values[0] < b.values[0]) return -1;
        if (a.values[0] > b.values[0]) return 1;
      }
      return 0;
    });
    
  
    // deal with max and min values
    params.forEach(d => {
      d.values = d.values.map(e => ['No Max', 'No Min'].indexOf(e) >= 0 ? '' : e);
      d.values = d.values.map(e => e && typeof e === 'string' ? e.replace(/\_/g, '-') : e);
    });
    searchPath += params.reduce((a, b) => {
      let key = b.key.replace(/\_/g, '-');
      let values = b.values.join(',');
      a += `/${key}_${values}`;
      return a;
    }, '');
  
    return searchPath;
  }

  static customFormatToSearchObject(obj) {
    let keyMapper = {
      'property_type': 'property',
      'search_type': 'search',
      'sale_type': 'sale'
    };
    let out = {};
    for (let key in obj) {
      let newKey = keyMapper[key] || key;
      out[newKey] = obj[key];
    }
    return out;
  }

  static decodeHtml(html) {
    let txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
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

  static getReddoorSearchTerm(tax, termType) {
    let str;
    if (tax === 'wpp_location') {
      str = termType.replace(tax + '_', '');
    } else if (tax === 'wpp_schools') {
      str = 'school';
    } else {
      str = termType;
    }
    return str;
  }

  static getSearchFiltersFromURL(url, withoutPrefix) {

    let searchFilter = {};
    let uri = new URI(url);
    if (!isEmpty(uri.query())) {
      if (withoutPrefix) {
        let query = qs.parse(uri.query());
        searchFilter = get(query, Lib.QUERY_PARAM_SEARCH_FILTER_PREFIX, {});
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
  };
  
  static getTermLookupAggregationQuery(termDetails) {
    let aggs = {};
    termDetails.forEach(t => {
      let {
        slug,
        term,
        tax
      } = t;
      if (tax === 'wpp_location') {
        aggs[slug] = {
          "filter": {
            "term": {
              [`tax_input.wpp_location.wpp_location_${term}.slug`]: slug
            }
          },
          "aggs": {
            "inside": {
              "terms": {
                "field": `tax_input.wpp_location.wpp_location_${term}.name.raw`,
                "size": 1
              }
            }
          }
        };
      } else if (tax === 'wpp_schools') {
        aggs[slug] = {
          "filter": {
            "term": {
              [`terms.wpp_schools.slug`]: slug
            }
          },
          "aggs": {
            "inside": {
              "terms": {
                "field": "terms.wpp_schools.name.raw",
                "size": 1
              }
            }
          }
        };
      }
    });
    return aggs;
  };

  static getThumbnailUrlBySize(thumbnailUrl = '', size = Lib.PROPERTY_LISTING_IMAGE_SIZE) {
    let urlArray = split(thumbnailUrl, Lib.URL_DELIMITER);
    let fileName = !isEmpty(urlArray) ? last(urlArray) : '';
    let fileNameArray = split(fileName, Lib.EXTENSION_DELIMITER)

    if (isEmpty(fileNameArray)) {
      return '';
    }

    let fileNameWithSize = join([
      fileNameArray[0],
      size
    ], Lib.STRING_ARRAY_DELIMITER);

    let newFileName = join([
        fileNameWithSize,
        fileNameArray[1]
      ],
      Lib.EXTENSION_DELIMITER);

    return replace(thumbnailUrl, fileName, newFileName);
  }

  static getFormModalIdFromCSSClass(classes) {
    let formModalIdClass = classes.filter(c => c.indexOf(Lib.FORM_MODAL_PREFIX_ACTION) >= 0);
    let formModalIdClassExists = formModalIdClass.length;
    return formModalIdClassExists ? formModalIdClass[0].replace(Lib.FORM_MODAL_PREFIX_ACTION, '') : null;
  }

  static getGoogleStreetViewThumbnailURL(params) {

    let key = get(bundle, 'google_api_key', null);

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
    let propertyTypes = get(propertyTypeOptionsObject, `[${searchType}].property_types`);
    let saleType = get(propertyTypeOptionsObject, `[${searchType}].sale_type`);
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
        lat: topLeft[0],
        lon: bottomRight[1]
      },
      sw: {
        lat: bottomRight[0],
        lon: topLeft[1]
      }
    }
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

      if (get(script, 'src', null)) {
        scriptNode.src = get(script, 'src');
      }
      if (get(script, 'content', null)) {
        scriptNode.text = get(script, 'content');
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

  static reddoorConvertToURLTerms = terms => {
    if (!terms instanceof Array) {
      return console.log('invalid terms arg');
    }

    return terms.map(t => {
      return {key: t.term, values: [t.slug]}
    });

  }

  static searchObjectToCustomFormat = obj => {
    let keyMapper = {
      property: 'property_type',
      search: 'search_type',
      sale: 'sale_type'
    };
    let out = {};
  
    for (var key in obj) {
      let newKey = keyMapper[key] || key;
      if (['price', 'sqft', 'lotSize'].indexOf(newKey) >= 0) {
        out[newKey] = {
          start: obj[key][0],
          to: obj[key][1],
        }
      } else {
        out[newKey] = obj[key].length === 1 && newKey !== 'property_type' ? obj[key][0] : obj[key];
      }
    }
    return out;
  };

  static reddoorConvertTermTypeToSearchURLPrefix = (termType) => {
    if (termType.indexOf('wpp_location') >= 0) {
      return termType.replace('wpp_location_', '');
    } else if (termType.indexOf('school') >= 0) {
      return 'school';
    } else {
      throw new Error('couldn`t find the correct term')
    }
  };

  static reddoorTermDetailsFromSearchParam = searchQueryParamsCollection => {
    let termTypeMapper = {
      "wpp_location": ["city", "zip", "county", "country", "city_state", "state", "route", "subdivision"],
      "wpp_schools": ["school"]
    };
    let tax;
    let term;
    let slug;
    let termDetails = [];
    searchQueryParamsCollection.forEach(d => {
      let {
        key,
        values
      } = d;
      if (termTypeMapper['wpp_location'].indexOf(key) >= 0) {
        termDetails.push({
          slug: values[0],
          tax: "wpp_location",
          term: key
        })
      } else if (key.includes('school')) {
        termDetails.push({
          slug: values[0],
          tax: "wpp_schools",
          term: key
        })
      }
    });
    return termDetails;
  };

  static searchCollectionToObject = collection => {
    let obj = {};
    if (collection.every(d => d.key && d.values)) {
      collection.forEach(c => {
        if (obj[c.key]) {
          obj[c.key].push(...c.values);
        } else {
          obj[c.key] = c.values;
        }
      });
    }
    return obj;
  };

  static searchObjectToCollection = obj => {
    let collection = [];
    for (var key in obj) {
      if (obj[key] instanceof Array) {
        // term is a special case
        if (key === 'term') {
          obj[key].forEach(d => {
            collection.push({
              key: d.term,
              values: [d.slug]
            });
          });
        } else {
          obj[key].forEach(d => {
            collection.push({
              key: key,
              values: [d]
            });
          });
        }
      } else if (obj[key].start && obj[key].to) {
        collection.push({
          key: key,
          values: [obj[key].start, obj[key].to]
        });
      } else if (obj[key].lat && obj[key].lon) {
        collection.push({
          key: key,
          values: [obj[key].lat, obj[key].lon]
        });
      } else {
        collection.push({
          key: key,
          values: [obj[key]]
        });
      }
    }
    return collection;
  };
  

  static searchSegmentsToCollection = (segments) => {
    return segments.map(p => {
      let filterSplit = p.split('_');
      let filterKey = filterSplit[0];
      filterKey = filterKey.replace(/\-/g, '_');
      let filterValue = filterSplit[1];
      if (!filterValue) { return null; }
      let filterValueEdges = ((val) => {
        let filterValueSplit = val.split(',');
        let filterValues = filterValueSplit.map((val, index) => !val ? minMaxDefaultValues[index] : val);
        return filterValues;
      })(filterValue);
  
      return { key: filterKey, values: filterValueEdges
      };
    }).filter(d => d);
  };

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

  static URLSearchParse(prefix, url) {
    let pathname = URI(url).pathname();
    // filter out empty, ak.a '' items
    let pathSegments = pathname.split('/').filter(d => d);
    pathSegments.splice(pathSegments.indexOf(prefix), 1);
    
    pathSegments = pathSegments.map(d => URI.decode(d));
    
    let filterCollection = this.searchSegmentsToCollection(pathSegments);
    return filterCollection; 
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

  // Convert property object coming from elasticsearch `hits.hits[0]._source`
  // To be ready for property single component
  static transformPropertyMeta = (data) => {
    let {
      ID: id,
      post_date,
      post_content,
      post_meta,
      post_modified,
      post_title,
      tax_input,
      wpp_media
    } = data;

    let address = get(post_meta, 'rets_address', null);
    let address_unit = get(post_meta, 'address_unit', null);
    let agentId = get(post_meta, 'rets_list_agent[0]', null);
    let agentFirstname = get(post_meta, 'rets_la1_agent_first_name[0]');
    let agentLastname = get(post_meta, 'rets_la1_agent_last_name[0]');
    let agentName = agentFirstname + ' ' + agentLastname;
    let agentPhoneNumber = get(post_meta, 'rets_la1_agent_phone1_number[0]', null);
    let baths  = get(post_meta, 'rets_total_baths', null);
    let beds = get(post_meta, 'rets_beds', null);
    let city = get(tax_input, 'wpp_location.wpp_location_city[0].name', null);
    let elementary_school = get(tax_input, 'rets_state.wpp_schools.elementary_school', null);
    let formatted_address_simple = get(post_meta, 'formatted_address_simple', null);
    let images = wpp_media.map(w => w.url);
    let rets_city = get(tax_input, 'rets_city', null);
    let rets_date_available = get(post_meta, 'rets_date_available[0]', null);
    let rets_high_school = get(tax_input, 'rets_high_school', null);
    let rets_list_price = get(post_meta, 'rets_list_price', null);
    let rets_living_area = get(post_meta, 'rets_living_area', null);
    let rets_lot_size_area = get(post_meta, 'rets_lot_size_area', null);
    let rets_middle_school = get(tax_input, 'rets_middle_school', null);
    let rets_postal_code = get(post_meta, 'rets_postal_code', null);
    let rets_state = get(tax_input, 'rets_state', null);
    let rets_year_built = get(post_meta, 'rets_year_built', null);
    let state = get(tax_input, 'wpp_location.wpp_location_state[0].name', null);
    let sqft = get(post_meta, 'sqft', null);
    let mlsId = get(post_meta, 'rets_mls_number[0]');
    let listing_office = get(tax_input, 'wpp_office.listing_office[0].name', null);
    let listing_status_sale = get(tax_input, 'wpp_listing_status.listing_status_sale[0].slug', null);
    let listing_sub_type = get(tax_input, 'wpp_listing_type.listing_sub_type[0].name', null);
    let listing_type = get(tax_input, 'wpp_listing_type.listing_type[0].slug', null);
    let officePhoneNumber = get(post_meta, 'rets_lo1_office_phone1_number[0]');
    let listingTypes = get(tax_input, 'wpp_listing_type.listing_type', []);
    let wpp_location_subdivision = get(tax_input, 'rets_state.wpp_location.wpp_location_subdivision', null);
    let wpp_location_city = get(tax_input, 'rets_state.wpp_location.wpp_location_city', null);
    let wpp_import_time = get(post_meta, 'wpp_import_time[0]', null);

    return {
      address,
      address_unit,
      agentId,
      agentName,
      agentPhoneNumber,
      baths,
      beds,
      city,
      elementary_school: get(elementary_school, '[0].name', null),
      id,
      images,
      mlsId,
      officePhoneNumber,
      post_date,
      post_content,
      post_modified,
      post_title,
      rets_city: get(rets_city, 'rets_city[0].name', null),
      rets_state: get(rets_state, 'rets_state[0].name', null),
      formatted_address_simple,
      listingTypes,
      rets_date_available,
      rets_list_price,
      rets_living_area,
      rets_lot_size_area,
      rets_high_school: get(rets_high_school, 'rets_high_school[0].name'),
      rets_middle_school: get(rets_middle_school, 'rets_middle_school[0].name', null),
      rets_postal_code,
      rets_year_built,
      state,
      sqft,
      wpp_location_subdivision: get(wpp_location_subdivision, '[0].name', null),
      wpp_location_city: get(wpp_location_city, '[0].name'),
      listing_office,
      listing_status_sale,
      listing_type,
      listing_sub_type,
      wpp_import_time,
      ...data
    }
  }

  static easingTimeGetters = {
    linear(t) {
      return t;
    },
    easeInQuad(t) {
      return t * t;
    },
    easeOutQuad(t) {
      return t * (2 - t);
    },
    easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic(t) {
      return t * t * t;
    },
    easeOutCubic(t) {
      return (--t) * t * t + 1;
    },
    easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    easeInQuart(t) {
      return t * t * t * t;
    },
    easeOutQuart(t) {
      return 1 - (--t) * t * t * t;
    },
    easeInOutQuart(t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    },
    easeInQuint(t) {
      return t * t * t * t * t;
    },
    easeOutQuint(t) {
      return 1 + (--t) * t * t * t * t;
    },
    easeInOutQuint(t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
    }
  }

  static scrollToElement(container, target, duration = 500, easing = 'easeInQuad') {
    let topPos = 0;
    let parent = target;
    while (parent !== container && !!parent) {
      topPos += parent.offsetTop;
      parent = parent.offsetParent;
    }

    if ('requestAnimationFrame' in window === false) {
      container.scrollTop = topPos;
      return;
    }

    const start = container.scrollTop;
    const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

    var scroll = () => {
      const now = 'now' in window.performance ? performance.now() : new Date().getTime();
      const time = Math.min(1, ((now - startTime) / duration));
      const timeFunction = this.easingTimeGetters[easing](time);

      container.scrollTop =  Math.ceil((timeFunction * (topPos - start)) + start);

      if (container.scrollTop === topPos) {
        return;
      }

      requestAnimationFrame(scroll);
    }

    scroll();
    return false;
  }
}

export default Util;
