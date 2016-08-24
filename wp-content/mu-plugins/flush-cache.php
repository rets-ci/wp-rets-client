<?php
/**
 * Plugin Name: Cache Purge
 * Plugin URI: http://usabilitydynamics.com/plugins/
 * Description: Fflushes Varnish cache on post updates.
 * Author: Usability Dynamics, Inc.
 * Version: 0.1.0
 * Author URI: http://usabilitydynamics.com
 *
 */

/**
 * Purge Varnish (wpcloud)
 *
 * Purge specific URL:
 *    curl -X PURGE "http://api.wpcloud.io/brillz-is-on-a-mission-to-twonk-di-nation" -H "X-Access-Token:yhcwokwserjzdjir" -H "host:www.discodonniepresents.com"
 *
 * Purge using wildcard.:
 *    curl -X PURGE "http://api.wpcloud.io/brillz-is-on-a-mission-to-*" -H "X-Access-Token:yhcwokwserjzdjir" -H "host:www.discodonniepresents.com"
 *
 */
function rdc_flush_cache( $post_id ) {

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
      "Host" => $parse['host']
    ),
    "blocking" => false
  ));


}

add_action( 'save_post', "rdc_flush_cache", 100);
// WP-RETS Client plugin
add_action( 'wprc:xmlrpc:editProperty', "rdc_flush_cache", 100);


/**
 * Purge Object Cache upon completion of XMLI import
 *
 */
add_action('wpp_xml_import_complete', function() {

  if( function_exists( 'wp_cache_flush' ) ) {
    wp_cache_flush();
  }

});