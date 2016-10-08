<?php
/**
 * Purge Varnish Cache
 *
 *
 * @todo Use IO_WPCLOUD_DEPLOYMENT_HASH or CI_RABBIT_HASH for x-access-token ID.
 */

// varnish cache purging
add_action( 'save_post', function( $post_id ) {

  // If this is just a revision, don't send the email.
  if ( wp_is_post_revision( $post_id ) )
    return;

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
      "Host" => $parse['host'],
      "x-set-branch" => isset( $_SERVER['GIT_BRANCH'] ) ? $_SERVER['GIT_BRANCH'] : ''
    ),
    "blocking" => false
  ));

  rabbit_write_log( 'Purging cache for [' . $parse['host'] . $parse['path'] . '] in ['.$_SERVER['GIT_BRANCH'].'] branch.' );

}, 50 );



/**
 * Purge Entire Site on Permalink Change.
 *
 *
 */
add_filter( 'generate_rewrite_rules', function( $wp_rewrite ) {

  // disabled for now, seems to run all the time on UD, for instance.
  return $wp_rewrite->rules;

  $site_url = home_url();

  $parse = parse_url($site_url);

  // make purge request to wpcloud.io for entire sute
  wp_remote_request( "http://wpcloud.io" . $parse['path'] . '/*', array(
    "method" => "PURGE",
    "headers" => array(
      "X-Access-Token" => "yhcwokwserjzdjir",
      "Host" => $parse['host'],
      "x-set-branch" => isset( $_SERVER['GIT_BRANCH'] ) ? $_SERVER['GIT_BRANCH'] : ''
    ),
    "blocking" => false
  ));

  rabbit_write_log( 'Purging all cache for [' . $parse['host'] . $parse['path'] . '/*' . '] in ['.$_SERVER['GIT_BRANCH'].'] branch.' );

  return $wp_rewrite->rules;

}, 50 );

/**
 * @param $data
 */
function rabbit_write_log( $data ) {

  $data = "\n" . date("F j, Y, g:i a") . " - " . $data;

  if( file_exists( '/var/log/wpcloud.site/deployment.log' ) ) {
    @file_put_contents('/var/log/wpcloud.site/deployment.log', $data, FILE_APPEND );
  }

}