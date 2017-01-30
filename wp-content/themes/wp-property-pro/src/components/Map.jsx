import React from 'react'
import {connect} from 'react-redux';
import {addMap} from '../actions/index.jsx';
import Api from './Api.jsx';

const mapStateToProps = () => {
    return {}
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addMapToStore: (map) => {
            dispatch(addMap(map));
        }
    }
};

class Map extends React.Component {

    componentDidMount() {

        let map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 35.994033, lng: -78.898619},
            scrollwheel: false,
            zoom: 9
        });

        map.addListener('dragend', function () {
            let bounds = map.getBounds();
            let NE = bounds.getNorthEast();
            let SW = bounds.getSouthWest();

            let searchParams = {
                locationCountry: 'Durham',
                saleType: 'Rent',
                locationFilter: true,
                topLeft: {
                    lat: NE.lat(),
                    lon: NE.lng()
                },
                bottomRight: {
                    "lat": SW.lat(),
                    "lon": SW.lng()
                }
            };

            Api.search(searchParams, function (response) {

                if(typeof response === 'undefined')
                    return;

                Api.refreshMapMarkers(map, response);
            });
        });

        this.props.addMapToStore(map);
    }

    render() {
        let style = {
            height: '200px',
            width: '400px'
        };

        return (
            <div id="map" style={style}>Loading ...</div>
        )
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Map);