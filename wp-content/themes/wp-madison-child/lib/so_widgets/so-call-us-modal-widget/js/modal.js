jQuery(document).ready(function() {
  jQuery('.rdc-close-modal, .rdc-modal-overlay').on('click', function(){
    jQuery('.widget_rdc-call-us-modal').hide();
  });
  jQuery('a[href="#call-us"]').on('click', function() {
    if ( !jQuery('.widget_rdc-call-us-modal').is(':visible') ) {
      jQuery('.widget_rdc-call-us-modal').show().css('opacity', 0).animate({
        opacity: 1
      }, 500);
    }
  });
});