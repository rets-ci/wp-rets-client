<?php
/**
 * Shameless Hacks
 */

add_filter( 'ud:errors:admin_notices', function() { return null; });
add_filter( 'ud:messages:admin_notices', function() { return null; });
add_filter( 'ud:warnings:admin_notices', function() { return null; });

// force non-minified version of siteorigin scripts
define( 'SOW_BUNDLE_JS_SUFFIX', '' );

if( isset( $_SERVER[ 'HTTP_X_EDGE' ] ) && $_SERVER[ 'HTTP_X_EDGE' ] === 'andy') {
  header( 'cache-control:no-cache, private' );
}

if( isset( $_SERVER[ 'HTTP_X_EDGE' ] ) && $_SERVER[ 'HTTP_X_EDGE' ] === 'andy' && isset( $_GET[ 'test-stuff' ] ) ) {


  add_action('__init', function() {
    global $_wp_additional_image_sizes;

    die( '<pre>' . print_r( UsabilityDynamics\Utility::all_image_sizes(), true ) . '</pre>' );


    die( '<pre>' . print_r( get_intermediate_image_sizes(), true ) . '</pre>' );

  }, 200 );
};

if( isset( $_SERVER[ 'HTTP_X_EDGE' ] ) && $_SERVER[ 'HTTP_X_EDGE' ] === 'andy' && isset( $_GET[ 'delete-all-old' ] ) ) {

  header( 'cache-control:no-cache, private' );

  function delete_rets_listings() {
    global $wpdb;

    $_old = $wpdb->get_col( "SELECT post_id from $wpdb->postmeta WHERE meta_key='rets_id';" );

    $all_deleted = array();
    foreach( $_old as $_delete_me ) {

      if( $_deleted = wp_delete_post( $_delete_me, true ) ) {
        $all_deleted[] = $_deleted ;
      }

      // die( '<pre>' . print_r( $_deleted, true ) . '</pre>' );
    }

    return $all_deleted;
  }

  function delete_rets_media() {
    global $wpdb;

    $_old = $wpdb->get_col( "SELECT ID from $wpdb->posts WHERE post_author='49';" );

    $all_deleted = array();
    foreach( $_old as $_delete_me ) {

      if( $_deleted = wp_delete_post( $_delete_me, true ) ) {
        $all_deleted[] = $_deleted ;
      }

      // die( '<pre>' . print_r( $_deleted, true ) . '</pre>' );
    }

    return $all_deleted;


  }

  //wp_die('Deleted ' . count(delete_rets_listings()) . ' total');
  wp_die('Deleted ' . count(delete_rets_media()) . ' media');

}

if( isset( $_SERVER[ 'HTTP_X_EDGE' ] ) && $_SERVER[ 'HTTP_X_EDGE' ] === '__andy' ) {
  header( 'cache-control:no-cache, private' );

  add_action( 'template_redirect', function () {

    die( 'test from template_redirect' );
  } );
}

