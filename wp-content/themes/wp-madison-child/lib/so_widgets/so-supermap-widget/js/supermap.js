(function($){

  $(document).ready(function(){

    $( 'form.formFilter .submit-filters').click( function( e ){
      e.preventDefault();

      var id = $(this).data( 'instance_id' );
      if(
        typeof id == 'undefined' ||
        parseInt( id ) < 0 ||
        typeof getProperties !== 'function'
      ) {
        return;
      }

      $(this).addClass( 'loading' ).val( 'Loading...' );

      getProperties( id );

      $(this).removeClass( 'loading' ).val( 'Search' );

    } );

  });

})(jQuery);