<?php
/**
 * Plugin Name: Data Cleanup
 * Plugin URI: http://usabilitydynamics.com/plugins/
 * Description: Output to console API action timers.
 * Author: Usability Dynamics, Inc.
 * Version: 0.1.0
 * Author URI: http://usabilitydynamics.com
 *
 */
add_action( 'rest_api_init', 'rdc_cleanup_api');

function rdc_clean_delete_zero_count_terms( $tax_name = '', $args = array() ) {
  global $wpdb;

  $_terms_with_no_count = $wpdb->query("DELETE FROM wp_term_taxonomy WHERE count = 0  AND taxonomy='$tax_name';");

  //rdc_log("SELECT term_id FROM $wpdb->term_taxonomy tt INNER JOIN $wpdb->terms t ON (tt.term_id = t.term_id ) WHERE  tt.count = 0  AND tt.taxonomy='$tax_name');");
  if( $_terms_with_no_count ) {
    rdc_log( "Deleting all terms with 0 count for [$tax_name], query affected [$_terms_with_no_count] rows." );
  }

}

/**
 * This can/shold be ran multiple times, and will continue to remove some orphaned terms as its ran.
 * This function may die while processing and now lose any state.
 * @param string $tax_name
 * @param array $args
 */
function rdc_clean_taxonomy( $tax_name = '', $args = array() ) {
  global $wpdb;

  if( !taxonomy_exists( $tax_name ) ) {
    register_taxonomy( $tax_name, array( 'property' ), array( 'hierarchical' => true ) );
  }

  //rdc_log( "Starting to clean [$tax_name] taxonomy. Current term count is [" . wp_count_terms( $tax_name ) . "]." );
  rdc_log( "Starting to clean [$tax_name] taxonomy, using the [". DB_NAME ."] database." );

  $orphaned_relationships = $wpdb->get_results( "SELECT tr.term_taxonomy_id as term_taxonomy_id, tt.term_id as term_id, object_id as post_id FROM $wpdb->term_relationships tr INNER JOIN $wpdb->term_taxonomy tt ON (tr.term_taxonomy_id = tt.term_taxonomy_id) WHERE tt.taxonomy = '$tax_name' AND tr.object_id NOT IN (SELECT ID FROM $wpdb->posts) LIMIT 0, " . $args['limit'] . ";");

  $_removed = array();

  if( !count( $orphaned_relationships ) ) {
    rdc_clean_delete_zero_count_terms( $tax_name );
    return;
  }

  rdc_log("Have at least [" . count( $orphaned_relationships ) . "] orphaned term taxonomy relationships for [$tax_name] taxonomy, about to remove them for each post that is now gone.");

  foreach( $orphaned_relationships as $_relationship_data ) {

    //wp_delete_object_term_relationships( $_relationship_data->post_id, $tax_name );
    $_result = wp_remove_object_terms( $_relationship_data->post_id, array( $_relationship_data->term_id ), $tax_name );

    if( is_wp_error( $_result ) ) {
      die( '<pre>error...' . print_r( $_result, true ) . '</pre>' );
    } else {
      $_removed[] = $_relationship_data->post_id;
    }
  }

  rdc_log( "Removed [" . count( $_removed ) . "] orphaned relationships for the [$tax_name] taxonomy." );

  // After removing orphans, update term counts again. This will cause total count (select sum(count) FROM wp_term_taxonomy where taxonomy = 'mls_id';) to first go down, then go back up.
  $_terms =  $wpdb->get_col( "SELECT term_taxonomy_id FROM $wpdb->term_taxonomy WHERE taxonomy='$tax_name';");

  if( wp_update_term_count_now( $_terms, $tax_name ) ) {
    rdc_log( "Updated term counts for [$tax_name]. New count is [" . wp_count_terms( $tax_name ) . "]." );
  }

  // @note probably shouldn't do this until all counts have been updated.
  rdc_clean_delete_zero_count_terms( $tax_name );

}

/**
 * https://usabilitydynamics-www-reddoorcompany-com-develop-v3-andy.c.rabbit.ci/?rdc-action=clean-database
 *
 */
