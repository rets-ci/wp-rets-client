jQuery(function () {

  rdc_set_guide_heights();

  jQuery( window ).resize( rdc_set_guide_heights );

});

/**
 * Set guide height dynamically.
 *
 * @author potanin@UD
 */
function rdc_set_guide_heights() {

  // set height to total height of window minus the very top white menu for the list on the right side so it can scroll
  var _height = ( jQuery(window).height() ) - 60;

  // adjust for admin toolbar
  if( jQuery( 'body' ).hasClass( 'admin-bar' ) ) {
    _height = _height - 32;
  }

  // set this to max height so it reaches the bottom
  jQuery('body.tax-rdc_guide_category .guide-block, body.tax-rdc_guide_category .guide-overview-list').height( _height );

  // add extra padding to the bottom, this can't be done in CSS because then the height calculation (or something) doesn't work and cuts off the bottom
  jQuery('body.tax-rdc_guide_category .guide-overview-list').css( 'padding-bottom', '10em' );

  // set this to max height so it reaches the bottom
  jQuery('body.single-rdc_guide .guide-block, body.single-rdc_guide .guide-article-wrapper').height( _height );

  console.log( 'Guide height set to', _height );

}
