import React from 'react'
import {connect} from 'react-redux';
import {addMap} from '../actions/index.jsx';
import {getApi} from '../actions/index.jsx';

const mapStateToProps = (state) => {
    return {}
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addMapToStore: (map) => {
            dispatch(addMap(map));
        },
        loadAPi: (location_filter) => {

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
                                    "Durham"
                                ]
                            }
                        },
                        {
                            "terms": {
                                "tax_input.sale_type": [
                                    "Rent"
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

            if (location_filter)
                query.bool = Object.assign(query.bool, {
                    "filter": {
                        "geo_bounding_box": {
                            "tax_input.location_latitude": {
                                "top_left": {
                                    "lat": location_filter.top_left.lat,
                                    "lon": location_filter.top_left.lon
                                },
                                "bottom_right": {
                                    "lat": location_filter.bottom_right.lat,
                                    "lon": location_filter.bottom_right.lon
                                }

                            }
                        }
                    }
                });

            query = JSON.stringify(query);

            let size = 500;

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
                dispatch(getApi(response));
            });
        }
    }
};

const Map = function ({mapState, response, addMapToStore, loadAPi}) {

    if (typeof mapState.map === 'undefined'){
        setTimeout(function () {
            map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 35.994033, lng: -78.898619},
                scrollwheel: false,
                zoom: 9
            });

            let location_filter = null;

            map.addListener('dragend', function () {
                console.log('Dragged');
                let bounds = map.getBounds();
                let NE = bounds.getNorthEast();
                let SW = bounds.getSouthWest();

                location_filter = {
                    "top_left": {
                        "lat": NE.lat(),
                        "lon": NE.lng()
                    },
                    "bottom_right": {
                        "lat": SW.lat(),
                        "lon": SW.lng()
                    }
                };

                loadAPi(location_filter);
            });

            addMapToStore(map);
        }, 500);
    }


    if (typeof response.hits !== 'undefined') {

        let map = mapState.map;

        let lastPosition;

        if (response.hits.hits.length) {
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

        addMapToStore(map);
    }else
        if(typeof mapState.map !== 'undefined')
            loadAPi();

    let style = {
        height: '200px',
        width: '400px'
    };

    return (
        <div id="map" style={style}>Loading ...</div>
    )
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Map);