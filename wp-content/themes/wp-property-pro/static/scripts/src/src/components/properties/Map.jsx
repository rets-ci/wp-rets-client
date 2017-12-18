import get from 'lodash/get';
import React, { Component } from 'react';
import GoogleMap from 'google-map-react';
import { fitBounds } from 'google-map-react/utils';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';

import Marker from './Map/Marker.jsx';

import Util from '../Util.jsx';
import { Lib } from '../../lib.jsx';


let defaultIcon = {
  url: bundle.static_images_url + 'oval-3-25.png',
};

const DEFAULT_ZOOM = 9;

let selectedIcon = {
  url: bundle.static_images_url + 'oval-selected-3-25.png'
};


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
    this.points = [];
    this.currentZoom = 0;
    this.currentCenter = {};
    this.userDrag = false;
    this.updatingProperties = false;
  }

  shouldComponentUpdate(nextProps) {
    let shouldComponentUpdate = this.props.properties !== get(nextProps, 'properties', null) ||
      this.props.currentGeoBounds !== get(nextProps, 'currentGeoBounds', null) ||
      this.props.selectedProperty !== get(nextProps, 'selectedProperty');

    return shouldComponentUpdate;
  }

  componentWillUpdate(){
    this.points = [];
    this.updatingProperties = true;
  }

  componentDidUpdate(){
    this.updatingProperties = false;
  }

  markers(properties, selectedProperty = false) {
    return properties.map(p => {
      let propertyId = get(p, '_source.post_meta.rets_mls_number[0]', null);
      let selected = selectedProperty && selectedProperty === propertyId;

      if (!get(p, '_source.post_meta.rets_mls_number[0]', null)) {
        console.log('mls reference missing from the data, property selection on at least some of the items wont work as expected');
      }

      let loc = { lat: p._source.wpp_location_pin.lat, lng: p._source.wpp_location_pin.lon }
      this.points.push(loc);

      return (<Marker
        // required props
        key={propertyId}
        lat={p._source.wpp_location_pin.lat}
        lng={p._source.wpp_location_pin.lon}
        icon={selected ? selectedIcon : defaultIcon}
        onClickHandler={() => {
          this.props.updateSelectedProperty(propertyId)
        }} />);
    });
  }

  calculateGeoBoundsByPoints(points) {
    let bounds = new window.google.maps.LatLngBounds();
    points.forEach(point => {
      bounds.extend(new window.google.maps.LatLng({ lat: +point.lat, lng: +point.lng }));
    });

    let ne = bounds.getNorthEast();
    let sw = bounds.getSouthWest();
    let finalBounds = {
      ne: {
        lat: ne.lat(),
        lng: ne.lng()
      },
      sw: {
        lat: sw.lat(),
        lng: sw.lng()
      }
    };
    return finalBounds;
  }

  handleOnDrag(bounds, zoom) {

    // only trigger the Geo change at a certain zoom level and exclude initial auto zoom to prevent ES requests duplicate
    if (zoom >= Lib.MAP_CHANGE_ZOOM_LIMIT || this.updatingProperties) {
      return null;
    }

    if (!bounds) {
      console.log('Missing bounds');
      return null;
    }

    this.userDrag = true;

    this.props.searchByCoordinates(
      Object.assign({},
        Util.googleGeoFormatToElasticsearch(
          {
            ne: {
              lat: bounds.ne.lat,
              lon: bounds.ne.lng
            },
            sw: {
              lat: bounds.sw.lat,
              lon: bounds.sw.lng
            }
          }
        )
      )
    );

  }

  convertCoordsFromEsToMap(currentGeoBounds){
    return {
      "ne": {
        "lat": currentGeoBounds.ne.lat,
        "lng": currentGeoBounds.ne.lon
      },
      "sw": {
        "lat": currentGeoBounds.sw.lat,
        "lng": currentGeoBounds.sw.lon
      }
    };
  }

  render() {
    let {
      currentGeoBounds,
      properties,
      selectedProperty
    } = this.props;

    let boundsOptions;
    let center;
    let google_api_key = get(bundle, 'google_api_key');
    let size = {
      width: Lib.SEARCH_MAP_SIZE_WIDTH,
      height: Lib.SEARCH_MAP_SIZE_HEIGHT
    };
    if (!google_api_key) { return null; }

    let markers = properties.length > 0 ? this.markers(properties, selectedProperty) : null;
    let zoom;

    if (currentGeoBounds) {
      if(this.userDrag){
        // Drag event shouldn't update center and zoom
        zoom = this.currentZoom;
        center = this.currentCenter;
      }else{
        boundsOptions = fitBounds(this.convertCoordsFromEsToMap(currentGeoBounds), size);
        center = boundsOptions.center;
        zoom = boundsOptions.zoom;
      }
    } else if (this.points.length) {
      let geoBounds = this.calculateGeoBoundsByPoints(this.points);
      boundsOptions = fitBounds(geoBounds, size);
      center = boundsOptions.center;
      zoom = boundsOptions.zoom;
    } else {
      center = {
        lat: Lib.DEFAULT_MAP_COORDINATES.lat,
        lng: Lib.DEFAULT_MAP_COORDINATES.lng
      };
      zoom = DEFAULT_ZOOM;
    }

    // Store current options values
    this.currentCenter = center;
    this.currentZoom = zoom;

    return (
      <div id={Lib.THEME_CLASSES_PREFIX + "Map"}>
        <GoogleMap
          bootstrapURLKeys={{
            key: google_api_key,
            language: 'en'
          }}
          center={center}
          zoom={zoom}
          onDrag={debounce((options) => {
            this.handleOnDrag({ ne: this._updatedBounds.ne, sw: this._updatedBounds.sw });
          }, 500)}
          onChange={({ bounds, center, zoom }) => {
            this._updatedBounds = bounds;

            // Zoom change event case
            if(zoom !== this.currentZoom && !this.updatingProperties){
              this.handleOnDrag({ ne: this._updatedBounds.ne, sw: this._updatedBounds.sw }, zoom);
            }

          }}
          options={{
            zoomControl: isMobile === false,
            fullscreenControl: false
          }}
        >
          {markers}
        </GoogleMap>
      </div>
    );
  }
};
