import React from 'react'
import _ from 'lodash'
import {Lib} from '../lib.jsx'

class Api {

  static getEsClient(){

    /**
     * @type {$.es.Client|*}
     */
    return new jQuery.es.Client({
      hosts: 'https://' + bundle.elasticsearch_host
    });
  }

  static getEsIndex() {
    return 'v3/search';
  }

  static getEsType(){
    return 'property';
  }

  static getEsMethod(){
    return 'POST';
  }

  static getAggregationsFields() {
    return {
      "wpp_address": {
        "slug": "location_address",
        "title": "Address",
        "field": "meta_input.location_address",
        "search_field": "_search.location_address"
      },
      "wpp_listing_mls_number": {
        "slug": "mls_id",
        "title": "MLS ID",
        "field": "tax_input.mls_id",
        "search_field": "_search.mls_id"
      },
      "wpp_location_city_state": {
        "slug": "city",
        "title": "City",
        "field": "tax_input.location_city",
        "search_field": "_search.location_city"
      },
      "wpp_location_zip": {
        "slug": "zip",
        "title": "Zip",
        "field": "_system.addressDetail.zipcode",
        "search_field": "_search.location_zip"
      },
      "wpp_location_county": {
        "slug": "county",
        "title": "County",
        "field": "tax_input.location_county",
        "search_field": "_search.location_county"
      },
      "wpp_location_subdivision": {
        "slug": "subdivision",
        "title": "Subdivision",
        "field": "tax_input.subdivision",
        "search_field": "_search.subdivision"
      },
      "wpp_schools_elementary_school": {
        "slug": "elementary_school",
        "title": "Elementary School",
        "field": "tax_input.elementary_school",
        "search_field": "_search.elementary_school"
      },
      "wpp_schools_middle_school": {
        "slug": "middle_school",
        "title": "Middle School",
        "field": "tax_input.middle_school",
        "search_field": "_search.middle_school"
      },
      "wpp_schools_high_school": {
        "slug": "high_school",
        "title": "High School",
        "field": "tax_input.high_school",
        "search_field": "_search.high_school"
      }
    };
  }

  static getTopAggregationsFields() {
    return {
      "wpp_location_city_state": {
        "slug": "city",
        "title": "City",
        "field": "tax_input.wpp_location_city_state",
        "search_field": "_search.wpp_location_city_state"
      },
      "wpp_location_zip": {
        "slug": "zip",
        "title": "Zip",
        "field": "_system.addressDetail.zipcode",
        "search_field": "_search.location_zip"
      },
      "wpp_location_county": {
        "slug": "county",
        "title": "County",
        "field": "tax_input.wpp_location_county",
        "search_field": "_search.wpp_location_county"
      },
      "wpp_location_subdivision": {
        "slug": "subdivision",
        "title": "Subdivision",
        "field": "tax_input.wpp_location_subdivision",
        "search_field": "_search.wpp_location_subdivision"
      }
    };
  }

