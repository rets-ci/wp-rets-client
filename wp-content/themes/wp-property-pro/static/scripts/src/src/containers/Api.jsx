import React from 'react';
import {Lib} from '../lib.jsx';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import replace from 'lodash/replace';
import Util from '../components/Util.jsx';

class Api {

  static getPropertySearchRequestURL(size = Lib.PROPERTY_PER_PAGE) {
    return 'https://' + bundle.elasticsearch_host + '/v3/search/advanced?size=' + size;
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
      "wpp_location_city": {
        "slug": "city",
        "title": "City",
        "field": "tax_input.location_city",
        "search_field": "_search.location_city",
        "old_key": "location-city",
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
  
  static getPropertySubTypesByPropertyType(propertyTypeSlug) {
    return {
      "filter": {
        "term": {
          "tax_input.wpp_listing_type.listing_type.slug": propertyTypeSlug
        }
      },
      "aggs": {
        "property_subtype_slugs": {
          "terms": {
            "field": "tax_input.wpp_listing_subtype.listing_sub_type.slug"
          },
          "aggs": {
            "property_subtype_name": {
              "terms": {
                "field": "tax_input.wpp_listing_subtype.listing_sub_type.name.raw",
                "size": 1
              }
            }
          }
        }
      }
    };
  }

  static getPropertySubTypesAggregations() {
    return {
      "property_subtype_slugs": {
        "terms": {
          "field": "tax_input.wpp_listing_subtype.listing_sub_type.slug"
        }
      }
    };
  }

  static getTopAggregations() {
    return {
      "aggs": {
        "wpp_location_city_name": {
          "terms": {
            "title": "Filter by Popular City",
            "field": "tax_input.wpp_location.wpp_location_city.name.raw",
          },
            "total_terms": {
                "cardinality": {
                    "field": "tax_input.wpp_location.wpp_location_city.name.raw"
                }
            },
          "meta": {
            "term_type": "wpp_location_city"
          }
        },
        "wpp_location_city_slug": {
          "terms": {
            "title": "Filter by Popular City",
            "field": "tax_input.wpp_location.wpp_location_city.slug",
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

    // Building context's array for listing_type_status context field
    let type_status_array = [];
    for(let i in params.saleTypes){
      let saleType = params.saleTypes[i];
      type_status_array.push(params.propertyType + '-for-' + saleType.toLowerCase());
    }

    let suggest = {
      "post-suggest": {
        "text": params.term,
        "completion": {
          "field": "title_suggest",
          "size": Lib.AGGREGATION_LOAD_LIMIT,
          "contexts": {
            "listing_type_status": type_status_array
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
            "term_type": [i, get(agg, 'old_key', '')]
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

        let suggestResponse = get(response, 'suggest');
        for (let i in suggestResponse) {
          let terms = suggestResponse[i];
          if (i === 'post-suggest') {
            continue;
          }

          for (let tInd in terms) {

            let term = terms[tInd];

            if (get(term, 'options', null) === null) {
              continue;
            }

            for (let ind in term.options) {
              let option = term.options[ind];
              if (get(option, '_source.term_type', null) === aggregationKey || get(option, '_source.term_type', null) === get(aggregationsFields[aggregationKey], 'old_key', null)) {
                _buckets.push({
                  id: get(option, '_id', ''),
                  text: get(option, '_source.name', ''),
                  term: get(option, '_source.slug', ''),
                  termType: get(option, '_source.term_type', ''),
                  count: get(option, 'score', ''),
                  taxonomy: get(option, '_source.taxonomy', '')
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

      let postsSuggest = get(response, 'suggest.post-suggest');
      for (let c in postsSuggest) {
        let posts = postsSuggest[c];

        if (get(posts, 'options', null) === null) {
          continue;
        }

        for (let ind in posts.options) {
          let option = posts.options[ind];

          if (get(option, '_source', null) !== null) {

            _buckets.push({
              id: get(option, '_source.post_title', ''),
              text: (get(option, '_source.tax_input.wpp_location', null) ? get(option, '_source.post_meta.rets_address', '') + (get(option, '_source.post_meta.address_unit[0]', null) ? (' ' + option._source.post_meta.address_unit) : '') + ', ' + get(option, '_source.tax_input.wpp_location.wpp_location_city[0].name', '') + ', ' + get(option, '_source.tax_input.wpp_location.wpp_location_state[0].slug', '').toUpperCase() + ', ' + get(option, '_source.post_meta.rets_postal_code', '') : get(option, '_source.post_title')),
              url: get(option, '_source.post_name', null) ? [get(bundle, 'property_single_url'), get(option, '_source.post_name', null)].join('/') : ''
            });
          }
        }
      }

      if (_buckets.length > 0) {
        data = Object.assign({}, data, {
          key: 'properties',
          text: 'Addresses',
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
          "field": get(aggregation, 'terms.field', ''),
          "size": Lib.AGGREGATION_LOAD_LIMIT
        }
      };

      if (aggregation.meta) {
        body.aggs[aggIndex]['meta'] = aggregation.meta;
      }

      if (aggregation.total_terms) {
          body.aggs[aggIndex + '_count'] = aggregation.total_terms;
      }
    }

    Api.makeRequest({
      'url': Api.getPropertySearchRequestURL(0),
      'query': {
        data: JSON.stringify(body)
      }
    }, function (err, response) {
      if (err) {
        return callback(err);
      }
      let responseAggs = get(response, 'aggregations');

      for (let i in responseAggs) {

        if (i.indexOf('slug') !== -1) {
          continue;
        }

        let data = null;
        let _buckets = [];
        let term = responseAggs[i];
        let meta = responseAggs[i].meta;

        if (get(term, 'buckets', null) === null) {
          continue;
        }

        for (let ind in term.buckets) {

          let bucket = term.buckets[ind];

          if (get(bucket, 'key', null) !== null) {
            _buckets.push({
              id: get(bucket, 'key', ''),
              text: get(bucket, 'key', ''),
              term: get(responseAggs[replace(i, 'name', 'slug')].buckets[ind], 'key', ''),
              termType: get(meta, 'term_type', ''),
              count: get(bucket, 'doc_count', ''),
              taxonomy: 'wpp_location'
            });

          }
        }

        if (_buckets.length > 0) {
          data = Object.assign({}, data, {
            key: i,
            text: get(aggregations[i], 'terms.title'),
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
        "must": []
      }
    };
    if (params.geoCoordinates) {
      query.bool.must.push(
        {
          "exists": {
            "field": "wpp_location_pin"
          }
        }
      );
      query.bool.must.push(
        {
          "geo_bounding_box": {
            "wpp_location_pin": {
              "top_left": {
                "lat": params.geoCoordinates.topLeft[0],
                "lon": params.geoCoordinates.topLeft[1]
              },
              "bottom_right": {
                "lat": params.geoCoordinates.bottomRight[0],
                "lon": params.geoCoordinates.bottomRight[1]
              }
            }
          }
        }
      );
    }
    let saleTypeShouldArray = [];
    let saleType = params.sale_type;
    if (saleType) {
      saleType.forEach(saleType => {
        saleTypeShouldArray.push({
          "term": {
            "terms.wpp_listing_status.slug": 'for-' + saleType.toLowerCase()
          }
        })
      });
    }
    query.bool.must.push({
      "bool": {
        "should": saleTypeShouldArray
      }
    });

    if (params.property_subtype) {
      query.bool.must.push({
        "terms": {
          "tax_input.wpp_listing_subtype.listing_sub_type.slug": params.property_subtype
        }
      });
    }

    query.bool.must.push({
      "terms": {
        "tax_input.wpp_listing_type.listing_type.slug": [params.property_type]
      }
    });

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
    if (params.acres) {
      let range = {};
      if (params.acres.start !== Lib.RANGE_SLIDER_NO_MIN_TEXT) {
        range.gte = params.acres.start
      }

      if (params.acres.to !== Lib.RANGE_SLIDER_NO_MAX_TEXT) {
        range.lt = params.acres.to
      }
      query.bool.must.push({
        "range": {
          "meta.rets_lot_size_area.double": range
        }
      });

    }

    if (!params.geoCoordinates) {
      let terms = params.term.map(term => {
        return {term: {["terms." + term.tax + ".slug"]: term.slug}}
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

    let aggregations = JSON.stringify(params.aggregations || {});
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
      "post_meta.address_unit",
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
      "post_meta.sqft",
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
    return JSON.parse('{"query":' + query + ',"sort": ' + sort + ', "size":' + size + ', "from": ' + from + ', "aggregations":' + aggregations + '}');
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
    let searchParams = {
      ...params,
      size: Lib.PROPERTY_PER_PAGE
    };
    
    let query = this.createESSearchQuery(searchParams);
    let url = this.getPropertySearchRequestURL();
    this.search(url, query, (err, response) => {
      callback(err, query, response);
    });
  }

  static makeRequest(data, callback) {

    if (isEmpty(get(data, 'url', null))) {
      console.log('Missing url');
      return false;
    }

    let query = get(data, 'query', null);

    // @TODO Temporary hack for changing ElasticPress index
    if (get(data, 'url').indexOf('search/advanced') != -1 && !isEmpty(get(bundle, 'ep_index_name', null))) {
      query.custom_ep_index = get(bundle, 'ep_index_name');
    }

    jQuery.ajax({
      url: get(data, 'url'),
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

  static getSearchPageMetadata(terms, propertyType, callback) {
    let aggregations = {};
    if (terms) {
      aggregations = Util.getTermLookupAggregationQuery(terms);
    }
    if (propertyType) {
      aggregations['property_subtype_based_on_type'] = this.getPropertySubTypesByPropertyType(propertyType);
    }
    let searchObj = {query: {}, aggregations: aggregations};
    let url = this.getPropertySearchRequestURL(0);
    this.search(url, searchObj, (err, response) => {
      callback(err, response);
    });
  }
}

export default Api;