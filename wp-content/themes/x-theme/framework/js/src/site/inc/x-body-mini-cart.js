// =============================================================================
// JS/SRC/SITE/INC/X-BODY-CART.JS
// -----------------------------------------------------------------------------
// Site scripts.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Cart
// =============================================================================

// Cart
// =============================================================================

jQuery(document).ready(function($) {

  if ( ! window.csGlobal ) {
    return;
  }

  window.csGlobal.everinit('.x-mini-cart', function(el) {
    cleanCarts($(el));
  });

  $(document).on('added_to_cart wc_fragments_loaded wc_fragments_refreshed', 'body', function() {
    // console.log('X WC: "added_to_cart", "wc_fragments_loaded", or "wc_fragments_refreshed" fired!');
    cleanCarts($('.x-mini-cart'));
  });

  function cleanCarts( $el ) {
    var wrapInner = '<span class="x-anchor-content" style="-webkit-justify-content: center; justify-content: center; -webkit-align-items: center; align-items: center;"><span class="x-anchor-text"><span class="x-anchor-text-primary"></span></span></span>';
    $el.find('.button').removeClass('button').addClass('x-anchor').wrapInner(wrapInner);
  }

});
