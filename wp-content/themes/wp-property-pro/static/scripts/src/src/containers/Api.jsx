import React from 'react';
import {Lib} from '../lib.jsx';
import _ from 'lodash';
import Util from '../components/Util.jsx';

class Api {

  static getPropertySearchRequestURL(size = Lib.PROPERTY_PER_PAGE) {
    return 'https://' + bundle.elasticsearch_host + '/v3/_newSearch?size=' + size;
  }

  static getAggregationsFields() {
    return {
      "wpp_listing_mls_number": {
        "slug": "mls_id",
        "title": "MLS ID",
        "field": "tax_input.mls_id",
        "search_field": "_search.mls_id",
        "old_key": "mls-id",
        "taxonomy": "wpp_listing"
      },
      "wpp_location_city_state": {
        "slug": "city",
        "title": "City",
        "field": "tax_input.location_city",
        "search_field": "_search.location_city",
        "old_key": "location-city-state",
        "taxonomy": "wpp_location"
      },
      "wpp_location_zip": {
        "slug": "zip",
        "title": "Zip",
        "field": "_system.addressDetail.zipcode",
        "search_field": "_search.location_zip",
        "old_key": "location-zipcode",
        "taxonomy": "wpp_location"
      },
      "wpp_location_county": {
        "slug": "county",
        "title": "County",
        "field": "tax_input.location_county",
        "search_field": "_search.location_county",
        "old_key": "location-county",
        "taxonomy": "wpp_location"
      },
      "wpp_location_subdivision": {
        "slug": "subdivision",
        "title": "Subdivision",
        "field": "tax_input.subdivision",
        "search_field": "_search.subdivision",
        "old_key": "subdivision",
        "taxonomy": "wpp_location"
      },
      "wpp_schools_elementary_school": {
        "slug": "elementary_school",
        "title": "Elementary School",
        "field": "tax_input.elementary_school",
        "search_field": "_search.elementary_school",
        "old_key": "elementary-school",
        "taxonomy": "wpp_schools"
      },
      "wpp_schools_middle_school": {
        "slug": "middle_school",
        "title": "Middle School",
        "field": "tax_input.middle_school",
        "search_field": "_search.middle_school",
        "old_key": "middle-school",
        "taxonomy": "wpp_schools"
      },
      "wpp_schools_high_school": {
        "slug": "high_school",
        "title": "High School",
        "field": "tax_input.high_school",
        "search_field": "_search.high_school",
        "old_key": "high-school",
        "taxonomy": "wpp_schools"
      }
    };
  }

  static getTopAggregations() {
    return {
      "aggs": {
        "wpp_location_city_state_name": {
          "terms": {
            "title": "City",
            "field": "tax_input.wpp_location.wpp_location_city_state.name.raw",
          }
        },
        "wpp_location_city_state_slug": {
          "terms": {
            "title": "City",
            "field": "tax_input.wpp_location.wpp_location_city_state.slug",
          }
        },
        "wpp_location_zip_name": {
          "terms": {
            "title": "Zipcode",
            "field": "tax_input.wpp_location.wpp_location_zip.name.raw",
          }
        },
        "wpp_location_zip_slug": {
          "terms": {
            "title": "Zipcode",
            "field": "tax_input.wpp_location.wpp_location_zip.slug",
          }
        },
        "wpp_location_county_name": {
          "terms": {
            "title": "County",
            "field": "tax_input.wpp_location.wpp_location_county.name.raw"
          }
        },
        "wpp_location_county_slug": {
          "terms": {
            "title": "County",
            "field": "tax_input.wpp_location.wpp_location_county.slug"
          }
        },
        "wpp_location_subdivision_name": {
          "terms": {
            "title": "Subdivision",
            "field": "tax_input.wpp_location.wpp_location_subdivision.name.raw"
          }
        },
        "wpp_location_subdivision_slug": {
          "terms": {
            "title": "Subdivision",
            "field": "tax_input.wpp_location.wpp_location_subdivision.slug"
          }
        }
      }
    };
  }

