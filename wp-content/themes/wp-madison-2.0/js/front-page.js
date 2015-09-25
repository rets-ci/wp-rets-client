(function( $ ) {
	if ( $( '#property-featured .property' ).data( 'backstretch' ) ) {
		$( '#property-featured .property' ).parent().backstretch( $( '.property' ).data( 'backstretch' ) ).find( '.property-image' ).css( 'visibility', 'hidden' );
	}
})( jQuery );