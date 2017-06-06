<?php

// =============================================================================
// WOOCOMMERCE/CART/CROSS-SELLS.PHP
// -----------------------------------------------------------------------------
// @version 3.0.0
// =============================================================================

if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

if ( $cross_sells && x_get_option( 'x_woocommerce_cart_cross_sells_enable' ) == '1' ) : ?>

  <div class="cross-sells cols-<?php echo x_get_option( 'x_woocommerce_cart_cross_sells_columns' ); ?>">

    <h2><?php _e( 'You may be interested in&hellip;', '__x__' ) ?></h2>

    <?php woocommerce_product_loop_start(); ?>

      <?php foreach ( $cross_sells as $cross_sell ) : ?>

        <?php
          $post_object = get_post( $cross_sell->get_id() );

          setup_postdata( $GLOBALS['post'] =& $post_object );

          wc_get_template_part( 'content', 'product' ); ?>

      <?php endforeach; ?>

    <?php woocommerce_product_loop_end(); ?>

  </div>

<?php endif;

wp_reset_postdata();