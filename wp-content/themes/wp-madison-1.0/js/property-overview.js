(function(madison_property_load_more) {
	
	madison_property_load_more(window.jQuery, window, document);
	
	}(function($, window, document) {
		$(function() {
			$( '#property-overview-load-more' ).on( 'click', 'a', function( event ) {
				event.preventDefault();

				var append_to    = $( this ).data( 'append-to' ),
				    starting_row = $( this ).data( 'starting-row' ),
				    per_page     = $( this ).data( 'per-page' ),
				    template     = $( this ).data( 'template' );

				$( this ).css( 'display', 'none' ).parent().addClass( 'loading' );

				var opts = {
					lines: 8,
					length: 4,
					width: 3,
					radius: 5,
					corners: 0,
					rotate: 46,
					direction: 1,
					color: '#555',
					speed: 1.6,
					trail: 100,
					shadow: false,
					hwaccel: false,
					className: 'spinner',
					zIndex: 2e9,
					top: 'auto',
					left: 'auto'
				};

				var target = document.getElementById( 'property-overview-load-more' );
				var spinner = new Spinner( opts ).spin( target );

				$.ajax({
					type: 'POST',
					url: wpp.instance.ajax_url,
					data: { 
						'action'       : 'madison-property-view-load-properties',
						'append_to'    : append_to,
						'starting_row' : starting_row,
						'per_page'     : per_page,
						'template'     : template,
					},
					dataType: 'html',
					success: function( data ) {
						if ( ! data.match( 'property-overview-end' ) ) {
							$( '#' + append_to ).append( data );
							$( '#property-overview-load-more' ).removeClass( 'loading' ).find( '.btn' ).data( 'starting-row', $( '#' + append_to + ' .property' ).length ).css( 'display', 'inline-block' );
							$( '#property-overview-load-more .spinner' ).remove();
						} else {
							$( '#property-overview-load-more' ).remove();
							$( '#site-main' ).append( data );
						}
					}
				});
			});
		});
	})
);