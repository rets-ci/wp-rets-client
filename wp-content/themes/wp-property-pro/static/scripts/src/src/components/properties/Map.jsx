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
    this.bounds = [];

    this.state = {
      dragged: false
    };
  }

  shouldComponentUpdate(nextProps) {
    let shouldComponentUpdate = !this.state.dragged && this.props.properties !== get(nextProps.props, 'properties', null)
      || this.props.currentGeoBounds !== get(nextProps.props, 'currentGeoBounds', null)
      || this.props.selectedProperty !== get(nextProps.props, 'selectedProperty');

    return shouldComponentUpdate;
  }

  getInitialCoordinates(currentGeoBounds, properties) {
    // calculate the initial coordinates based on geo bounds from the URL or the properties
    let centerPoint;
    if (currentGeoBounds) {
      let size = {
        width: document.getElementById(Lib.THEME_CLASSES_PREFIX + "Map").offsetWidth,
        height: document.getElementById(Lib.THEME_CLASSES_PREFIX + "Map").offsetHeight
      };

      centerPoint = fitBounds(currentGeoBounds, size);
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
    this.bounds = [];
    return properties.map(p => {
      let propertyId = get(p, '_source.post_meta.rets_mls_number[0]', null);
      let selected = selectedProperty && selectedProperty === propertyId;

      if (!get(p, '_source.post_meta.rets_mls_number[0]', null)) {
        console.log('mls reference missing from the data, property selection on at least some of the items wont work as expected');
      }

      let loc = this.coordinate(p._source.wpp_location_pin.lat, p._source.wpp_location_pin.lon);
      this.bounds.push(loc);

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

  componentDidMount(){

  }

  coordinate(x, y) {
    return {
      x: x,
      y: y
    }
  }

  _onBoundsChanged(options){

    if(!this.state.dragged){
      return null;
    }

    let bounds = get(options, 'bounds');

    console.log(options);
    if(!bounds){
      console.log('Missing bounds');
      return null;
    }


    this.props.searchByCoordinates(Object.assign(Util.googleGeoFormatToElasticsearch(
      {
        ne: {
          lat: bounds.ne.lat,
          lon: bounds.ne.lng
        },
        sw: {
          lat: bounds.sw.lat,
          lon: bounds.sw.lng
        }
      }), {
      zoom: get(options, 'zoom', defaultZoom)
    }));

    this.setState({
      dragged: false
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

    let markers = properties.length > 0 ? this.setPropertyMarkers(properties, selectedProperty) : null;

    // console.log(currentGeoBounds);
    let coordinates = this.getInitialCoordinates(currentGeoBounds, null);
    let center = [coordinates.lat, coordinates.lng];

    let zoom = parseInt(get(currentGeoBounds, 'zoom', defaultZoom));

    if(!currentGeoBounds && markers){
        // Define bounds options
        let maxN, maxS, maxE, maxW, nw, se;
        let arr = this.bounds;
        for(let i = 0; i < arr.length; i++) {
          if(maxN == undefined) { maxN = arr[i].y; }
          if(maxS == undefined) { maxS = arr[i].y; }
          if(maxE == undefined) { maxE = arr[i].x; }
          if(maxW == undefined) { maxW = arr[i].x; }

          if(arr[i].y > maxN){
            maxN = arr[i].y;
          }

          if(arr[i].x > maxE){
            maxE = arr[i].x;
          }

          if(arr[i].y < maxS){
            maxS = arr[i].y;
          }

          if(arr[i].x < maxW){
            maxW = arr[i].x;
          }
        }

        nw = {
          x: maxW,
          y: maxN
        };

        se = {
          x: maxE,
          y: maxS
        };

        let bounds = {
          nw: {
            lat: nw.x,
            lng: nw.y
          },
          se: {
            lat: se.x,
            lng: se.y
          }
        };


        let size = {
          width: document.getElementById(Lib.THEME_CLASSES_PREFIX + "Map").offsetWidth,
          height: document.getElementById(Lib.THEME_CLASSES_PREFIX + "Map").offsetHeight
        };

        let options = fitBounds(bounds, size);
        // Define zoom level for bounds
        if(get(options, 'zoom') < 1 || isNaN(get(options, 'zoom'))){
          let GLOBE_WIDTH = 256; // a constant in Google's map projection
          let angle = maxE - maxW;
          if (angle < 0) {
            angle += 360;
          }
          zoom = Math.round(Math.floor(Math.log(size.width * 360 / angle / GLOBE_WIDTH) / Math.LN2) - 1);
        }

        if(options){
          center = options.center;
        }


    }

    return (
      <div id={Lib.THEME_CLASSES_PREFIX + "Map"} ref={(r) => this.mapElement = r}>
        <GoogleMap
          bootstrapURLKeys={{
            key: google_api_key,
            language: 'en'
          }}
          center={center}
          zoom={zoom}
          onChange={(options) => {this._onBoundsChanged(options)}}
          onZoomAnimationEnd={() => {console.log(zoom);this.setState({
            dragged: true
          });
          }}

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
