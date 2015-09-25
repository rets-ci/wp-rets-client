(function(madison_single_property) {

	madison_single_property(window.jQuery, window, document);

	}(function($, window, document) {
		$(function() {
			/* Enable Fancybox, if function exists, for all links with fancybox_image class and gallery itmes */
			if ( typeof jQuery.fn.fancybox == 'function' ) {
				jQuery( 'a.fancybox_image, .gallery-item a' ).fancybox({
					'transitionIn'  :   'elastic',
					'transitionOut' :   'elastic',
					'speedIn'       :   600,
					'speedOut'      :   200,
					'overlayShow'   :   false
				});
			}

			$( window ).load( function() {
				$( '.nivoSlider' ).each( function( i, e ) {
					$( e ).height( $( e ).find( 'img' ).first().height() );
				});
			});

			$( window ).resize( function() {
				$( '.nivoSlider' ).each( function( i, e ) {
					$( e ).height( $( e ).find( 'img' ).first().height() );
				});
			});

			$( '.property-images' ).slidesjs({
				width: 800,
				height: 600,
				navigation: {
					active: false,
				},
				pagination: {
					active: true,
					effect: "fade"
				},
				callback: {
					loaded: function(number) {
						$( '.property-images .slidesjs-pagination-item' ).each( function( index, element ) {
							var target = $( element ).find( 'a' ),
								src    = $( '.property-images [data-image-index=' + index + ']' ).data( 'image-thumb' );

								$( target ).html( '<img src="' + src + '" alt="" />' );
						});
					},
				}
			});
		});
	})
);