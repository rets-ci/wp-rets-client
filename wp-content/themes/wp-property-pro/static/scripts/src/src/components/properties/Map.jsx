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
    this.state = {};
    this.markers = [];
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.properties.length) {
      this.clearAllMarkers();
      this.setPropertyMarkers(nextProps.properties);
    }
  }

  clearAllMarkers() {
    this.markers.forEach(m => {
      m.setMap(null);
    });
  }

  componentDidMount() {
    let {
      currentGeoBounds
    } = this.props;
    let centerPoint;
    if (currentGeoBounds) {
      let calculateCenter = (
        new google.maps.LatLngBounds(
        {
          lat: +currentGeoBounds.sw.lat,
          lng: +currentGeoBounds.sw.lon
          }, {
          lat: +currentGeoBounds.ne.lat,
          lng: +currentGeoBounds.ne.lon
        }
        )
      ).getCenter();
      centerPoint = {
        lat: calculateCenter.lat(),
        lng: calculateCenter.lng()
      };
    } else if (this.props.properties.length) {
      centerPoint = {
        lat: this.props.properties.length ? +this.props.properties[0]._source.post_meta.wpp_location_pin[0] : 0,
        lng: this.props.properties.length ? +this.props.properties[0]._source.post_meta.wpp_location_pin[1] : 0
      };
    } else {
      centerPoint = 0;
    }

    let initialCoordinates = {
      lat: (centerPoint !== 0 ? centerPoint.lat : 0),
      lng: (centerPoint !== 0 ? centerPoint.lng : 0)
    };
    this.map = new window.google.maps.Map(this.mapElement, {
      center: initialCoordinates,
      scrollwheel: false,
      zoom: 9
    });
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
    });
  }

  setPropertyMarkers(properties) {
    properties.forEach((p) => {
      let latLng = new window.google.maps.LatLng(p._source.wpp_location_pin.lat, p._source.wpp_location_pin.lon);
      let marker = new window.google.maps.Marker({
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
