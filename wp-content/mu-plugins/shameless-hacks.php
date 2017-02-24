<?php
/**
 * Plugin Name: Shameless Hacks
 * Plugin URI: http://usabilitydynamics.com/plugins/
 * Description: System hacks.
 * Author: Usability Dynamics, Inc.
 * Version: 0.1.0
 * Author URI: http://usabilitydynamics.com
 *
 */

add_filter( 'ud:errors:admin_notices', function() { return null; });
add_filter( 'ud:messages:admin_notices', function() { return null; });
add_filter( 'ud:warnings:admin_notices', function() { return null; });

add_action('__post_updated', function( $post_ID, $post_after, $post_before ) {

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