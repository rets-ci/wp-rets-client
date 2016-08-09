<?php
/**
 * Plugin Name: Policy
 * Plugin URI: http://usabilitydynamics.com/plugins/
 * Description: General settings.
 * Author: Usability Dynamics, Inc.
 * Version: 0.1.0
 * Author URI: http://usabilitydynamics.com
 *
 */

add_action('template_redirect', function() {
  // header('cache-control:public,max-age=30,s-maxage=30');
}, 20);

// By default minit puts everything into footer, which causes issues with dependencies.
add_filter( 'minit-js-in-footer', '__return_false' );

// We disable all caching. 
add_filter( 'minit-use-cache', '__return_false' );
add_filter( 'minit-script-tag-async', '__return_false' );
add_filter( 'minit-cache-expiration', function() { return 0; });

add_filter( 'minit-file-pattern', function( $_path, $extension ) {
  return str_replace( '/minit/', '/minit/asset-', $_path );
}, 10, 2 );

// Force minit to be enabled if its avialable.
add_filter( 'option_active_plugins', function( $_plugins ) {

  if( file_exists( WP_PLUGIN_DIR . '/minit-master/minit.php' )) {
    $_plugins[] = 'minit-master/minit.php';
  }

  return array_unique( $_plugins );

} );