  static autocompleteQuery(params, callback) {

    let rows = [];

    if (!params.term || params.term.length < Lib.MIN_SEARCH_KEY_LENGTH) {
      callback(null, rows);
      return;
    }

    let aggregationsFields = this.getAggregationsFields();
    let suggest = {
      "post-suggest": {
        "text": params.term,
        "completion": {
          "field": "title_suggest",
          "size": Lib.POST_SUGGEST_COUNT,
          "contexts": {
            "listing_status": ['for-' + params.saleType.toLowerCase()],
            "listing_type": params.propertyTypes.split(Lib.STRING_ARRAY_DELIMITER)
          }
        }
      }
    };
    for (let i in aggregationsFields) {
      let agg = aggregationsFields[i];

      suggest[i] = {
        "text": params.term,
        "completion": {
          "field": "term_suggest",
          "size": Lib.TERM_SUGGEST_COUNT,
          "contexts": {
            "term_type": [i, _.get(agg, 'old_key', '')]
          }
        }
      };
    }

    let body = {
      data: JSON.stringify({
        suggest: suggest
      })
    };

    Api.makeRequest({
      'url': Api.getPropertySearchRequestURL(0),
      'query': body
    }, function (err, response) {
      if (err) {
        return callback(err);
      }
      let rows = [];
      for (let aggregationKey in aggregationsFields) {

        let data = null;
        let _buckets = [];

        let suggestResponse = _.get(response, 'suggest');
        for (let i in suggestResponse) {
          let terms = suggestResponse[i];
          if (i === 'post-suggest') {
            continue;
          }

          for (let tInd in terms) {

            let term = terms[tInd];

            if (_.get(term, 'options', null) === null) {
              continue;
            }

            for (let ind in term.options) {
              let option = term.options[ind];

              if (_.get(option, '_source.term_type', null) === aggregationKey || _.get(option, '_source.term_type', null) === _.get(aggregationsFields[aggregationKey], 'old_key', null)) {
                _buckets.push({
                  id: _.get(option, '_id', ''),
                  text: _.get(option, '_source.name', ''),
                  term: _.get(option, '_source.slug', ''),
                  count: _.get(option, 'score', ''),
                  taxonomy: _.get(option, '_source.taxonomy', '')
                });

              }
            }
          }
        }

        if (_buckets.length > 0) {
          data = Object.assign({}, data, {
            key: aggregationKey,
            text: aggregationsFields[aggregationKey].title,
            children: _buckets
          });
          rows.push(data);
        }
      }

      let data = null;
      let _buckets = [];

      let postsSuggest = _.get(response, 'suggest.post-suggest');
      for (let c in postsSuggest) {
        let posts = postsSuggest[c];

        if (_.get(posts, 'options', null) === null) {
          continue;
        }

        for (let ind in posts.options) {
          let option = posts.options[ind];

          if (_.get(option, '_source', null) !== null) {

            _buckets.push({
              id: _.get(option, '_source.post_title', ''),
              text: [_.get(option, '_source.post_meta.formatted_address_simple', ''), _.get(option, '_source.post_meta.rets_postal_code', '')].join(' '),
              url: _.get(option, '_source.post_name', null) ? [_.get(bundle, 'property_single_url'), _.get(option, '_source.post_name', null)].join('/') : ''
            });
          }
        }
      }

      if (_buckets.length > 0) {
        data = Object.assign({}, data, {
          key: 'properties',
          text: 'Properties',
          children: _buckets
        });
        rows.push(data);
      }

      callback(null, rows);
    });
  }

  static topQuery(params, callback) {

    let rows = [
      {
        'order_key': 'city'
      },
      {
        'order_key': 'zip'
      },
      {
        'order_key': 'county'
      },
      {
        'order_key': 'subdivision'
      }
    ];

    let aggregations = this.getTopAggregations().aggs;
    let body = {
      "aggs": {}
    };
    for (let aggIndex in aggregations) {
      let aggregation = aggregations[aggIndex];

      body.aggs[aggIndex] = {
        "terms": {
          "field": _.get(aggregation, 'terms.field', ''),
          "size": params.size || 0
        }
      }
    }

    Api.makeRequest({
      'url': Api.getPropertySearchRequestURL(params.size || 0),
      'query': {
        data: JSON.stringify(body)
      }
    }, function (err, response) {
      if (err) {
        return callback(err);
      }
      let responseAggs = _.get(response, 'aggregations');

      for (let i in responseAggs) {

        if (i.indexOf('slug') !== -1) {
          continue;
        }

        let data = null;
        let _buckets = [];
        let term = responseAggs[i];

        if (_.get(term, 'buckets', null) === null) {
          continue;
        }

        for (let ind in term.buckets) {
          let bucket = term.buckets[ind];

          if (_.get(bucket, 'key', null) !== null) {
            _buckets.push({
              id: _.get(bucket, 'key', ''),
              text: _.get(bucket, 'key', ''),
              term: _.get(responseAggs[_.replace(i, 'name', 'slug')].buckets[ind], 'key', ''),
              count: _.get(bucket, 'doc_count', ''),
              taxonomy: 'wpp_location'
            });

          }
        }

        if (_buckets.length > 0) {
          data = Object.assign({}, data, {
            key: i,
            text: _.get(aggregations[i], 'terms.title'),
            children: _buckets
          });

          for (let r in rows) {
            if (i.indexOf(rows[r].order_key) !== -1) {
              rows[r] = data;
            }
          }
        }
      }

      callback(null, rows);
    });
  }

