import React from 'react'

class Map extends React.Component {

    componentDidMount() {
        Map.loadMap();
    }

    static loadMap() {
        console.log("init");

        let myLatLng = {lat: -34.397, lng: 150.644};

        let map = new google.maps.Map(document.getElementById('map'), {
            center: myLatLng,
            scrollwheel: false,
            zoom: 8
        });

        // let url = "https://api.reddoorcompany.com/v5/property/_search?q=tax_input.location_city:Durham";
        let url = "https://api.reddoorcompany.com/v5/property/_search?source=%7B%22query%22%3A%7B%22bool%22%3A%7B%22must%22%3A%5B%7B%22exists%22%3A%7B%22field%22%3A%22_system.location%22%7D%7D%2C%7B%22terms%22%3A%7B%22tax_input.location_county%22%3A%5B%22Durham%22%5D%7D%7D%2C%7B%22terms%22%3A%7B%22tax_input.sale_type%22%3A%5B%22Rent%22%5D%7D%7D%5D%2C%22must_not%22%3A%5B%7B%22term%22%3A%7B%22tax_input.location_latitude%22%3A%220%22%7D%7D%2C%7B%22term%22%3A%7B%22tax_input.location_longitude%22%3A%220%22%7D%7D%2C%7B%22missing%22%3A%7B%22field%22%3A%22tax_input.location_latitude%22%7D%7D%2C%7B%22missing%22%3A%7B%22field%22%3A%22tax_input.location_longitude%22%7D%7D%5D%7D%7D%2C%22_source%22%3A%20%5B%22post_title%22%2C%22tax_input.location_latitude%22%2C%22tax_input.location_longitude%22%2C%22_permalink%22%2C%22_system.neighborhood%22%2C%22_system.google_place_id%22%2C%22_system.available_date%22%2C%22_system.addressDetail%22%2C%22_system.available_date%22%2C%22_system.listed_date%22%2C%22_system.agency_listing%22%2C%22_metrics.score.total%22%2C%22meta_input.rets_thumbnail_url%22%2C%22tax_input.listing_type%22%2C%22tax_input.bedrooms%22%2C%22tax_input.bathrooms%22%2C%22tax_input.price%22%2C%22tax_input.total_living_area_sqft%22%2C%22tax_input.days_on_market%22%2C%22tax_input.acres%22%2C%22tax_input.price_per_sqft%22%2C%22tax_input.approximate_lot_size%22%2C%22tax_input.subdivision%22%2C%22tax_input.neighborhood%22%2C%22tax_input.added%22%2C%22tax_input.sale_type%22%2C%22tax_input.location_city%22%2C%22tax_input.location_street_number%22%2C%22tax_input.location_direction%22%2C%22tax_input.location_street%22%2C%22tax_input.location_unit%22%5D%2C%20%22size%22%3A500%2C%22sort%22%3A%5B%7B%22_system.agency_listing%22%3A%7B%22order%22%3A%22asc%22%7D%7D%2C%7B%22post_title%22%3A%7B%22order%22%3A%22asc%22%7D%7D%5D%7D";

        jQuery.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            success: function (data) {
                let lastPosition;


                if (data.hits.hits.length) {
                    for (let i in data.hits.hits) {
                        let position = new google.maps.LatLng(data.hits.hits[i]._source.tax_input.location_latitude, data.hits.hits[i]._source.tax_input.location_longitude);
                        new google.maps.Marker({
                            position: position,
                            map: map,
                            title: data.hits.hits[i]._source.post_title
                        });

                        lastPosition = position;
                    }
                    map.setCenter(lastPosition);
                }
            }
        });


    }

    render() {

        var style = {
            height: '200px',
            width: '400px'
        }

        return (
            <div id="map" style={style}></div>
        )
    }
}

export default Map