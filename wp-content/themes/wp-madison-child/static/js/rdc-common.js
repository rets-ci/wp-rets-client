/* Common Theme's JS */
(function($){

  var mform;

  $(document).ready(function(){

    mform = $( "form[name='multipurpose_search']" );

    if( mform.length > 0 ) {
      $( 'select', mform).on( 'focusout', function(){
        var s = $( "input[name='s']" );
        if(s.length > 0 && s.val().length > 0 ) {
          mform.submit();
        }
      } );
    }



  });

})(jQuery);