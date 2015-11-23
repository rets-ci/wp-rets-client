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

    if ( $(window).width() > 800 ) {
      $(".widget.widget_agentwidget").sticky({topSpacing: 32, bottomSpacing: 554}).on('sticky-start', function (s) {
        console.log($(s.currentTarget).width($(s.currentTarget).width() - 42));
      });
    }

  });

})(jQuery);