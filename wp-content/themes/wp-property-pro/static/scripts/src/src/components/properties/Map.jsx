import get from 'lodash/get';
import React, {Component} from 'react';
import GoogleMap from 'google-map-react';
import {fitBounds} from 'google-map-react/utils';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import Marker from './Map/Marker.jsx';

import Util from '../Util.jsx';
import {Lib} from '../../lib.jsx';


let defaultIcon = {
  url: bundle.static_images_url + 'oval-3-25.png',
};

let selectedIcon = {
  url: bundle.static_images_url + 'oval-selected-3-25.png'
};

let defaultZoom = 9;

const isMobile = window.innerWidth < Lib.MOBILE_WIDTH;

export default class Map extends Component {
  static propTypes = {
    currentGeoBounds: PropTypes.object,
    historyPush: PropTypes.func.isRequired,
    searchByCoordinates: PropTypes.func.isRequired,
    properties: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.boundsArray;
    this.state = {
      dragMode: false,
      markers: [],
      zoom: defaultZoom
    };

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

  clearBounds() {
    this.boundsArray = new google.maps.LatLngBounds();
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.properties, this.props.properties)) {
      this.updatingProperties = true;

      this.clearMarkers();
      this.clearBounds();
      this.setPropertyMarkers(nextProps.properties);
      if (!this.state.dragMode) {
        let size = {
          width: document.getElementById(Lib.THEME_CLASSES_PREFIX + "Map").offsetWidth,
          height: document.getElementById(Lib.THEME_CLASSES_PREFIX + "Map").offsetHeight,
        };
        // fitBounds(this.boundsArray, size);
      }
      this.updatingProperties = false;
    }

    if (nextProps.selectedProperty) {
      this.setPropertyMarkers(nextProps.properties, nextProps.selectedProperty);
    }
    // this.setState({
    //   dragMode: false
    // });
  }

  clearMarkers() {
    this.setState = {
      markers: []
    };
  }

  getInitialCoordinates(currentGeoBounds, properties) {
    // calculate the initial coordinates based on geo bounds from the URL or the properties
    let centerPoint;
    if (currentGeoBounds) {
      centerPoint = this.calculateGeoRectangleCenterPoint(currentGeoBounds.ne.lat, currentGeoBounds.ne.lon, currentGeoBounds.sw.lat, currentGeoBounds.sw.Lon);
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

  setPropertyMarkers(properties, selectedProperty = false) {
    properties.forEach(p => {
      let propertyId = get(p, '_source.post_meta.rets_mls_number[0]', null);
      let selected = selectedProperty && selectedProperty === propertyId;
      let loc = new window.google.maps.LatLng(p._source.wpp_location_pin.lat, p._source.wpp_location_pin.lon);


      let marker = <Marker
        // required props
        key={propertyId}
        lat={p._source.wpp_location_pin.lat}
        lng={p._source.wpp_location_pin.lon}
        icon={selected ? selectedIcon : defaultIcon}
                           selected={selected}
                           onClickHandler={() => {
                             this.props.updateSelectedProperty(propertyId)
                           }}/>;
      if (!get(p, '_source.post_meta.rets_mls_number[0]', null)) {
        console.log('mls reference missing from the data, property selection on at least some of the items wont work as expected');
      }
      this.state.markers.push(marker);
      this.boundsArray.extend(loc);
    });
  }

  _onBoundsChange = (center, zoom, bounds, marginBounds) => {
    // only trigger the Geo change at a certain zoom level and exclude initial auto zoom to prevent ES requests duplicate
    if (zoom >= Lib.MAP_CHANGE_ZOOM_LIMIT || this.props.properties.length === 0 || this.updatingProperties) {
      return;
    }

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
    // enable drag mode to distinguish between initial load and dragging in componentWillReceiveProps
    this.setState({
      dragMode: true,
      zoom: zoom
    });
  }

  render() {

    let google_api_key = get(bundle, 'google_api_key');

    if (!google_api_key) {
      return null;
    }

    let {
      currentGeoBounds
    } = this.props;

    let coordinates = this.getInitialCoordinates(currentGeoBounds, null);
console.log(coordinates);
    let center = [coordinates.lat, coordinates.lng];
    return (
      <div id={Lib.THEME_CLASSES_PREFIX + "Map"} ref={(r) => this.mapElement = r}>
        <GoogleMap
          bootstrapURLKeys={{
            key: google_api_key,
            language: 'en'
          }}
          center={center}
          zoom={this.state.zoom}
          onBoundsChange={this._onBoundsChange}
        >
        {this.state.markers}
        </GoogleMap>
      </div>
    );
  }
};
