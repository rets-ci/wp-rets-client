// =============================================================================
// JS/SRC/SITE/INC/X-BODY-CUSTOM.JS
// -----------------------------------------------------------------------------
// Includes all miscellaneous, custom functionality to be output near the
// closing </body> tag.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Custom Functionality
// =============================================================================

// Custom Functionality
// =============================================================================

jQuery(document).ready(function($) {

  $('a, button, input, [tabindex]').on('focus', function() {
    $(this).css({'outline' : 'none'});
  });

  $('a, button, input, [tabindex]').on('keyup', function(e) {
    if ( e.keyCode === 9 ) {
      $(this).css({'outline' : ''});
    }
  });

});