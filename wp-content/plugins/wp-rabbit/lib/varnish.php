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
  if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
    return;
  }

  $post_url = get_permalink( $post_id );

  // Removes the URL added by WP, we need the original.
  $post_url = str_replace( '__trashed', '', $post_url );

  if( !$post_url ) {
    return;
  }

  $parse = parse_url($post_url);

  // The x-access-token is arbitrary.
  $purge_request_args = array(
    "method" => "PURGE",
    "headers" => array(
      "X-Access-Token" => isset( $_SERVER['HTTP_X_SELECTED_CONTAINER'] ) ? $_SERVER['HTTP_X_SELECTED_CONTAINER'] : '',
      "Host" => $parse['host'],
      "X-Set-Branch" => isset( $_SERVER['GIT_BRANCH'] ) ? $_SERVER['GIT_BRANCH'] : ''
    ),
    "blocking" => defined( "WP_DEBUG" ) && WP_DEBUG ? true : false
  );

  // make purge request to wpcloud.io. (this gets public DNS of wpcloud servers and then uses GCE load balancers to purge the appropriate machien based on hostname)
  $_purge = wp_remote_request( "http://c.rabbit.ci" . $parse['path'], $purge_request_args );

  rabbit_write_log( 'Post [' . $post_id. '] updated. Purging cache at [' . $parse['host'] . $parse['path'] . '] url for ['.$_SERVER['GIT_BRANCH'].'] branch.' );

  if( $_purge && wp_remote_retrieve_body( $_purge ) && defined( "WP_DEBUG" ) ) {

    try {
      $_response = json_decode( wp_remote_retrieve_body( $_purge ) );
      rabbit_write_log( ' - Purge response [' . $_response->message . '].' );

    } catch ( Exception $e ) {
      rabbit_write_log( ' - Unable to parse purge response.' );
    }

  }


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
    "blocking" => defined( "WP_DEBUG" ) && WP_DEBUG ? true : false
  ));

  rabbit_write_log( 'Purging all cache for [' . $parse['host'] . $parse['path'] . '/*' . '] in ['.$_SERVER['GIT_BRANCH'].'] branch.' );

  return $wp_rewrite->rules;

}, 50 );

/**
 * Write to file log.
 *
 * @param $data
 */
function rabbit_write_log( $data ) {

  $data = "\n" . date("F j, Y, g:i a") . " - " . $data;

  if( file_exists( '/var/log/wpcloud.site/deployment.log' ) ) {
    @file_put_contents('/var/log/wpcloud.site/deployment.log', $data, FILE_APPEND );
  }

}