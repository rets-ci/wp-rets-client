<?php
/**
 * RDC child theme based on WP-Madison 2.0
 */

/**
 * Load the contents of the lib directory.
 *
 * @since 1.0.0
 */
require_once( dirname( __FILE__ ) . '/lib/load.php' );

/**
 * Register widgets
 */
add_action('widgets_init', 'rdc_register_widgets');
function rdc_register_widgets() {
  register_widget( 'RDCScheduleShowing' );
  register_widget( 'RDCProspectOwnerForm' );
  register_widget( 'RDCContactForm' );
}

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

/**
 * Fix permalinks for tax
 */
add_filter( 'wpp::register_taxonomy', 'rdc_tax_rewrite', 10, 2 );
function rdc_tax_rewrite( $args, $tax ) {
  $args['rewrite']['with_front'] = false;
  return $args;
}

/**
 * Change default image
 */
add_filter( 'madison_custom_header_args', function( $defaults ) {
  $defaults[ 'default-image' ] = get_stylesheet_directory_uri() . '/static/images/default-logo.png';
  $defaults[ 'width' ] = 540;
  $defaults[ 'height' ] = 200;
  return $defaults;
} );