  static createESSearchQuery(params) {

    let query = {
      "bool": {
        "must": [
          {
            "exists": {
              "field": "wpp_location_pin"
            }
          }
        ]
      }
    };

    if (params.geoCoordinates) {
      query.bool.must.push(
        {
          "geo_bounding_box": {
            "wpp_location_pin": {
              "top_left": {
                "lat": params.geoCoordinates.topLeft.lat,
                "lon": params.geoCoordinates.topLeft.lon
              },
              "bottom_right": {
                "lat": params.geoCoordinates.bottomRight.lat,
                "lon": params.geoCoordinates.bottomRight.lon
              }
            }
          }
        }
      );
    }

    if (params.sale_type) {
      let saleType = params.sale_type.toLowerCase() === 'buy' ? 'sale' : params.sale_type.toLowerCase();
      query.bool.must.push({
        "term": {
          "terms.wpp_listing_status.slug": 'for-' + saleType
        }
      });
    }

    if (params.property_types && params.property_types.length) {
      query.bool.must.push({
        "terms": {
          "terms.wpp_listing_type.slug": params.property_types
        }
      });
    }

    if (params.bathrooms) {
      query.bool.must.push({
        "range": {
          "meta.rets_total_baths.double": {
            "gte": params.bathrooms
          }
        }
      });
    }

    if (params.bedrooms) {
      query.bool.must.push({
        "range": {
          "meta.rets_beds.double": {
            "gte": params.bedrooms
          }
        }
      });
    }

    if (params.price) {
      let range = {};
      if (params.price.start !== Lib.RANGE_SLIDER_NO_MIN_TEXT) {
        range.gte = params.price.start
      }

      if (params.price.to !== Lib.RANGE_SLIDER_NO_MAX_TEXT) {
        range.lt = params.price.to
      }
      query.bool.must.push({
        "range": {
          "meta.rets_list_price.double": range
        }
      });
    }

    if (params.property_type) {
      query.bool.must.push({
        "term": {
          "meta.property_type.value": params.property_type
        }
      });
    }

    if (params.sqft) {
      let range = {};
      if (params.sqft.start !== Lib.RANGE_SLIDER_NO_MIN_TEXT) {
        range.gte = params.sqft.start
      }

      if (params.sqft.to !== Lib.RANGE_SLIDER_NO_MAX_TEXT) {
        range.lt = params.sqft.to
      }
      query.bool.must.push({
        "range": {
          "meta.rets_living_area.double": range
        }
      });
    }
    if (params.lotSize) {
      let range = {};
      if (params.lotSize.start !== Lib.RANGE_SLIDER_NO_MIN_TEXT) {
        range.gte = params.lotSize.start
      }

      if (params.lotSize.to !== Lib.RANGE_SLIDER_NO_MAX_TEXT) {
        range.lt = params.lotSize.to
      }
      query.bool.must.push({
        "range": {
          "meta.rets_lot_size_area.double": range
        }
      });

    }

    if (!params.geoCoordinates) {
      let terms = params.term.map(term => {
        return {term: {["terms." + Object.keys(term)[0] + ".name.raw"]: Object.values(term)[0]}}
      });

      query.bool.must.push({
        "bool": {
          "should": terms
        }
      });
    }

    query = JSON.stringify(query);

    let size = params.size || 500;
    let from = params.from || 0;

    let aggregations = JSON.stringify({});

    let source = JSON.stringify([
      "meta.property_type.value",
      "post_title",
      "post_name",
      "post_meta.wpp_location_latitude",
      "post_meta.wpp_location_longitude",
      "permalink",
      "post_meta.google_place_id",
      "post_meta.formatted_address",
      "post_meta.formatted_address_simple",
      "post_meta.wpp_location_pin",
      "post_meta.rets_list_date",
      "post_meta.rets_thumbnail_url",
      "terms.wpp_listing_type",
      "post_meta.rets_address",
      "post_meta.rets_beds",
      "post_meta.rets_total_baths",
      "post_meta.rets_list_price",
      "post_meta.rets_living_area",
      "post_meta.rets_lot_size_area",
      "post_meta.rets_street_number",
      "post_meta.rets_directions",
      "post_meta.rets_street_name",
      "post_meta.rets_thumbnail_url",
      "post_meta.rets_postal_code",
      "wpp_media",
      "wpp_location_pin",
      "tax_input"
    ]);
    let sort = [];
    if (params.geoCoordinates) {
      let centerCoors = Util.calculateCenterCoors(Util.elasticsearchGeoFormatToGoogle(params.geoCoordinates));
      centerCoors['lon'] = centerCoors['lng'];
      delete centerCoors['lng'];
      sort.push({
        "_geo_distance": {
          "wpp_location_pin": centerCoors,
          "order": "asc",
          "unit": "km",
          "distance_type": "arc"
        }
      });
    }
    sort = JSON.stringify(sort);
    // return JSON.parse('{"query":' + query + ',"_source": ' + source + ', "size":' + size + ', "from": ' + from + ', "sort":[{"post_date":{"order":"asc"}},{"post_title":{"order":"asc"}}],"aggregations":' + aggregations + '}');
    return JSON.parse('{"query":' + query + ',"_source": ' + source + ',"sort": ' + sort + ', "size":' + size + ', "from": ' + from + ', "aggregations":' + aggregations + '}');
  }

