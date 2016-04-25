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

// special handling for production branch
if( isset( $_SERVER['HTTP_X_SELECTED_BRANCH'] ) && $_SERVER['HTTP_X_SELECTED_BRANCH'] === '__production' ) {

  // disable plugin check
  remove_action('load-update-core.php','wp_update_plugins');

  // flush some update transient?
  add_filter('pre_site_transient_update_plugins','__return_null');

  // hide core update nag
  add_action('admin_menu',function() {
    remove_action( 'admin_notices', 'update_nag', 3 );
  });

  function rdc_remove_core_updates(){
    global $wp_version;

    return(object) array(
      'last_checked'=> time(),
      'version_checked'=> $wp_version
    );

  }

  // overwrite transients for core, plugin and theme updates
  add_filter('pre_site_transient_update_core','rdc_remove_core_updates');
  add_filter('pre_site_transient_update_plugins','rdc_remove_core_updates');
  add_filter('pre_site_transient_update_themes','rdc_remove_core_updates');

}
