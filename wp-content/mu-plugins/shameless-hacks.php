<?php
/**
 * Shameless Hacks
 */

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



// Redirect to https mode.c
if( empty($_SERVER['HTTPS']) ) {
  header( "HTTP/1.1 301 Moved Permanently" );
  header( 'Cache-Control:no-cache' );
  header( 'Location:' . home_url( $_SERVER['REQUEST_URI'] ));
  die();
}

