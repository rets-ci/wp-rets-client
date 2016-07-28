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
