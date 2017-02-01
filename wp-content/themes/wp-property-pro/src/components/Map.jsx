import React from 'react'
import {connect} from 'react-redux';
import {addMap, setMapMarkers} from '../actions/index.jsx';
import Api from '../containers/Api.jsx';

const mapStateToProps = (state) => {
    return {
        mapState: state.mapState,
        props: state.mapPropsState.mapProps,
        mapMarkersState: state.mapMarkersState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addMap: (map) => {
            dispatch(addMap(map));
        },
        saveMarkers: (map, response, mapMarkers) => {

            if (response.hits.hits.length) {

                let markers = [];

                for(let i in mapMarkers){
                    let marker = mapMarkers[i];
                    marker.setMap(null);
                }

                let lastPosition;

                for (let i in response.hits.hits) {
                    let position = new google.maps.LatLng(response.hits.hits[i]._source.tax_input.location_latitude, response.hits.hits[i]._source.tax_input.location_longitude);
                    let marker = new google.maps.Marker({
                        position: position,
                        map: map,
                        title: response.hits.hits[i]._source.post_title
                    });

                    markers.push(marker);

                    lastPosition = position;
                }

                map.setCenter(lastPosition);

                dispatch(setMapMarkers(markers));
            }

        }
    }
};

class Map extends React.Component {

    componentWillReceiveProps(nextProps) {

        if(typeof nextProps == 'undefined')
            return;

        let map = nextProps.mapState.map;

        if(nextProps.props){

            if(nextProps.props == this.props.props)
                return;

            nextProps.saveMarkers(map, nextProps.props, nextProps.mapMarkersState.mapMarkers);
        }
    }

    shouldComponentUpdate() {
        return typeof this.props.mapState.map == 'undefined';
    }

    componentDidMount() {

        if (typeof this.props.mapState.map != 'undefined')
            return;

        let map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 35.994033, lng: -78.898619},
            scrollwheel: false,
            zoom: 9
        });

        let instance = this;

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

                if (typeof response === 'undefined')
                    return;

                instance.opts.saveMarkers(map, response, instance.opts.mapMarkers);
            });
        });

        this.props.addMap(map);
    }

    render() {
        let style = {
            height: '200px',
            width: '400px'
        };

        return (
            <div>
                <div id="map" style={style}>Loading ...</div>
            </div>
        )
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Map);