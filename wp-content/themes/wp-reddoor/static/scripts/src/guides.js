jQuery(function () {

    // rdc_set_guide_heights();
  jQuery( window ).resize( rdc_set_guide_heights );

  // Iterate over all "guide group images" that have a parent row, and set their height to row height
  jQuery.each( jQuery( '.row .guide-group-image' ), function eachGroupImage( index, element ){
    jQuery( element ).height( jQuery( element ).closest( '.row' ).height() );
  });

});

/**
 * Set guide height dynamically.
 *
 * @author potanin@UD
 */
function rdc_set_guide_heights() {

  var _body = jQuery('body');

  // if screen appears large, and we're on a Guide page, do things with guide heights.
  if( jQuery(window).width() < 768 || ( !_body.hasClass('tax-rdc_guide_category') && !_body.hasClass('post-type-archive-rdc_guide') && !_body.hasClass('single-rdc_guide') ) ) {
    return;
  }

  // set height to total height of window minus the very top white menu for the list on the right side so it can scroll
  var _height = ( jQuery(window).height() ) - 60;

  // adjust for admin toolbar
  if( _body.hasClass( 'admin-bar' ) ) {
    _height = _height - 32;
  }

  // set this to max height so it reaches the bottom
  jQuery('body.tax-rdc_guide_category .guide-block, body.tax-rdc_guide_category .guide-overview-list').height( _height );

  // add extra padding to the bottom, this can't be done in CSS because then the height calculation (or something) doesn't work and cuts off the bottom
  jQuery('body.tax-rdc_guide_category .guide-overview-list').css( 'padding-bottom', '10em' );

  // set this to max height so it reaches the bottom
  jQuery('body.single-rdc_guide .guide-block, body.single-rdc_guide .guide-article-wrapper').height( _height );

  console.log( 'Guide height is set to', _height );

}