  static search(url, query, callback) {
    Api.makeRequest({
      'url': url,
      'query': {
        data: JSON.stringify(query)
      }
    }, callback);
  }

  static makeStandardPropertySearch(params, callback) {
    let {
        property_types
      } = params;
      let pt = property_types.split(Lib.STRING_ARRAY_DELIMITER);
      let searchParams = {
        ...params,
        property_types: pt,
        size: Lib.PROPERTY_PER_PAGE
      };
      
      let query = this.createESSearchQuery(searchParams);
      let url = this.getPropertySearchRequestURL();
      this.search(url, query, (err, response) => {
        callback(err, query, response);
      });
  }

  static makeRequest(data, callback) {

    if (_.isEmpty(_.get(data, 'url', null))) {
      console.log('Missing url');
      return false;
    }

    let query = _.get(data, 'query', null);

    // @TODO Temporary hack for changing ElasticPress index
    if (_.get(data, 'url').indexOf('newSearch') != -1 && !_.isEmpty(_.get(bundle, 'ep_index_name', null))) {
      query.custom_ep_index = _.get(bundle, 'ep_index_name');
    }

    jQuery.ajax({
      url: _.get(data, 'url'),
      dataType: 'json',
      type: 'GET',
      contentType: 'text/plain',
      data: query,
      error: (jqXHR, textStatus, errorThrown) => {
        let errorMsg = '';
        if (jqXHR.status === 0) {
          errorMsg = "Couldn't establish a connection.";
        } else if (jqXHR.status == 404) {
          errorMsg = "Requested page not found. [404]";
        } else if (jqXHR.status == 500) {
          errorMsg = "Internal Server Error [500].";
        } else if (textStatus === 'parsererror') {
          errorMsg = "Requested JSON parse failed.";
        } else if (textStatus === 'timeout') {
          errorMsg = "Time out error.";
        } else if (textStatus === 'abort') {
          errorMsg = "Ajax request aborted.";
        } else {
          errorMsg = "Uncaught Error.\n" + jqXHR.responseText;
        }
        callback(errorMsg);
      },
      success: response => {
        if (typeof callback !== 'undefined') {
          callback(null, response);
        } else {
          console.log('Missing callback');
        }
      }
    });
  }
}

export default Api;
