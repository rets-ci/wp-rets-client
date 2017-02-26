<?php
/**
 * Plugin Name: Shameless Hacks
 * Plugin URI: http://usabilitydynamics.com/plugins/
 * Description: System hacks.
 * Author: Usability Dynamics, Inc.
 * Version: 0.1.0
 * Author URI: http://usabilitydynamics.com
 *
 */

add_filter( 'ud:errors:admin_notices', function() { return null; });
add_filter( 'ud:messages:admin_notices', function() { return null; });
add_filter( 'ud:warnings:admin_notices', function() { return null; });


add_filter( 'wpp:elastic:prepare', function( $post_args, $post_id ) {


  if( isset( $post_args[ 'post_meta' ]['wpp_location_pin'] ) ) {
    return $post_args;
  }

  if( !get_post_meta( $post_id, 'wpp_location_latitude', true ) ) {
    return $post_args;
  }

  // ensure we have a wpp_location_pin
  $post_args[ 'post_meta' ]['wpp_location_pin'] = array(
    get_post_meta( $post_id, 'wpp_location_latitude', true ),
    get_post_meta( $post_id, 'wpp_location_longitude', true ),
  );

  $post_args[ 'post_meta' ]['wpp_location_geohash'] = join(',', array(
    get_post_meta( $post_id, 'wpp_location_latitude', true ),
    get_post_meta( $post_id, 'wpp_location_longitude', true ),
  ));

  return $post_args;

}, 50, 2 );