  static autocompleteQuery(params, callback) {

    let client = Api.getEsClient();

    let rows = [];

    if (!params.term || params.term.length < Lib.MIN_SEARCH_KEY_LENGTH) {
      callback(rows);
      return;
    }

    let aggregationsFields = this.getAggregationsFields();

    let body = {
      "suggest": {
        "post-suggest": {
          "text": params.term,
          "completion": {
            "field": "title_suggest",
            "size": Lib.POST_SUGGEST_COUNT
          }
        },
        "term-suggest": {
          "text": params.term,
          "completion": {
            "field": "term_suggest",
            "size": Lib.TERM_SUGGEST_COUNT
          }
        }
      }
    };

    client.search({
      index: Api.getEsIndex(),
      type: Api.getEsType(),
      method: Api.getEsMethod(),
      size: 0,
      body: body
    }, function selectQueryResponse(err, response) {

      let rows = [];
      for (let aggregationKey in aggregationsFields) {
        if (_.get(response, 'suggest.term-suggest', null) === null) {
          break;
        }

        let data = null;
        let _buckets = [];

        let termSuggest = _.get(response, 'suggest.term-suggest');
        for (let i in termSuggest) {
          let term = termSuggest[i];

          if (_.get(term, 'options', null) === null) {
            continue;
          }

          for (let ind in term.options) {
            let option = term.options[ind];

            if (_.get(option, '_source.term_type', null) === aggregationKey) {
              _buckets.push({
                id: _.get(option, 'text', ''),
                text: _.get(option, 'text', ''),
                count: _.get(option, 'score', ''),
                taxonomy: _.get(option, '_source.taxonomy', '')
              });

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
              text: _.get(option, '_source.post_title', ''),
              url: _.get(option, '_source.post_name', null) ? [_.get(wpp, 'instance.settings.configuration.base_slug'), _.get(option, '_source.post_name', null)].join('/') : ''
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

      callback(rows);
    });
  }

  static topQuery(params, callback) {

    let client = Api.getEsClient();

    let rows = [];

    let body = {
      "aggs": {}
    };

    let aggregationsFields = this.getTopAggregationsFields();
    for (let key in aggregationsFields) {

      if (key === 'length' || !aggregationsFields.hasOwnProperty(key)) continue;

      let data = aggregationsFields[key];

      body.aggs[key] = {
        filters: {filters: {}},
        aggs: {}
      };

      body.aggs[key] = {
        terms: {
          field: data.field,
          size: _.get(params, 'size', 0),
          order: {"_count": "desc"}
        }
      }
    }

    client.search({
      index: Api.getEsIndex(),
      type: Api.getEsType(),
      method: Api.getEsMethod(),
      size: params.size || 0,
      body: body
    }, function selectQueryResponse(err, response) {

      for (let aggregationKey in aggregationsFields) {
        if (_.get(response, 'term-suggest', null) === null) {
          continue;
        }

        let data = null;
        let _buckets = [];

        let termSuggest = _.get(response, 'term-suggest');
        for (let i in termSuggest) {
          let term = termSuggest[i];

          if (_.get(term, 'options', null) === null) {
            continue;
          }

          for (let ind in term.options) {
            let option = term.options[ind];

            if (_.get(option, 'payload.term_type', null) === aggregationKey) {
              _buckets.push({
                id: _.get(option, 'text', ''),
                text: _.get(option, 'text', ''),
                count: _.get(option, 'score', ''),
                taxonomy: _.get(option, 'payload.tax', '')
              });

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

      callback(rows);
    });
  }

  static createESSearchQuery(params) {
    let terms = {};
    terms["terms." + params.tax + ".slug"] = params.term;

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

    if (params.locationFilter) {
      // note: the references to topLeft and bottomRight are correct, because of the way ES does its geo_bounding_box
      query.bool.filter = {
          "geo_bounding_box": {
            "wpp_location_pin": {
              "top_left":
                {
                  "lat": params.topLeft.lat,
                  "lon": params.topLeft.lon
                },
              "bottom_right": {
                "lat": params.bottomRight.lat,
                "lon": params.bottomRight.lon
              }
            }
          }
        };
    } else {
      query.bool.must.push({
        "term": {
          "terms.wpp_listing_status.slug": 'for-' + params.saleType.toLowerCase()
        }
      });
      query.bool.must.push({
        "terms": {
          "terms.wpp_listing_type.slug": params.propertyTypes
        }
      });
      query.bool.must.push({"term": terms});
    }

    query = JSON.stringify(query);

    let size = params.size || 500;
    let from = params.from || 0;

    let aggregations = JSON.stringify({});

    let source = JSON.stringify([
      "post_title",
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
      "post_meta.rets_beds",
      "post_meta.rets_total_baths",
      "post_meta.rets_list_price",
      "post_meta.rets_living_area",
      "post_meta.rets_lot_size_area",
      "post_meta.rets_street_number",
      "post_meta.rets_directions",
      "post_meta.rets_street_name",
      "post_meta.rets_thumbnail_url",
      "wpp_media",
      "tax_input"
    ]);

    // return JSON.parse('{"query":' + query + ',"_source": ' + source + ', "size":' + size + ', "from": ' + from + ', "sort":[{"post_date":{"order":"asc"}},{"post_title":{"order":"asc"}}],"aggregations":' + aggregations + '}');
    return JSON.parse('{"query":' + query + ',"_source": ' + source + ', "size":' + size + ', "from": ' + from + ', "aggregations":' + aggregations + '}');
  }

  static search(query, callback) {

    let client = Api.getEsClient();

    let esQuery = {
      index: Api.getEsIndex(),
      type: 'post',
      method: Api.getEsMethod(),
      body: query,
      size: 18
    };
    client.search(esQuery, function (error, response) {
      callback(response);
    });
  }
}

export default Api;
