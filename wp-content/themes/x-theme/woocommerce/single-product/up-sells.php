<?php

// =============================================================================
// WOOCOMMERCE/SINGLE-PRODUCT/UP-SELLS.PHP
// -----------------------------------------------------------------------------
// @version 3.0.0
// =============================================================================

if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

if ( $upsells && x_get_option( 'x_woocommerce_product_upsells_enable' ) == '1' ) : ?>

  <section class="up-sells upsells products cols-<?php echo x_get_option( 'x_woocommerce_product_upsell_columns' ); ?>">

    <h2><?php esc_html_e( 'You may also like&hellip;', '__x__' ) ?></h2>

    <?php woocommerce_product_loop_start(); ?>

      <?php foreach ( $upsells as $upsell ) : ?>

        <?php
          $post_object = get_post( $upsell->get_id() );

          setup_postdata( $GLOBALS['post'] =& $post_object );

          wc_get_template_part( 'content', 'product' ); ?>

      <?php endforeach; ?>

    <?php woocommerce_product_loop_end(); ?>

  </section>

<?php endif;

wp_reset_postdata();