<?php
/**
 * Purge Varnish Cache
 * 
 */

// varnish cache purging
add_action( 'save_post', function( $post_id ) {

  // If this is just a revision, don't send the email.
  if ( wp_is_post_revision( $post_id ) )
    return;

  $post_title = get_the_title( $post_id );
  $post_url = get_permalink( $post_id );

  if( !$post_url ) {
    return;
  }

  $parse = parse_url($post_url);

  // make purge request to wpcloud.io. (this gets public DNS of wpcloud servers and then uses GCE load balancers to purge the appropriate machien based on hostname)
  $_purge = wp_remote_request( "http://wpcloud.io" . $parse['path'], array(
    "method" => "PURGE",
    "headers" => array(
      "X-Access-Token" => "yhcwokwserjzdjir",
      "Host" => $parse['host']
    ),
    "blocking" => false
  ));

  // die( '<pre>' . print_r( $_purge, true ) . '</pre>' );

}, 50 );



/**
 * Purge Entire Site on Permalink Change.
 *
 *
 */
add_filter( 'generate_rewrite_rules', function( $wp_rewrite ) {

  $site_url = home_url();

  $parse = parse_url($site_url);

  // make purge request to wpcloud.io for entire sute
  wp_remote_request( "http://wpcloud.io" . $parse['path'] . '/*', array(
    "method" => "PURGE",
    "headers" => array(
      "X-Access-Token" => "yhcwokwserjzdjir",
      "Host" => $parse['host']
    ),
    "blocking" => false
  ));

  return $wp_rewrite->rules;

}, 50 );
