<?php

// =============================================================================
// WOOCOMMERCE/SINGLE-PRODUCT/RELATED.PHP
// -----------------------------------------------------------------------------
// @version 3.0.0
// =============================================================================

if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

if ( $related_products && x_get_option( 'x_woocommerce_product_related_enable' ) == '1' ) : ?>

  <section class="related products cols-<?php echo x_get_option( 'x_woocommerce_product_related_columns' ); ?>">

    <h2><?php esc_html_e( 'Related products', '__x__' ); ?></h2>

    <?php woocommerce_product_loop_start(); ?>

      <?php foreach ( $related_products as $related_product ) : ?>

        <?php
          $post_object = get_post( $related_product->get_id() );

          setup_postdata( $GLOBALS['post'] =& $post_object );

          wc_get_template_part( 'content', 'product' ); ?>

      <?php endforeach; ?>

    <?php woocommerce_product_loop_end(); ?>

  </section>

<?php endif;

wp_reset_postdata();