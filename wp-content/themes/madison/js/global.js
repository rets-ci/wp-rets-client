(function( $ ) {
	$( 'body' ).fitVids({
		customSelector: "iframe[src*='rd.io'], iframe[src*='rdio.com']",
	});

	$( '#site-header' ).on( 'click', '#mobile-menu-toggle, #mobile-menu-close', function( event ) {
		event.preventDefault();

		$( 'body' ).toggleClass( 'mobile-menu-active' )
	});

	// Property Search Toggle
	$( '.site-navigation' ).on( 'click', '.menu-item-property-search a', function( event ) {
		event.preventDefault();

		if ( $( this ).parent().hasClass( 'current-menu-item' ) ) {
			$( this ).parent().parent().find( '[data-current="true"]' ).addClass( 'current-menu-item' );
			$( this ).parent().removeClass( 'current-menu-item' );
			$( '.section-property-search' ).slideUp();
		} else {
			$( this ).parent().parent().find( '.current-menu-item' ).attr( 'data-current', 'true' ).removeClass( 'current-menu-item' );
			$( this ).parent().addClass( 'current-menu-item' );
			$( '.section-property-search' ).slideDown();
		}
	});

	// Custom event for loading fitvids when using infinite scroll.
	$( document.body ).on( 'post-load', function() {
		$( '.post' ).fitVids({
			customSelector: "iframe[src*='rd.io'], iframe[src*='rdio.com']",
		});
	});

	$( window ).scroll( function() {
		if ( $( this ).scrollTop() > 200 ) {
			$( '#site-footer .scroll-to-top' ).fadeIn();
		} else {
			$( '#site-footer .scroll-to-top' ).fadeOut();
		}
	});

	$( '#site-footer' ).on( 'click', '.scroll-to-top', function( event ) {
		event.preventDefault();

		$( 'body, html' ).animate({
			scrollTop: 0
		}, 500);
	});
}( jQuery ));