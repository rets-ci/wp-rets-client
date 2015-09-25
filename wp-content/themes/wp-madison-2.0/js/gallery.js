(function( $ ) {

	var galleries = $( '.entry-content' ).find( '.gallery' );

	$.each( galleries, function() {
		var gallery = $( this ).attr( 'id' );
		var link = $( this ).find( 'a' );

		if ( link.attr('href').match( /\.(jpg|png|gif)/i ) ) {
			$( link ).addClass( gallery );
		}

		$( '#' + gallery ).find( '.' + gallery ).on( 'click', function() {

		}).colorbox({
			rel: gallery,
			opacity: 1,
			open: false,
			preloading: false,
			fixed: true,
			slideshow: true,
			slideshowAuto: false,
			slideshowSpeed: '4000',
			innerWidth: '97%',
			innerHeight: '95%',
			slideshowStart: '<i class="fa fa-play"></i>',
			slideshowStop: '<i class="fa fa-pause"></i>',
			close: '<i class="fa fa-times"></i>',
			previous: '<i class="fa fa-chevron-left"></i>',
			next: '<i class="fa fa-chevron-left"></i>',
			onOpen: function() {
				$( '#cboxContent' ).addClass( 'gallery-open' );
				$( '#cboxClose' ).delay(500).fadeTo(1,1);
				$( '#wrap, #wpadminbar' ).fadeTo(350,0);
				$( '#cboxContent, #cboxOverlay' ).delay(450).fadeTo(500,1);
			},
			onClosed: function() {
				$( '#cboxContent' ).removeClass( 'gallery-open' );
				$( '#cboxClose' ).fadeTo(1,0);
				$( '#wrap, #wpadminbar' ).fadeTo(350,1);
			}
		});
	});
})( jQuery );