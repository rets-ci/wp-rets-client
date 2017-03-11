import React, {Component, PropTypes} from 'react';
import Util from '../Util.jsx';
export default class Map extends Component {
  static propTypes = {
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
    let initialCoordinates = {
      lat: +this.props.properties[0]._source.post_meta.wpp_location_latitude[0],
      lng: +this.props.properties[0]._source.post_meta.wpp_location_longitude[0]
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
      this.props.searchByCoordinates(true, Util.esGeoBoundingBoxObjFormat(
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
      let latLng = new window.google.maps.LatLng(p._source.post_meta.wpp_location_latitude ,p._source.post_meta.wpp_location_longitude);
      let marker = new window.google.maps.Marker({
        position: latLng,
        map: this.map
      });
      this.markers.push(marker);
    });
  }

  render() {
    let mapStyle = {
      height: '100%',
    };
    return (
      <div id="Map" ref={(r) => this.mapElement = r} style={mapStyle}></div>
    );
  }
}
