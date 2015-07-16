<?php
/**
 * RDC child theme based on WP-Madison 2.0
 */

/**
 * Enqueue parent style hook
 */
add_action( 'wp_enqueue_scripts', 'theme_enqueue_styles' );

/**
 * Enqueue parent style
 */
function theme_enqueue_styles() {
  wp_enqueue_style( 'parent-style', get_template_directory_uri() . '/style.css' );
}

/**
 * Register additional nav menu
 */
register_nav_menu( 'header-secondary', __('Secondary Header Menu') );

/**
 * Change property CPT a bit
 */
add_filter( 'wpp_post_type', 'rdc_property_rewrite' );
function rdc_property_rewrite( $args ) {
  $args['rewrite']['with_front'] = false;
  return $args;
}