(function(madison_single_property_map) {

	madison_single_property_map(window.jQuery, window, document);

	}(function($, window, document) {
		var map;
		var marker;
		var infowindow;

		$(function() {
			if( typeof google == 'object' ) {
				initialize_this_map();
			} else {
				jQuery( "#property-map" ).hide();
			}
		});

		function initialize_this_map() {
			var myLatlng = new google.maps.LatLng(madison_property_map.latitude,madison_property_map.longitude);
			var myOptions = {
				zoom: parseInt( madison_property_map.zoom ),
				center: myLatlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				draggable: false,
				scrollwheel: false,
				disableDoubleClickZoom: true,
				zoomControl: false
			}

			map = new google.maps.Map( document.getElementById( madison_property_map.id ), myOptions );

			infowindow = false;

			marker = new google.maps.Marker({
				position: myLatlng,
				map: map,
				icon: madison_property_map.icon
			});
		}
	})
);