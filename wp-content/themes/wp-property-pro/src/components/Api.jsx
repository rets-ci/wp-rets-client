import React from 'react'


class Api extends React.Component {

    static search(params, callback) {
        /**
         * @type {$.es.Client|*}
         */
        let client = new jQuery.es.Client({
            hosts: window.location.hostname
        });

        let query = {
            "bool": {
                "must": [
                    {
                        "exists": {
                            "field": "_system.location"
                        }
                    },
                    {
                        "terms": {
                            "tax_input.location_county": [
                                params.locationCountry
                            ]
                        }
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

        client.search(esQuery, function getPropertiesResponse(error, response) {
            callback(response);
        });

    }

    static refreshMapMarkers(map, response){

        if (response.hits.hits.length) {

            let lastPosition;

            for (let i in response.hits.hits) {
                let position = new google.maps.LatLng(response.hits.hits[i]._source.tax_input.location_latitude, response.hits.hits[i]._source.tax_input.location_longitude);
                new google.maps.Marker({
                    position: position,
                    map: map,
                    title: response.hits.hits[i]._source.post_title
                });

                lastPosition = position;
            }
            map.setCenter(lastPosition);
        }
    }
}

export default Api;