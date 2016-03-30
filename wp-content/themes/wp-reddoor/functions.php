<?php

/* WP-Property ( and WPP Add-ons ) hooks and custom logic. */
include_once( get_template_directory() . '/wp-property/functions.php' );

add_action('wp_enqueue_scripts', function () {
  wp_enqueue_script('jquery');
  wp_enqueue_script('bootstrap', get_stylesheet_directory_uri() . '/static/scripts/src/bootstrap.js');
  wp_enqueue_script('main', get_stylesheet_directory_uri() . '/static/scripts/src/main.js?nocache='.rand(0,1000));
  wp_enqueue_script('svgxuse', 'https://i.icomoon.io/public/524f31be7a/rdc/svgxuse.js');
  wp_enqueue_script('jquery-ui.js', get_stylesheet_directory_uri() . '/static/scripts/src/jquery-ui.js');
  wp_enqueue_script('jquery.sticky', get_stylesheet_directory_uri() . '/static/scripts/src/jquery.sticky.js');
  wp_enqueue_script('masked', get_stylesheet_directory_uri() . '/static/scripts/src/masked.js');
  wp_enqueue_script('select2.min', get_stylesheet_directory_uri() . '/static/scripts/src/select2.min.js');
  wp_enqueue_style('style', get_stylesheet_directory_uri() . '/static/styles/style.css?nocache='.rand(0,100));
  wp_enqueue_style('style2', 'https://s3.amazonaws.com/icomoon.io/28703/reddoorcompany/style.css?1gwudq');
  wp_enqueue_style('style1', 'https://s3.amazonaws.com/icomoon.io/28703/wpproperty/style.css?ob605w');

});

/* Theme support */
add_theme_support('post-thumbnails');

/* Register menu */
register_nav_menu('main-menu', 'Main menu');


/* Register sidebar */
if (function_exists('register_sidebar')) {
  register_sidebar(array(
    'name' => 'Footer area 1',
    'id' => 'footer_area_1',
    'before_widget' => '<div id="%1$s" class="widget %2$s">',
    'after_widget' => '</div>',
    'before_title' => '<h2 class="offscreen">',
    'after_title' => '</h2>',
  ));
  register_sidebar(array(
    'name' => 'Footer area 2',
    'id' => 'footer_area_2',
    'before_widget' => '<div id="%1$s" class="widget %2$s">',
    'after_widget' => '</div>',
    'before_title' => '<h2 class="offscreen">',
    'after_title' => '</h2>',
  ));
  register_sidebar(array(
    'name' => 'Footer area 3',
    'id' => 'footer_area_3',
    'before_widget' => '<div id="%1$s" class="widget %2$s">',
    'after_widget' => '</div>',
    'before_title' => '<h2 class="offscreen">',
    'after_title' => '</h2>',
  ));
  register_sidebar(array(
    'name' => 'Single-sidebar',
    'id' => 'single-sidebar',
    'before_widget' => '<div id="%1$s" class="widget %2$s">',
    'after_widget' => '</div>',
    'before_title' => '<h2 class="offscreen">',
    'after_title' => '</h2>',
  ));

}


/* Customize logo */
function rdc_theme_customizer($wp_customize)
{
  $wp_customize->add_section('rdc_logo_section', array(
    'title' => __('Logo', 'rdc'),
    'priority' => 30,
    'description' => 'Upload a logo to replace the default site name and description in the header',
  ));
  $wp_customize->add_setting('rdc_logo');
  $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'rdc_logo', array(
    'label' => __('Logo', 'rdc'),
    'section' => 'rdc_logo_section',
    'settings' => 'rdc_logo',
  )));
}

add_action('customize_register', 'rdc_theme_customizer');

add_action('init', function(){
  remove_action('wp_head', 'print_emoji_detection_script', 7);
  remove_action('wp_print_styles', 'print_emoji_styles');
  remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
  remove_action( 'admin_print_styles', 'print_emoji_styles' );
  register_post_type('associations', array(
    'labels' => array(
      'name' => 'Association',
      'singular_name' => 'Association',
      'add_new' => 'Add association',
      'add_new_item' => 'add new association',
      'edit_item' => 'Edit association',
      'new_item' => 'New association',
      'view_item' => 'View association',
      'search_items' => 'Search association',
      'not_found' => 'Association not found',
      'not_found_in_trash' => 'Association not found in trash',
      'parent_item_colon' => ''
    ),
    'public' => true,
    'supports' => array('title', 'thumbnail'),
    'has_archive' => false,
    'exclude_from_search' => true

  ));
});

/**
 *
 *
 * @param $match
 * @param $objects
 * @return array
 */
function get_objects_where($match, $objects) {
  if ($match == '' || !is_array($match)) return array ();
  $wanted_objects = array ();
  foreach ($objects as $object) {
    $wanted = false;
    foreach ($match as $k => $v) {
      if (is_object($object) && isset($object->$k) && $object->$k == $v) {
        $wanted = true;
      } else {
        $wanted = false;
        break;
      };
    };
    if ($wanted) $wanted_objects[] = $object;
  };
  return $wanted_objects;
};


/**
 *
 */
function termsSearchable() {

  if(empty($_GET['q'])){

    $query = 'a';
  }
  else{
    $query = $_GET['q'];
  }

  $_terms = get_terms( array( 'high_school', 'middle_school', 'elementary_school', 'county', 'zip_code', 'neighborhood', 'city' ), array(
    'search' => $query
  ) );


  $_terms = array_map( function( $data ) {

    return array(
      "id" => $data->term_id,
      "slug" => $data->slug,
      "name" => $data->name,
      "count" => $data->count,
      "taxonomy" => ucfirst(str_replace('_', ' ', $data->taxonomy)),
    );

  }, $_terms );


/*
  $results = get_objects_where(array('name' => $query), $_terms);
  die( '<pre>' . print_r( $results, true ) . '</pre>' );
*/
  wp_send_json(array(
    "ok" => true,
    "data" => $_terms
  ));

}

add_action( 'wp_ajax_TermsSearchable', 'termsSearchable' );
add_action( 'wp_ajax_nopriv_TermsSearchable', 'termsSearchable' );

if(class_exists('SiteOrigin_Widget')) {
  include 'lib/widgets/rdc-post-carousel/post-carousel.php';
  include 'lib/widgets/rdc-hero/hero.php';
}

if(class_exists('WP_Widget')) {
  include 'lib/widgets/gc-widget/guide-content.php';
  include 'lib/widgets/rdc-callout-widget/callout.php';
}


/**
 * Parse Search Request and redirect to Taxonomy page
 *
 * @author peshkov@UD
 */
add_filter( "parse_request", function( $query ) {

  if( !empty( $_POST[ 'wpp_search' ] ) && !empty( $_POST[ '_term' ] ) ) {

    $term = $_POST[ '_term' ];
    $term = is_numeric( $term ) ? (int)$term : $term;
    $_redirect = get_term_link( $term );

    if( is_wp_error( $_redirect ) ) {
      return $query;
    }

    $_query = http_build_query( apply_filters( 'wpp::search::query', array( 'wpp_search' => $_POST[ 'wpp_search' ] ) ), '', '&' );
    $_redirect .= ( strpos( $_redirect, '?' ) === false ? '?' : '&' ) . $_query;
    wp_redirect( $_redirect );
    die();
  }

  return $query;

}, 1 );
