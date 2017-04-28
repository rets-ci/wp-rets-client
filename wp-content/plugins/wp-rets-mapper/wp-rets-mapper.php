<?php
/**
 * Plugin Name: rets.ci mapper
 * Plugin URI: https://www.usabilitydynamics.com/
 * Description: Map fields
 * Author: Usability Dynamics, Inc.
 * Version: 0.1.1
 * Requires at least: 4.0
 * Tested up to: 4.7
 * https://rets-ci-api-rets-ci-v0-5-0.c.rabbit.ci/v1/site/616bf200-b814-4a8b-816e-a4405061e3b8/analysis?token=40f95eaadca4472e7213f1f7d6ead1a7
 *
 */
add_action('admin_init', function() {
  include_once( __DIR__ . '/lib/updater.php' );
});

add_action('admin_menu', function() {

  if( function_exists( 'ud_get_wp_property' ) ) {
    add_dashboard_page('Mapper', 'Mapper', 'read', 'rets-mapper', function() {
      include_once( __DIR__ . '/views/rets-mapper-ui.php' );
    } );
  }

});

add_action( 'wp_ajax_/mapper/v1/add-alias', 'mapper_add_alias' );

/**
 * Record alias.
 *
 */
function mapper_add_alias(){
  global $wp_properties;

  check_ajax_referer( 'mapper-add-alias', 'security', 1 );

  $payload = $_POST['payload'];

  $_current_settings = get_option('wpp_settings');

  $_current_settings[ 'field_alias' ][ $payload['alias' ] ] = $payload['key'];

  $_current_settings[ '_updated' ] = time();

  update_option( 'wpp_settings', $_current_settings );

  wp_send_json(array(
    'ok' => true,
    'alias' => $payload['alias' ],
    'key' => $payload['key'],
    'aliases' => $_current_settings[ 'field_alias' ]
  ));

  // @todo Implement later.
  $response = wp_remote_post( 'https://api.rets.ci/v2/site/set_site_mapping?token=' . get_option('ud_site_secret_token'), $request_data = array(
    'headers' => array(
      'content-type' => 'application/json',
      'ud-access-token' => get_option('ud_site_secret_token')
    ),
    'body' => json_encode(array(
      'slug' => $payload['slug'],
      'alias' => $payload['alias']
      )
    ))
   );

  if ( is_wp_error( $response ) ) {
    wp_send_json_error( 'Something went wrong' );
  }

}

function rets_mapper_get_analysis() {

  $_cache = wp_cache_get( 'rets-analysis', 'wp-rets-mapper' );

  if( $_cache && is_object( $_cache ) ) {
    $_cache->_cached = true;
    return $_cache;
  }
  $api_url = 'https://api.rets.ci/v2/site/' . get_option( 'ud_site_id' ) . '/analysis?token=' . get_option( 'ud_site_secret_token' );

  $api_url_response = wp_remote_get( $api_url );

  if( is_wp_error( $api_url_response ) ) {
    return $api_url_response;
  }

  $_analysis = json_decode( wp_remote_retrieve_body( $api_url_response ) );

  wp_cache_set( 'rets-analysis', $_analysis, 'wp-rets-mapper', 30 );

  return $_analysis;

}
