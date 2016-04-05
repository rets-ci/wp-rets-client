(function( $ ) {

  $.fn.rdc_search_form = function( options ) {

    var settings = $.extend({}, options );

    var that = this;

    $(document).click( function(){
      $(".dropdown-container ul", that).slideUp();
    });

    $(".dropdown-container > span", that).click( function(e) {
      $(this).parent().find("ul").slideDown();
      e.stopPropagation();
    });

    $(".dropdown-container ul", that).click( function(e) {
      e.stopPropagation();
    });

    /* Search-form slide selects */
    $(".dropdown-option", that).on( 'change', function(e) {
      $(this).parents('.dropdown-container').find('.dropdown-value').html($('label', $(this).parent()).html());
    });

  };

}( jQuery ));