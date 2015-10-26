/**
 * Script for the theme customizer.
*/

(function(madison_customizer) {

	madison_customizer(window.jQuery, window, document);

	}(function($, window, document) {
		$(function() {

			if ( $( '#customize-control-show_on_front input[value="page"]' ).is( ':checked' ) ) {
				$( '#customize-control-madison_front_page_message' ).css( 'display', 'list-item' );
			} else {
				$( '#customize-control-madison_front_page_message' ).css( 'display', 'none' );
			}

			$( '#customize-control-show_on_front input[value="page"]' ).on( 'change', function() {
				if ( $( this ).is( ':checked' ) ) {
					$( '#customize-control-madison_front_page_message' ).css( 'display', 'list-item' );
				} else {
					$( '#customize-control-madison_front_page_message' ).css( 'display', 'none' );
				}
			});

		});
	})
);