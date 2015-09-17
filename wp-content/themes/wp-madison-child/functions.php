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
  register_widget( 'RDCFeedbackForm' );
}

/**
 * Enqueue parent style hook
 */
add_action( 'wp_enqueue_scripts', 'rdc_theme_enqueue_scripts' );

/**
 * Enqueue parent style
 */
function rdc_theme_enqueue_scripts() {
  wp_enqueue_style( 'parent-style', get_template_directory_uri() . '/style.css' );
  wp_enqueue_script( 'rdc-common', get_stylesheet_directory_uri() . '/static/js/rdc-common.js', array( 'jquery' ) );
}

/**
 * Register additional nav menu
 */
register_nav_menu( 'header-secondary', __('Secondary Header Menu') );
register_nav_menu( 'footer', __('Footer Menu') );

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

/**
 * Multi Purpose Search Logic
 */
add_action( 'template_redirect', function(){

  if( isset( $_REQUEST[ 'mps' ] ) ) {
    $url = untrailingslashit( home_url() );
    $query = !empty( $_REQUEST[ 's' ] ) ? $_REQUEST[ 's' ] : '';
    if( !empty( $_REQUEST[ 'post_type' ] ) && $_REQUEST[ 'post_type' ] == 'property' ) {
      if( !function_exists( 'ud_get_wp_property' ) ) {
        return;
      }
      $url .= '/' . ud_get_wp_property( 'configuration.base_slug' ) . '?wpp_search[s]=' . $query;
    } else {
      $url .= '?s=' . $query;
    }
    wp_redirect( $url );
  }

}, 99 );

/**
 * Enable only Post and Pages post types for global search.
 */
add_action( 'parse_request', function( $query ) {

  if( isset( $_REQUEST[ 's' ] ) && !isset( $_REQUEST[ 'wpp_search' ] ) ) {

    add_filter( 'pre_get_posts', function( $query ) {
      if( !empty( $query->query_vars[ 's' ] ) ) {
        $query->set('post_type', array( 'post', 'page' ) );
      }
      return $query;
    } );

  }

  return $query;
}, 99 );


/**
 * Register(Un-register) widgetized area and update sidebar
 * with default widgets.
 */
add_action( 'widgets_init', function(){
  unregister_sidebar( 'footer-1' );
}, 99 );

/**
 * HACK
 * Fixes EXTRA output in header.
 *
 * In some cases Wordpress SEO prints HTML content of post to header when SiteOrigin is enabled for post
 *
 * @author peshkov@UD
 */
add_action( 'wp_head', function() {
  remove_action( 'the_content', 'siteorigin_panels_filter_content' );
}, 1 );
add_action( 'wp_head', function() {
  add_filter( 'the_content', 'siteorigin_panels_filter_content' );
}, 999 );