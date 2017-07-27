<?php

// disables WPP scripts on front-end. Adds the wpp localized var to "bundle" so its available.
add_action( 'wp_enqueue_scripts', function() {
  // we re-purpose the WPP 'wpp' instance as a localization of the "bundle", added by theme.
  // wp_localize_script( 'bundle', 'wpp', array( 'instance' =>  apply_filters( 'wpp::localization::instance', WPP_Core::get_instance() ) ) );
}, 100);

add_action( 'wp_enqueue_scripts', function() {
  // wp_dequeue_script('wp-property-global');
  // wp_dequeue_script('google-analytics');
}, 200);


add_action('admin_init', function() {

  if( function_exists( 'add_term_ordering_support' ) ) {
    add_term_ordering_support ('wpp_listing_category');
  }

  if( !isset( $_GET['test'] ) || $_GET['test'] !== 'term-test' ) {
    return;
  }

  $_result = WPP_F::insert_terms(1231323, array(
    array(
      '_id' => '2342323432',
      '_type' => 'wpp_agency_agent',
      'name' => 'John Smith 233',
      'slug' => 'john-smith',
      'description' => 'General, default description of agent.',
      'meta' => array(
        'first_name' => 'John',
        'last_last' => 'Smith',
        'role' => 'some-agent'
      ),
      'post_meta' => array(
        'description' => 'This is a big room for this particular property',
        'role' => 'primary_agent'
      )
    ),
    array(
      '_id' => '233242343',
      '_type' => 'wpp_agency_agent',
      'description' => 'Description of term.',
      'name' => 'John Smith'
    ),
    array(
      '_type' => 'wpp_agency_agent',
      'description' => 'Description of term.',
      'name' => 'John Doe',
      'meta' => array(
        'first_name' => 'John',
        'last_last' => 'Smith'
      )
    )
  ));

  die( '<pre>' . print_r( $_result , true ) . '</pre>' );
});


add_action('_post_updated', function( $post_ID, $post_after, $post_before ) {

  if( $post_after->post_type !== 'property' ) {
    return;
  }

  if( $post_after->post_status !== 'publish' ) {
    return;
  }

  $_terms = wp_get_post_terms( $post_ID, array( 'wpp_categorical', 'wpp_listing_location', 'wpp_listing_status', 'wpp_listing_type'  )  );

  $_insert_result = array();

  // @todo Sort alphabetically by slug and exclue duplicate counts?

  $_parent = null;

  rdc_log( 'Starting to insert terms for ' . $post_ID . ' at ' . timer_stop () );
  foreach( $_terms as $_term ) {

    if( is_numeric( $_term->slug ) ) {
      continue;
    }

    $_term_object = array_filter(array(
      '_id' => 'search-landing-' . $_term->slug,
      '_type' => 'search-landing',
      '_parent' => $_parent,
      'slug' => sanitize_title( $_term->name ),
      'name' => $_term->name
    ));

    // set parent to this term, for next iteration
    $_parent = $_term_object[ '_id' ];

    //echo( '<pre>' . print_r( $_term_object, true ) . '</pre>' );
    $_insert_result[] = WPP_F::insert_terms($post_ID, array($_term_object), array( '_taxonomy' => 'wpp_search_landing' ) );

  }

  rdc_log( 'Finished to inserting terms for ' . $post_ID . ' at ' . timer_stop () );

  // die( '<pre>' . print_r( $_insert_result, true ) . '</pre>' );

}, 50, 3 );