function rdc_data_cleanup_other_actions() {

  //$_stuff = $wpdb->get_results( "SELECT * FROM wp_terms WHERE term_id IN (SELECT term_id FROM wp_term_taxonomy WHERE count = 0 );");

  // Find all Term Relationships that reference a Post that is no longer there. The [term_taxonomy_id] may be used to remove the Term Relationship.

  //  $_query = "SELECT * FROM {$wpdb->term_relationships} WHERE term_taxonomy_id=1 AND object_id NOT IN (SELECT id FROM $wpdb->posts)";
  // $_query = "SELECT * FROM {$wpdb->terms} WHERE term_id IN (SELECT term_id FROM wp_term_taxonomy WHERE count = 0 )";
  // die($_query );
  // $_results = $wpdb->get_results($_query);


  //rdc_log("DELETE FROM $wpdb->terms WHERE term_id IN (SELECT term_id FROM $wpdb->term_taxonomy WHERE count = 0 );" );
  //$_result = $wpdb->query("DELETE FROM $wpdb->terms WHERE term_id IN (SELECT term_id FROM $wpdb->term_taxonomy WHERE count = 0 );");
  //$_result = $wpdb->get_results("SELECT term_id FROM $wpdb->term_taxonomy tt INNER JOIN $wpdb->terms t ON (tt.term_id = t.term_id ) WHERE  tt.count = 0  AND tt.taxonomy='$tax_name');");
  //$_terms_with_no_count = $wpdb->get_results("SELECT term_id FROM wp_term_taxonomy WHERE count = 0  AND taxonomy='$tax_name';");


};

function rdc_cleanup_api(){

  // https://usabilitydynamics-www-reddoorcompany-com-develop-v3-andy.c.rabbit.ci/wp-json/rdc/v1/data/cleanup
  register_rest_route( 'rdc/v1/data', '/cleanup', array(
    'methods' => 'GET',
    'callback' => 'rdc_data_cleanup_handler',
  ));

  // https://usabilitydynamics-www-reddoorcompany-com-develop-v3-andy.c.rabbit.ci/wp-json/rdc/v1/data/status
  register_rest_route( 'rdc/v1/data', '/status', array(
    'methods' => 'GET',
    'callback' => 'rdc_data_cleanup_status_handler',
  ));

}

function rdc_data_cleanup_status_handler() {
  global $wpdb;
  $_taxonomies = $wpdb->get_col( "SELECT distinct(taxonomy) FROM {$wpdb->term_taxonomy}" );

  $_data = array();

  foreach( $_taxonomies as $tax_name ) {

    if( !taxonomy_exists( $tax_name ) ) {
      register_taxonomy( $tax_name, array( 'property' ), array( 'hierarchical' => true ) );
    }

    $_data[] = array(
      'taxonomy' => $tax_name,
      'count' => intval( wp_count_terms( $tax_name ) )
    );

  }

  return array( 'ok' => true, 'message' => 'API Online.', 'data' => $_data );
}

/**
 * Remove Unused Terms.
 *
 * while true; do (curl https://usabilitydynamics-www-reddoorcompany-com-develop-v3-andy.c.rabbit.ci/wp-json/rdc/v1/data/cleanup); done
 *
 * @return array
 *
 */
function rdc_data_cleanup_handler() {
  global $wpdb;

  // get all taxonomies in DB....
  $_taxonomies = $wpdb->get_col( "SELECT distinct(taxonomy) FROM {$wpdb->term_taxonomy} ORDER BY RAND() LIMIT 0, 15;" );

  // randomize order of operations so this can be ran multiple times with less conflict.
  shuffle( $_taxonomies );

  foreach( $_taxonomies as $_tax ) {
    rdc_clean_taxonomy( $_tax, array( 'limit' => 50 ) );
  }

  return array( 'ok' => true, 'time' => timer_stop(), 'taxonomies' => $_taxonomies );

}

function rdc_data_cleanup_handler_flushed() {


  ob_end_clean();
  header("Connection: close");
  ignore_user_abort(true); // just to be safe
  ob_start();
  wp_send_json(array( 'ok' => true, 'time' => timer_stop() ));
  $size = ob_get_length();
  header("Content-Length: $size");
  ob_end_flush(); // Strange behaviour, will not work
  flush(); // Unless both are called !

  rdc_log( 'start stuff' );
  rdc_data_cleanup_other_actions();

  die('done!');
  return array( 'ok' => true, 'time' => timer_stop() );

}