<?php
/**
 * Plugin Name: Bootstrap
 * Plugin URI: http://usabilitydynamics.com/plugins/
 * Description: Main plugin to handle all site specific bootstrap tasks
 * Author: Usability Dynamics, Inc.
 * Version: 0.1.2
 * Author URI: http://usabilitydynamics.com
 */

add_filter( 'upgrader_pre_download', function( $false, $package, $this ) {

	return $false;
}, 10, 3 );

add_filter( 'downloading_package', function( $package ) {

	return $package;
});

add_filter( 'automatic_updates_is_vcs_checkout', function( $checkout, $context ) {

	return $checkout;
}, 10, 2);

add_filter( 'auto_update_plugin', function( $update, $item ) {

	return $update;
}, 10, 2);

add_filter( 'auto_update_theme', function( $update, $item ) {

	return $update;
}, 10, 2);

add_filter( 'auto_update_translation', function( $update, $item ) {
	return $update;
}, 10, 2);
