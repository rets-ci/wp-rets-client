import React, {Component, PropTypes} from 'react';
import Util from '../Util.jsx';
import {Lib} from '../../lib.jsx';

export default class Map extends Component {
  static propTypes = {
    currentGeoBounds: PropTypes.object,
    searchByCoordinates: PropTypes.func.isRequired,
    properties: PropTypes.array.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      dragMode: false
    };
    this.markers = [];
    this.map;
  }

  calculateGeoRectangleCenterPoint(neLat, neLon, swLat, swLon) {
    let calculateCenter = (
        new google.maps.LatLngBounds(
        {
          lat: +swLat,
          lng: +swLon
          }, {
          lat: +neLat,
          lng: +neLon
        }
        )
      ).getCenter();
      return {
        lat: calculateCenter.lat(),
        lng: calculateCenter.lng()
      };
  }

  getInitialCoordinates(currentGeoBounds, properties) {
    // calculate the initial coordinates based on geo bounds from the URL or the properties
    let centerPoint;
    if (currentGeoBounds) {
      centerPoint = this.calculateGeoRectangleCenterPoint(currentGeoBounds.ne.lat, currentGeoBounds.ne.lon, currentGeoBounds.sw.lat, currentGeoBounds.swLon);
    } else if (properties && properties.length) {
      centerPoint = {
        lat: properties.length ? +properties[0]._source.post_meta.wpp_location_pin[0] : 0,
        lng: properties.length ? +properties[0]._source.post_meta.wpp_location_pin[1] : 0
      };
    } else {
      centerPoint = {
        lat: Lib.DEFAULT_MAP_COORDINATES.lat,
        lng: Lib.DEFAULT_MAP_COORDINATES.lng
      };
    }

    return centerPoint;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.properties !== this.props.properties) {
      if (!this.state.dragMode) {
        let coordinates = this.getInitialCoordinates(null, nextProps.properties);
        this.setMapCoordinates(coordinates);
      }
      this.clearAllMarkers();
      this.setPropertyMarkers(nextProps.properties);
      
    }
  }

  clearAllMarkers() {
    this.markers.forEach(m => {
      m.setMap(null);
    });
  }

  setMapCoordinates(coordinates) {
    if (!this.map) {
      this.map = new window.google.maps.Map(this.mapElement, {
        center: coordinates,
        scrollwheel: false,
        zoom: 9
      });
    } else {
      this.map.setCenter(
        coordinates
      );
    }
  }

  componentDidMount() {
    let {
      currentGeoBounds
    } = this.props;
    let coordinates = this.getInitialCoordinates(currentGeoBounds, this.props.properties);
    this.setMapCoordinates(coordinates);
    this.setPropertyMarkers(this.props.properties);
    this.map.addListener('dragend', () => {
      let bounds = this.map.getBounds();
      let ne = bounds.getNorthEast();
      let sw = bounds.getSouthWest();
      this.props.searchByCoordinates(Util.googleGeoFormatToElasticsearch(
        {
          ne: {
            lat: ne.lat(),
            lon: ne.lng()
          },
          sw: {
            lat: sw.lat(),
            lon: sw.lng()
          }
        }));
      // set localState to distinguish between initial load and dragging in componentWillReceiveProps
      this.setState({
        dragMode: true
      });
    });
  }

  setPropertyMarkers(properties) {
    let icon = {
      url: '/wp-content/themes/wp-property-pro/static/images/src/oval-3-25.png',
    }
    properties.forEach((p) => {
      let latLng = new window.google.maps.LatLng(p._source.wpp_location_pin.lat, p._source.wpp_location_pin.lon);
      let marker = new window.google.maps.Marker({
        icon: icon,
        position: latLng,
        map: this.map
      });
      this.markers.push(marker);
    });
  }

  render() {
    return (
      <div id={Lib.THEME_CLASSES_PREFIX+"Map"} className={Lib.THEME_CLASSES_PREFIX+"map-container"} ref={(r) => this.mapElement = r} ></div>
    );
  }
}
