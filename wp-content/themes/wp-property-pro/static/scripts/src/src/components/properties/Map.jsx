import React, {Component, PropTypes} from 'react';

export default class Map extends Component {
  static propTypes = {
    properties: PropTypes.array.isRequired
  };

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps', nextProps);
    if (nextProps.properties.length) {
      this.setPropertyMarkers(nextProps.properties);
    }
  }

  componentDidMount() {
    let initialCoordinates = {
      lat: +this.props.properties[0]._source.tax_input.location_latitude[0],
      lng: +this.props.properties[0]._source.tax_input.location_longitude[0]
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
      // TODO: call query with the new geo locations
    });
  }

  setPropertyMarkers(properties) {
    properties.forEach((p) => {
      let latLng = new window.google.maps.LatLng(p._source.tax_input.location_latitude ,p._source.tax_input.location_longitude);
      new window.google.maps.Marker({
        position: latLng,
        map: this.map
      });
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
