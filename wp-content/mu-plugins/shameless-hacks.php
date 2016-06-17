<?php
/**
 * Shameless Hacks
 */

add_filter( 'ud:errors:admin_notices', function() { return null; });
add_filter( 'ud:messages:admin_notices', function() { return null; });
add_filter( 'ud:warnings:admin_notices', function() { return null; });

// force non-minified version of siteorigin scripts
define( 'SOW_BUNDLE_JS_SUFFIX', '' );

// Only activate tests when on a 'develop' branch.
if( isset( $_SERVER['HTTP_X_SELECTED_BRANCH'] ) && strpos( $_SERVER['HTTP_X_SELECTED_BRANCH'], 'develop' ) !== false ) {
  header( 'cache-control:no-cache, private' );

  $_event_map = array(
    "init" => [ 5, 10, 20 ],
    "after_setup_theme" => [ 5, 10, 20 ],
    "plugins_loaded" => [ 5, 10, 20 ],
    "wp" => [ 5, 10, 20 ],
    "wp_loaded" => [ 5, 10, 20 ],
    "template_redirect" => [ 5, 10, 20 ],
    "get_header" => [ 5, 10, 20 ],
  );

  foreach( $_event_map as $_action => $levels ) {
    //print_r($_action);die();

    foreach( $levels as $level ) {

      add_action($_action, function() {

        if( !headers_sent() ) {
          $data = '[time:' . timer_stop() . '],[action:' . current_action() . ']';

          if( $__level ) {
            $data .= '[level:' . $__level . ']';
          }

          header( 'x-set-flag:' . $data, false );
        }

      }, $level );

    }

  }
  // time curl "https://www.reddoorcompany.com/listing_office/red-door-company/?wpp_search%5Bsale_type%5D=Rent" -H "x-set-branch:develop-andy" -H "x-edge:andy" -H "cache-control:no-cache" -H "pragma:no-cache" -I
  // time curl "http://localhost/listing_office/red-door-company/?wpp_search%5Bsale_type%5D=Rent" -H "x-set-branch:develop-andy" -H "x-edge:andy" -H "cache-control:no-cache" -H "pragma:no-cache" -H "x-forwarded-proto:https" -I

  // use to debug manually...
  // die('death. ' . __FILE__ . ' - ' . __LINE__ . ' - ' . timer_stop() );

  add_action('wp_print_scripts', function() {
    //die(current_action() . ' - ' . time()  . ' - ' . timer_stop());
  }, 0 );


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

  function delete_rets_duplicates() {
    global $wpdb;

    
    // Find all RETS IDs that have multiple posts associated with them.
    $_duplicates = $wpdb->get_col( "SELECT meta_value, COUNT(*) c FROM $wpdb->postmeta WHERE meta_key='rets_id' GROUP BY meta_value HAVING c > 1 ORDER BY c DESC;" );

    $all_deleted = array();
    foreach( $_duplicates as $_has_duplicates ) {

      if( $_deleted = wp_delete_post( $_delete_me, true ) ) {
        $all_deleted[] = $_deleted ;
      }

      // die( '<pre>' . print_r( $_deleted, true ) . '</pre>' );
    }

    return $all_deleted;
  }

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
