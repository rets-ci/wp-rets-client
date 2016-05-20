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

    if ( $(window).width() > 800 && typeof $(".widget.widget_agentwidget").sticky == 'function' ) {
      var _w = $(".widget.widget_agentwidget").width();
      $(".widget.widget_agentwidget").sticky({topSpacing: 32, bottomSpacing: 554}).on('sticky-start sticky-update', function (s) {
        $(s.currentTarget).width(_w);
      });
    }

    jQuery('#rdc-agent-schedule-showing-modal').on('click', function() {
      if ( !jQuery('.rdc-agent-schedule-showing-modal').is(':visible') ) {
        jQuery('.rdc-agent-schedule-showing-modal').show().css('opacity', 0).animate({
          opacity: 1
        }, 500);
      }
    });

    jQuery('#rdc-agent-application-request-modal').on('click', function() {
      if ( !jQuery('.rdc-agent-application-request-modal').is(':visible') ) {
        jQuery('.rdc-agent-application-request-modal').show().css('opacity', 0).animate({
          opacity: 1
        }, 500);
      }
    });

  });

})(jQuery);