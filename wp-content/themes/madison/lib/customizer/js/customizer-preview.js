/**
 * Script for the theme customizer.
*/
( function( $ ) {
	// Site title and description.
	wp.customize( 'blogname', function( value ) {
		value.bind( function( to ) {
			$( '.site-title a span' ).text( to );
		} );
	} );
	wp.customize( 'blogdescription', function( value ) {
		value.bind( function( to ) {
			$( '.site-tagline' ).text( to );
		} );
	} );

	// Layout setting.
	wp.customize( 'madison_layout_setting', function( value ) {
		value.bind( function( to ) {
			if ( 'left' === to ) {
				$( 'body' ).addClass( 'sidebar-left' );
			} else {
				$( 'body' ).removeClass( 'sidebar-left' );
			}
		} );
	} );

	// Header background color.
	wp.customize( 'madison_header_background_color', function( value ) {
		value.bind( function( to ) {
			if ( false === to ) {
				return;
			} else {
				$( '.section-header-navigation' ).css( {
					'background-color': to
				} );
        $( '.section-property-search' ).css( {
          'border-bottom-color': to
        } );
			}
		} );
	} );

	// Header text color.
	wp.customize( 'madison_header_text_color', function( value ) {
		value.bind( function( to ) {
			if ( false === to ) {
				return;
			} else {
				$( '.section-header-navigation, .section-header-navigation a, .site-branding .site-tagline' ).css( {
					'color': to
				} );
			}
		} );
	} );

	// Menu item background color.
	wp.customize( 'madison_header_menu_item_background_color', function( value ) {
		value.bind( function( to ) {
			if ( false === to ) {
				return;
			} else {
				$( '.site-navigation .menu li.current-menu-item > a, .site-navigation .menu li.current-menu-ancestor > a, .section-property-search' ).css( {
					'background-color': to
				} );
			}
		} );
	} );

	// Menu item color.
	wp.customize( 'madison_header_menu_item_text_color_hover', function( value ) {
		value.bind( function( to ) {
			if ( false === to ) {
				return;
			} else {
				$( '.site-navigation .menu li.current-menu-item > a, .site-navigation .menu li.current-menu-ancestor > a, .section-property-search' ).css( {
					'color': to
				} );
			}
		} );
	} );

	// Front page message.
	wp.customize( 'madison_front_page_message', function( value ) {
		value.bind( function( to ) {
			if ( to ) {
				$( '.property-catchline-inner h3' ).text( to );
			} else {
				$( '.property-catchline-inner h3' ).text( $( '#property-catchline' ).data( 'default' )  );
			}
		} );
	} );

	// Footer text.
	wp.customize( 'madison_footer_text', function( value ) {
		value.bind( function( to ) {
			$( '#site-footer .site-info' ).html( to );
		} );
	} );
}) (jQuery);