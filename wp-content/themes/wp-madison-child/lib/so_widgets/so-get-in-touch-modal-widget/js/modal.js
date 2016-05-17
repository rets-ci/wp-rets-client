jQuery(document).ready(function() {
  jQuery(document).keyup(function(e) {
    if (e.keyCode == 27) {
      jQuery('.widget_rdc-get-touch-modal').hide();
    }
  });
  jQuery('.rdc-close-modal, .rdc-modal-overlay').on('click', function(){
    jQuery('.widget_rdc-get-touch-modal').hide();
  });
  jQuery('a[href="#get-in-touch"]').on('click', function() {
    if ( !jQuery('.widget_rdc-get-touch-modal').is(':visible') ) {
      jQuery('.widget_rdc-get-touch-modal').show().css('opacity', 0).animate({
        opacity: 1
      }, 500);
    }
  });
});