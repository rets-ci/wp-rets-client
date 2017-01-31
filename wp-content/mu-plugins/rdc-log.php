<?php
/**
 * Plugin Name: RDC Log
 * Plugin URI: http://usabilitydynamics.com/plugins/
 * Description: Output to console API action timers.
 * Author: Usability Dynamics, Inc.
 * Version: 0.1.0
 * Author URI: http://usabilitydynamics.com
 *
 */

function rdc_log( $data, $detail ) {
  $data = "\n" . date("F j, Y, g:i a") . " - " . $data;

  @file_put_contents('/var/www/wp-content/debug-rdc.log', $data, FILE_APPEND );
  @file_put_contents('/var/www/wp-content/debug-rdc.log', print_r($detail, true), FILE_APPEND );
  if( file_exists( '/var/www/wp-content/debug-rdc.log' ) ) {
  }

}