<?php

// =============================================================================
// VIEWS/PARTIALS/MINI-CART.PHP
// -----------------------------------------------------------------------------
// Mini cart partial.
// =============================================================================

if ( X_WOOCOMMERCE_IS_ACTIVE ) {

  // Prepare Atts
  // ------------

  $atts = array(
    'class' => 'x-mini-cart'
  );


  // Output
  // ------

  ?>

  <div <?php echo x_atts( $atts ); ?>>

    <?php if ( ! empty( $cart_title ) ) : ?>
      <h2 class="x-mini-cart-title"><?php echo $cart_title ?></h2>
    <?php endif; ?>

    <?php

    // Notes
    // -----
    // WooCommerce's JavaScript looks for this element and fills it with their
    // cart markup on page load and certain AJAX actions.
    //
    // Thumbnail size for all carts must be the same and is set in the
    // WordPress admin under WooCommerce > Settings > Products > Display.

    echo '<div class="widget_shopping_cart_content"></div>';

    ?>

  </div>

  <?php

} else {

  echo '<div style="padding: 35px; line-height: 1.5; text-align: center; color: #000; background-color: #fff;">The shopping cart currently unavailable.</div>';

}