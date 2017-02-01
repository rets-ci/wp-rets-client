import React from 'react'
import {connect} from 'react-redux';

const mapStateToProps = (state) => {
    return {

    }
};

const mapDispatchToProps = (dispatch, ownProps) => {

};

class Api extends React.Component {

    static getAggregationsFields() {
        return {
            "elementary_school": {
                "icons": {
                    "main": "school-elementary-solid",
                    "outline": "school-elementary-outline"
                },
                "slug": "elementary_school",
                "title": "Elementary School",
                "field": "tax_input.elementary_school",
                "search_field": "_search.elementary_school"
            },
            "middle_school": {
                "icons": {"main": "school-middle-solid", "outline": "school-middle-outline"},
                "slug": "middle_school",
                "title": "Middle School",
                "field": "tax_input.middle_school",
                "search_field": "_search.middle_school"
            },
            "high_school": {
                "icons": {"main": "school-high-solid", "outline": "school-high-outline"},
                "slug": "high_school",
                "title": "High School",
                "field": "tax_input.high_school",
                "search_field": "_search.high_school"
            },
            "location_city": {
                "icons": {"main": "school-elementary-solid", "outline": "school-elementary-outline"},
                "slug": "city",
                "title": "City",
                "field": "tax_input.location_city",
                "search_field": "_search.location_city"
            },
            "location_zip": {
                "icons": {"main": "school-elementary-solid", "outline": "school-elementary-outline"},
                "slug": "zip",
                "title": "Zip",
                "field": "_system.addressDetail.zipcode",
                "search_field": "_search.location_zip"
            },
            "location_county": {
                "icons": {"main": "school-elementary-solid", "outline": "school-elementary-outline"},
                "slug": "county",
                "title": "County",
                "field": "tax_input.location_county",
                "search_field": "_search.location_county"
            }
        };
    }

    static selectQuery(params, callback) {

        let client = new jQuery.es.Client({
            hosts: 'api.reddoorcompany.com'
        });

        let rows = [];

        if (!params.term || params.term.length < 3){
            callback(rows);
            return;
        }

        let _source = {
            "query": {"match": {"post_status": "publish"}},
            "aggs": {}
        };


        let aggregationsFields = this.getAggregationsFields();
        for (let key in aggregationsFields) {

            if (key === 'length' || !aggregationsFields.hasOwnProperty(key)) continue;

            let data = aggregationsFields[key];

            _source.aggs[key] = {
                filters: {filters: {}},
                aggs: {}
            };

            _source.aggs[key]['filters']['filters'][key] = {term: {}}
            _source.aggs[key]['filters']['filters'][key].term[data.search_field] = params.term.toLowerCase();
            _source.aggs[key]['aggs'][key] = {terms: {field: data.field}}
        }

        client.search({
            index: 'v5',
            type: 'property',
            method: "POST",
            size: 0,
            body: _source
        }, function selectQueryResponse(err, response) {

            let rows = [];

            for (let aggregationKey in response.aggregations) {

                let someAggregation = response.aggregations[aggregationKey];

                let _buckets = [];

                let data = null;
                for (let ind in someAggregation.buckets[aggregationKey][aggregationKey].buckets) {

                    data = someAggregation.buckets[aggregationKey][aggregationKey].buckets[ind];

                    _buckets.push({
                        id: data.key,
                        text: data.key,
                        count: data.doc_count,
                        taxonomy: data.slug
                    });


                }
                if (_buckets.length > 0) {

                    data = Object.assign({}, data, {
                        key: aggregationKey,
                        text: aggregationsFields[aggregationKey].title,
                        children: _buckets
                    });
                }

                rows.push(data);
            }
            callback(rows);
        });
    }

    static suggest(params, callback) {
        /**
         * @type {$.es.Client|*}
         */
        let client = new jQuery.es.Client({
            hosts: window.location.hostname
        });

        client.suggest({
            index: 'v5',
            type: 'property',
            method: "POST",
            size: 0,
            body: {
                "regular": {
                    "text": params.term.toLowerCase().replace(/\s+/g, ''),
                    "completion": {"field": "_search._suggest"}
                }
            }
        }, function (error, response) {
            callback(response);
        });
    }

    static search(params, callback) {
        /**
         * @type {$.es.Client|*}
         */
        let client = new jQuery.es.Client({
            hosts: window.location.hostname
        });

        let terms = {};
        terms['tax_input.'+params.tax] = [
            params.term
        ];

        let query = {
            "bool": {
                "must": [
                    {
                        "exists": {
                            "field": "_system.location"
                        }
                    },
                    {
                        "terms": terms
                    },
                    {
                        "terms": {
                            "tax_input.sale_type": [
                                params.saleType
                            ]
                        }
                    }
                ],
                "must_not": [
                    {
                        "term": {
                            "tax_input.location_latitude": "0"
                        }
                    },
                    {
                        "term": {
                            "tax_input.location_longitude": "0"
                        }
                    },
                    {
                        "missing": {
                            "field": "tax_input.location_latitude"
                        }
                    },
                    {
                        "missing": {
                            "field": "tax_input.location_longitude"
                        }
                    }
                ]
            }
        };

        if (params.locationFilter)
            query.bool = Object.assign(query.bool, {
                "filter": {
                    "geo_bounding_box": {
                        "_system.location": {
                            "top_left": {
                                "lat": params.topLeft.lat,
                                "lon": params.topLeft.lon
                            },
                            "bottom_right": {
                                "lat": params.bottomRight.lat,
                                "lon": params.bottomRight.lon
                            }

                        }
                    }
                }
            });

        query = JSON.stringify(query);

        let size = params.size || 500;

        let aggregations = JSON.stringify({});

        let source = JSON.stringify([
            "post_title",
            "tax_input.location_latitude",
            "tax_input.location_longitude",
            "_permalink",
            "_system.neighborhood",
            "_system.google_place_id",
            "_system .available_date",
            "_system.addressDetail",
            "_system.available_date",
            "_system.listed_date",
            "_system.agency_listing",
            "_metrics.score.total",
            "meta_input.rets_thumbnail_url",
            "tax_input.listing_type",
            "tax_input.bedrooms",
            "tax_input.bathrooms",
            "tax_input.price",
            "tax_input.total_living_area_sqft",
            "tax_input.days_on_market",
            "tax_input.acres",
            "tax_input.price_per_sqft",
            "tax_input.approximate_lot_size",
            "tax_input.subdivision",
            "tax_input.neighborhood",
            "tax_input.added",
            "tax_input.sale_type",
            "tax_input.location_city",
            "tax_input .location_street_number",
            "tax_input.location_direction",
            "tax_input.location_street",
            "tax_input.location_unit"
        ]);

        let index = 'v5',
            type = 'property';

        let esQuery = {
            index: index,
            type: type,
            method: "POST",
            body: JSON.parse('{"query":' + query + ',"_source": ' + source + ', "size":' + size + ',"sort":[{"_system.agency_listing":{"order":"asc"}},{"_metrics.score.total":{"order":"desc"}},{"post_title":{"order":"asc"}}],"aggregations":' + aggregations + '}'),
        };

        client.search(esQuery, function (error, response) {
            callback(response);
        });

    }


}

const ApiObject = connect(
    mapStateToProps,
    mapDispatchToProps
)(Api);

export default ApiObject;
