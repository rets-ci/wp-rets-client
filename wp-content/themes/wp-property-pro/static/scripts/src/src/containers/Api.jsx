import React from 'react';
import {Lib} from '../lib.jsx';
import get from 'lodash/get';
import sortBy from 'lodash/sortBy';
import reverse from 'lodash/reverse';
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
      "location_city": {
        "title": "City"
      },
      "location_zip": {
        "title": "Zip"
      },
      "location_county": {
        "title": "County"
      },
      "location_neighborhood": {
        "title": "Neighborhood"
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

  static getPropertySubTypes() {
    return {
      "filter": {
        "term": {
          "taxonomy": "wpp_listing_subtype"
        }
      },
      "aggs": {
        "slugs": {
          "terms": {
            "field": "slug",
            "size": 100

          },
          "aggs": {
            "name": {
              "terms": {
                "field": "name.raw",
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

  static getTopCities(){
    return [
      'Durham',
      'Raleigh',
      'Chapel Hill',
      'Carrboro',
      'Cary',
      'Apex',
      'Morrisville',
      'Hillsborough',
      'Holly Springs',
      'Fuquay Varina',
      'Garner'
    ]
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

    let source = [
          "ID",
          "post_title",
          "post_name",
          "taxonomy",
          "slug",
          "name",
          "parent",
          "term_type",
          "url_path",
          "post_meta.address_unit",
          "post_meta.rets_address",
          "post_meta.rets_postal_code",
          "tax_input.location_state",
          "tax_input.location_zip",
          "tax_input.location_county",
          "tax_input.location_city",
          "tax_input.location_neighborhood",
        ];

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
    for (let aggregationKey in aggregationsFields) {

      suggest[aggregationKey] = {
        "text": params.term,
        "completion": {
          "field": "term_suggest",
          "size": Lib.TERM_SUGGEST_COUNT,
          "contexts": {
            "term_type": aggregationKey
          }
        }
      };
    }

    let body = {
      data: JSON.stringify({
        _source: source,
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
              if (get(option, '_source.term_type', null) === aggregationKey) {
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
              text: (get(option, '_source.tax_input.post_meta.rets_address', null) ? get(option, '_source.post_meta.rets_address', '') + (get(option, '_source.post_meta.address_unit[0]', null) ? (' ' + option._source.post_meta.address_unit) : '') + ', ' + get(option, '_source.tax_input.location_city.location_city[0].name', '') + ', ' + get(option, '_source.tax_input.location_state.location_state[0].slug', '').toUpperCase() + ', ' + get(option, '_source.post_meta.rets_postal_code', '') : get(option, '_source.post_title')),
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

    let rows = [];
    let cityTaxonomy = 'location_city';

    // Get top cities array
    let cities = this.getTopCities();

    // Build the query body
    let body = {
      "query": {
        "bool": {
          "must": [{
            "terms": {
              "name.raw": cities
            }
          }],
          "filter": {
            "term": {
              "taxonomy": cityTaxonomy
            }
          }
        }
      }
    };

    Api.makeRequest({
      'url': Api.getPropertySearchRequestURL(),
      'query': {
        data: JSON.stringify(body)
      }
    }, function (err, response) {
      if (err) {
        return callback(err);
      }
      let citiesResponse = get(response, 'hits.hits');

      // Send new aggregations request to getting listings count for each terms
      let body = {
        "aggregations":{
          "location_city":{
            "terms":{
              "field": "tax_input." + cityTaxonomy + "." + cityTaxonomy + ".name.raw",
              "size": 300
            },
            "meta":{
              "term_type" : cityTaxonomy
            }
          }
        }
      };

      Api.makeRequest({
        'url': Api.getPropertySearchRequestURL(),
        'query': {
          data: JSON.stringify(body)
        }
      }, function (err, aggResponse) {
        let items = get(aggResponse, 'aggregations.'+cityTaxonomy+'.buckets', []);

        // Sorting received array by listings counts
        citiesResponse = reverse(sortBy(citiesResponse, cityItem => {
          let index = 0;

          for(let ind in items){
            if(get(cityItem, '_source.name') === get(items[ind], 'key')){
              index = get(items[ind], 'doc_count');
            }
          }
          return index;
        }));

        let buckets = [];
        for (let c in citiesResponse) {
          let city = citiesResponse[c];

          buckets.push({
            id: get(city, '_source.slug'),
            text: get(city, '_source.name'),
            term: get(city, '_source.slug'),
            termType: cityTaxonomy,
            taxonomy: cityTaxonomy,
            label: get(city, '_source.meta.et_label'),
            images: get(city, '_source.meta.et_images'),
          });
        }

        rows.push({
          key: 0,
          text: 'Filter by popular cities',
          children: buckets
        });

        callback(null, rows);
      });
    });
  }

  static createESSearchQuery(params) {
    let query = {
      "bool": {
        "must": []
      }
    };
    // this is to ignore any listing that doesn't have geo coordinates on MLS
    query.bool.must.push(
      {
        "exists": {
          "field": "post_meta.wpp_location_pin"
        }
      }
    )
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
            "tax_input.wpp_sale_status.listing_status_sale.slug": 'for-' + saleType
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
          let responseJson = jqXHR.responseJSON || {};
          let obj = {
            pageNotFound: true,
            ...responseJson
          };
          return callback(null, obj);
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
      aggregations['property_subtypes'] = this.getPropertySubTypes();
    }
    let searchObj = {query: {}, aggregations: aggregations};
    let url = this.getPropertySearchRequestURL(0);
    this.search(url, searchObj, (err, response) => {
      callback(err, response);
    });
  }
}

export default Api;