<?php
/**
 * Plugin Name: rets.ci mapper
 * Plugin URI: https://www.usabilitydynamics.com/product/wp-crm/
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

  add_dashboard_page('Mapper', 'Mapper', 'read', 'rets-mapper', function() {
    include_once( __DIR__ . '/views/rets-mapper-ui.php' );
  } );

});

add_action( 'wp_ajax_mapper_add_alias', 'mapper_add_alias' );

function mapper_add_alias(){

  check_ajax_referer( 'mapper_add_alias', 'security', 1 );

  $payload = $_POST['payload'];

  $response = wp_remote_post( 'https://api.rets.ci/v2/site/set_site_mapping?token=' . get_option('ud_site_secret_token'), $request_data = array(
    'headers' => array(
      'content-type' => 'application/json'
    ),
    'body' => json_encode(array(
      'slug' => $payload['slug'],
      'alias' => $payload['alias']
      )
    ))
   );

  if ( is_wp_error( $response ) )
    wp_send_json_error( 'Something went wrong' );
    
}
