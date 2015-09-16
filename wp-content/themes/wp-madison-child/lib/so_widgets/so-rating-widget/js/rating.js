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
      form.show();
    } );

    $( '.overlay', form ).on( 'click', function(  ){
      form.hide();
    } );

  });

})(jQuery);