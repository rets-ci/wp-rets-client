jQuery(function () {


  // set height to total height of window minus the very top white menu
  var _height = ( jQuery(window).height() ) - 60;
  jQuery('.tax-rdc_guide_category .guide-guide-block').height( _height );

  console.log( 'height set to', _height );

});