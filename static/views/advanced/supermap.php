<?php
//ng-init
/*
<style >
  #map {
    width: 100%;
    height: 400px;
  }
</style>

<!-- <script src="https://maps.googleapis.com/maps/api/js"></script> -->
<!-- <script src="<?php echo ud_get_wpp_supermap()->path( 'bower_components/js-marker-clusterer/examples/data.json' ) ?>"></script> -->
<script src="<?php echo ud_get_wpp_supermap()->path( 'bower_components/js-marker-clusterer/src/markerclusterer.js' ) ?>"></script>

<script>

  var properties = <?php echo json_encode( array_values( $properties ) ); ?>;

  console.log( properties );

  function initialize() {
    //console.log( 'DATA', data );
    var center = new google.maps.LatLng(37.4419, -122.1419);
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 3,
      center: center,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    var markers = [];
    for (var i = 0; i < properties.length; i++) {
      var property = properties[i];
      var latLng = new google.maps.LatLng(property.latitude,
        property.longitude);
      var marker = new google.maps.Marker({
        position: latLng
      });
      markers.push(marker);
    }
    var markerCluster = new MarkerClusterer(map, markers);
  }
  google.maps.event.addDomListener(window, 'load', initialize);
</script>

<div id="map-container"><div id="map"></div></div>
//*/

?>
<div ng-app="wppSupermap<?php echo rand( 1001, 9999 ); ?>" data-query="<?php echo urlencode( serialize( $query ) ) ?>" data-atts="<?php echo urlencode( serialize( $atts ) ) ?>" class="wpp-advanced-supermap">

  <div ng-controller="main">

    <div class="row">

      <div class="col-md-6 sm-google-map-wrap">
        <ng-map zoom="4" center="[43.6650000, -79.4103000]" class="sm-google-map" default-style="false"></ng-map>
        <div class="marker-infowindow">
          <div class="infowindow">
            <h4>{{currentProperty.post_title}}</h4>
          </div>
        </div>
      </div>

      <div class="col-md-6 sm-properties-list-wrap">
        <div class="sm-sidebar-top">
          {{total}} <?php printf( __( '%s found in %s', ud_get_wpp_supermap()->domain ), \WPP_F::property_label('plural'), 'Raleigh' ); ?>
        </div>
        <table st-table="properties" class="table table-striped sm-properties-list">
          <thead>
          <tr>
            <th>ID</th>
            <th>post_title</th>
            <th>city</th>
          </tr>
          </thead>
          <tbody>
          <tr st-select-row="row" ng-repeat="row in properties">
            <td>{{row.ID}}</td>
            <td>{{row.post_title}}</td>
            <td>{{row.city}}</td>
          </tr>
          </tbody>
        </table>
      </div>

    </div>

  </div>

</div>
