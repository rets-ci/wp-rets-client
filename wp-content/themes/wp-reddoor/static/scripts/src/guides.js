jQuery(function () {


  // set height to total height of window minus the very top white menu for the list on the right side so it can scroll
  var _height = ( jQuery(window).height() ) - 60;

  // set this to max height so it reaches the bottom
  jQuery('.tax-rdc_guide_category .guide-block').height( _height );

  // sett his to max height to it reaches the bottom and then can scroll
  jQuery('.tax-rdc_guide_category .guide-overview-list').height( _height );

  // add extra padding to the bottom, this can't be done in CSS because then the height calculation (or something) doesn't work and cuts off the bottom
  jQuery('.tax-rdc_guide_category .guide-overview-list').css( 'padding-bottom', '10em' );

  console.log( 'Guide height set to', _height );

});