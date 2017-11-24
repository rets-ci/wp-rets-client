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
    this.state = {
      zoom: defaultZoom
    };
  }

  componentWillReceiveProps(nextProps){

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
    return properties.map(p => {
      let propertyId = get(p, '_source.post_meta.rets_mls_number[0]', null);
      let selected = selectedProperty && selectedProperty === propertyId;

      if (!get(p, '_source.post_meta.rets_mls_number[0]', null)) {
        console.log('mls reference missing from the data, property selection on at least some of the items wont work as expected');
      }

      return (<Marker
        // required props
        key={propertyId}
        lat={p._source.wpp_location_pin.lat}
        lng={p._source.wpp_location_pin.lon}
        icon={selected ? selectedIcon : defaultIcon}
        onClickHandler={() => {
          this.props.updateSelectedProperty(propertyId)
        }}/>);
    });
  }

  render() {

    let google_api_key = get(bundle, 'google_api_key');

    if (!google_api_key) {
      return null;
    }

    let {
      currentGeoBounds,
      properties,
      selectedProperty
    } = this.props;

    let coordinates = this.getInitialCoordinates(currentGeoBounds, null);
    let center = [coordinates.lat, coordinates.lng];

    let markers = properties.length > 0 ? this.setPropertyMarkers(properties, selectedProperty) : null;

    return (
      <div id={Lib.THEME_CLASSES_PREFIX + "Map"} ref={(r) => this.mapElement = r}>
        <GoogleMap
          bootstrapURLKeys={{
            key: google_api_key,
            language: 'en'
          }}
          center={center}
          zoom={this.state.zoom}
          options={
            {
              zoomControl: isMobile === false
            }
          }
        >
          {markers}
        </GoogleMap>
      </div>
    );
  }
};
