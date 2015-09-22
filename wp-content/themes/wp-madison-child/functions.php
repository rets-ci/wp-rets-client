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
  wp_enqueue_style( 'rdc-icons', get_stylesheet_directory_uri() . '/static/fonts/rdc/style.css', array(), '4.0.3' );
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
      $url .= '/' . ud_get_wp_property( 'configuration.base_slug' ) . '?wpp_search[s]=' . urlencode( $query );
    } else {
      $url .= '?s=' . urlencode( $query );
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
        $query->set('post_type', array( 'post' ) );
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

/**
 * Replace value for Location ( random_75 ) attribute
 * with matched value on property import
 *
 * @author peshkov@UD
 */
add_filter( 'wpp_xml_import_value_on_import', function( $value, $attribute, $type, $post_id ){
  return $value;
  $map = array(
    'raleigh' => array( 27601, 27605, 27608, 27609, 27613, 27614, 27615, 27616, 27622, 27623, 27624, 27625, 27602, 27603, 27604, 27606, 27607, 27610, 27611, 27612, 27617, 27619, 27620, 27621, 27626, 27627, 27628, 27629, 27640, 27650, 27656, 27658, 27676, 27690, 27695, 27634, 27635, 27636, 27661, 27668, 27675, 27697, 27698, 27699 ),
    'durham' => array( 27704, 27705, 27706, 27707, 27710, 27711, 27713, 27715, 27717, 27701, 27702, 27703, 27708, 27709, 27712, 27722 ),
    'chapell_hill' => array( 27514, 27515, 27516, 27517, 27599 ),
  );
  if( $attribute == 'random_75' ) {
    switch( true ) {
      case ( in_array( $value, $map[ 'raleigh' ] ) ):
        $value = 'Raleigh Rentals';
        break;
      case ( in_array( $value, $map[ 'durham' ] ) ):
        $value = 'Durham Rentals';
        break;
      case ( in_array( $value, $map[ 'chapell_hill' ] ) ):
        $value = 'Chapel Hill Rentals';
        break;
    }
  }
  return $value;
}, 99, 4 );