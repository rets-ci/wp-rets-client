(function($){

  $(document).ready(function () {

    var block = $( '.so-widget-rdc-rating .rdc-rating' );
    if( !block.length > 0 ) {
      return;
    }

    var form = $( '.modal-feedback-form', block );
    if( !form.length > 0 ) {
      return;
    }

    $( '.star-item', block).on( 'click', function(  ){
      form.show().css('opacity', 0).animate({
        opacity: 1
      }, 500);
    } );

    $( '.overlay, .close-btn', form ).on( 'click', function(  ){
      form.hide();
    } );

    jQuery(document).keyup(function(e) {
      if (e.keyCode == 27) {
        form.hide();
      }
    });

  });

})(jQuery);