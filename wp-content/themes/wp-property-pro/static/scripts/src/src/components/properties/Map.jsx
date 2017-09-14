import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import Util from '../Util.jsx';
import { Lib } from '../../lib.jsx';


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
    searchByCoordinates: PropTypes.func.isRequired,
    properties: PropTypes.array.isRequired
  };
  constructor(props) {
    super(props);
    this.bounds;
    this.map;
    this.markers = [];
    this.state = {
      dragMode: false
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
    this.bounds = new google.maps.LatLngBounds();
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.properties, this.props.properties)) {
      this.updatingProperties = true;
      if (!this.state.dragMode) {
        let coordinates = this.getInitialCoordinates(null, nextProps.properties);
        this.setMapCoordinates(coordinates);
      }
      this.clearMarkers();
      this.clearBounds();
      this.setPropertyMarkers(nextProps.properties);
      if (!this.state.dragMode) {
        this.map.fitBounds(this.bounds);
        if (this.map.getZoom() < defaultZoom) {
          this.map.setZoom(defaultZoom);
        }
      }
      this.updatingProperties = false;
    }
    let condition = !this.markers.filter(m => m.selected).length || nextProps.selectedProperty !== this.markers.filter(m => m.selected)[0].propertyId;
    if (condition) {
      this.deselectMarkers(this.markers);
      this.selectMarker(this.markers, nextProps.selectedProperty);
    }
    this.setState({
      dragMode: false
    });
  }

  clearMarkers() {
    this.markers.forEach(m => {
      m.setMap(null);
    });
    this.markers = [];
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

  setMapCoordinates(coordinates) {
    if (!this.map) {
      this.map = new window.google.maps.Map(this.mapElement, {
        center: coordinates,
        mapTypeControlOptions: {mapTypeIds: []},
        scrollwheel: false,
        streetViewControl: false,
        zoom: defaultZoom,
        zoomControl: isMobile === false,
      });
    } else {
      this.map.setCenter(new google.maps.LatLng(coordinates.lat, coordinates.lng));
    }
  }

  setPropertyMarkers(properties) {
    properties.forEach(p => {
      let loc = new window.google.maps.LatLng(p._source.wpp_location_pin.lat, p._source.wpp_location_pin.lon);
      let marker = new window.google.maps.Marker({
        icon: defaultIcon,
        position: loc,
        map: this.map
      });
      marker.propertyId = p._id;
      marker.selected = false;
      marker.addListener('click', () => {
        let filter = {'selected_property': marker.propertyId};
        let queryParam = Util.updateQueryFilter(window.location.href, filter, 'set', false);
        Util.goToUrl(window.location.pathname + decodeURIComponent(queryParam));
      });
      this.markers.push(marker);
      this.bounds.extend(loc);
    });
  }

  componentDidMount() {
    let {
      currentGeoBounds
    } = this.props;
    // no properties to pass into `getInitialCoordinates`
    let coordinates = this.getInitialCoordinates(currentGeoBounds, null);
    this.setMapCoordinates(coordinates);
    // this.setPropertyMarkers(this.props.properties);
    this.map.addListener('dragend', () => this.onMapChange);
    this.map.addListener('zoom_changed', () => this.onMapChange);
  }

  onMapChange = () => {
    // only trigger the Geo change at a certain zoom level and exclude initial auto zoom to prevent ES requests duplicate
    if (this.map.getZoom() >= Lib.MAP_CHANGE_ZOOM_LIMIT || this.props.properties.length === 0 || this.updatingProperties) {
      return;
    }
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
    // enable drag mode to distinguish between initial load and dragging in componentWillReceiveProps
    this.setState({
      dragMode: true
    });
  }

  deselectMarkers(markers) {
    let selectedMarkers = markers.filter(m => m.selected);
    if (selectedMarkers.length) {
      selectedMarkers.forEach(m => {
        m.selected = false;
        m.setIcon(defaultIcon);
      });
    }
  }

  selectMarker(markers, selectedProperty) {
    // Remove all current selected markers
    let selectedMarker = markers.filter(m => m.propertyId === selectedProperty);
    if (selectedMarker.length) {
      selectedMarker[0].setIcon(selectedIcon);
      selectedMarker[0].selected = true;
    }
  }

  render() {
    return (
      <div id={Lib.THEME_CLASSES_PREFIX+"Map"} ref={(r) => this.mapElement = r} ></div>
    );
  }
};