function custom_rewrite() {
  global $wp_rewrite;

if( defined( "WP_CLI" ) ) {return;}
  //add_rewrite_tag('%wpp_location_city%', '([^&]+)');

  add_rewrite_tag('%wpp_location_city_state%', '([^&]+)');
  add_rewrite_tag('%wpp_listing_status%', '([^&]+)');
  add_rewrite_tag('%wpp_category_value%', '([^&]+)');
  add_rewrite_tag('%wpp_category_key%', '([^&]+)');
  add_rewrite_tag('%wpp_listing_category%', '([^&]+)');


  // @todo If there are too many values, perhaps switch to matching all. Put those with exact matches above those with general match.
  $wpp_listing_status = array(
    'sale',
    'rent',
    'for-sale',
    'for-rent'
  );

  $_valid_annexes = array(
    'nc',
    'highschool',
    'middleschool',
    'county'
  );

  // add_rewrite_rule('^listings/([^/]*)/([^/]*)/?','index.php?wpp_location_city=$matches[1]&wpp_location_state=$matches[2]','top');
  // will exclude "-city" from [wpp_location_city] match

  // @see https://regex101.com/r/GAq3RQ/3
  $_rewrite_rules = array(

    // listings/rent/durham-nc/some-listing
    // listings/rent/durham-highschool/some-listing
    '^listings\/('. join( '|', $wpp_listing_status ) . ')\/([^\/]*)-(' . join( '|', $_valid_annexes ). ')\/([^\/]*)\/?'=> array( 'wpp_listing_status', 'wpp_category_value', 'wpp_category_key' ),

    // listings/for-sale/some-listing/
    // listings/rent/some-listing/
    '^listings\/('. join( '|', $wpp_listing_status ) . ')\/([^\/]*)\/?'=> array( 'wpp_listing_status' ),

    //'^listings\/('. join( '|', $wpp_listing_status ) .'})\/([^\/]*)\/([^\/]*)\/?'=> array( 'wpp_listing_status', 'wpp_location_city' ),
    //'^listings\/([^/]*)\/([^\/]*)\/([^\/]*)\/?'=> array( 'wpp_location_city', 'wpp_location_state' )
  );

  $_rules = array();

  // match everything after /listings/
  //add_rewrite_rule('^listings\/([^&]+)\/?', 'index.php?wpp_listing_category=$matches[1]', 'top');

  foreach( $_rewrite_rules as $_rule => $_target ) {

    $_targets = array();
    foreach( $_target as $_index => $_key ) {
      $_targets[] = $_key . '=$matches[' . ( $_index + 1 ) . ']';
    }

    // 'index.php?wpp_location_city=$matches[1]&wpp_location_state=$matches[2]

    //add_rewrite_rule($_rule, 'index.php?' . join( '&', $_targets ), 'top');

    $_rules[ $_rule ] =  'index.php?' . join( '&', $_targets );

  }


  //die( '<pre>' . print_r( $_rules, true ) . '</pre>' );

  //add_rewrite_rule( '^properties/%wpp_location_city%-%wpp_location_state/(.+?)/?$', 'index.php?product_cat=matches[1]&pa_material=$matches[2]', 'top' );

  //flush_rewrite_rules();

//  die( '<pre>' . print_r( $wp_rewrite, true ) . '</pre>' );

  //global $wp_rewrite;die( '<pre>' . print_r( $wp_rewrite, true ) . '</pre>' );
}

// refresh/flush permalinks in the dashboard if this is changed in any way
add_action( '__init', 'custom_rewrite' );

add_filter( '__term_link', function( $termlink, $term, $taxonomy ) {


  if( !isset ( $term->wpp_original_slug ) ) {

    $_url_slug = get_term_meta( $term->term_id, 'listing-category-url_slug', true );

    if( $_url_slug && $_url_slug !== $term->slug ) {
      $term->wpp_original_slug=$term->slug;
      $term->slug=$_url_slug;
    }

    //$termlink = str_replace( '/' . $term->wpp_original_slug, '/'. $term->slug, $termlink );

  }

  if( !isset( $term->wpp_url_path ) ) {
    $_url_path = get_term_meta( $term->term_id, 'listing-category-url_path', true );

    if( $_url_path ) {
      $term->wpp_url_path = $_url_path;
    }

  }

  return $termlink;

}, 50, 3 );

add_filter( '_get_wpp_listing_category', function( $_term, $taxonomy ) {

  if( !isset ( $_term->wpp_original_slug ) ) {

    $_url_slug = get_term_meta( $_term->term_id, 'listing-category-url_slug', true );

    if( $_url_slug && $_url_slug !== $_term->slug ) {
      $_term->wpp_original_slug=$_term->slug;
      $_term->slug=$_url_slug;
    }

  }

  if( !isset( $_term->wpp_url_path ) ) {
    $_url_path = get_term_meta( $_term->term_id, 'listing-category-url_path', true );

    if( $_url_path ) {
      $_term->wpp_url_path = $_url_path;
    }

  }

  //echo( '<pre>' . print_r( $_term, true ) . '</pre>' );
  return $_term;

}, 50, 2);

// Would have to modify queries replacing slug
add_action( 'template_redirect', function() {
  global $wp_query, $wp;

  return;

  $_availability_test = new WP_Query( array(
    'date_query' => array(
      array(
        'column' => 'post_date',
        'before' => 'January 5th 2012 11:00PM',
      ),
      array(
        'column' => 'post_date',
        'after'  => 'January 5th 2012 10:00PM',
      ),
      'inclusive' => true,
    ),
  ) );


  $_query = new WP_Query( array(
    'ep_integrate'   => true,
    'post_type'      => 'property',
    'posts_per_page' => -1,
    'tax_query' => array(
      array(
        'taxonomy' => 'wpp_listing_category',
        'terms'    => array( 'listing-category-alamance-hawfields' ),
        'field'    => 'slug',
      )
    ),
  ) );


  die( '<pre>' . print_r( $_query, true ) . '</pre>' );


//  die(get_term_link(45881, 'wpp_listing_category'));

  if( $wp_query->is_tax ) {
    rdc_log('Found ' . count( $wp_query->posts ) . ' taxonomy posts.');
  }

//  die( '<pre>' . print_r( $wp_query, true ) . '</pre>' );

  //die( '<pre>temp' . print_r( $wp_query, true ) . '</pre>' );


});