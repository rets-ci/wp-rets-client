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
