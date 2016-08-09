<?php
/**
 * Plugin Name: Asset Build
 * Plugin URI: http://usabilitydynamics.com
 * Description: Enable support for serving site via CloudFront
 * Author: Andy Potanin
 * Version: 1.1
 * Author URI: http://usabilitydynamics.com
 *
 *
 * groups - 1 or 0. 1 means its in footer.
 *
 * seems to ignore header/footer setting. if script was enqueued in wp_head or later
 *
 */

//show_admin_bar( false );
//return;

// By default minit puts everything into footer, which causes issues with dependencies.
add_filter( 'minit-js-in-footer', '__return_false' );

// We disable all caching. 
add_filter( 'minit-use-cache', '__return_false' );
add_filter( 'minit-script-tag-async', '__return_false' );

// Idea was to bust cache but this'll generate a lot of built files... Need to get the built files to be deleted somehow.
add_filter( '__minit-build-ver', function( $ver ) {
  $ver[] = time();
  return $ver;
});

// Disables caching, although still writes to disk.
add_filter( 'minit-cache-expiration', function() { return 0; });

// @todo Could inject deployment hash here...
add_filter( 'minit-ver-tag-js', function( $tag, $included_scripts ) {

  // Makes Kiwi assets append the data-main to it, loading all the AMD stuff.
  if(($key = array_search("require.js", $included_scripts)) !== false) {
    return 'require.js.' . $tag;
  }

  return $tag;

}, 20, 2);

add_filter( 'minit-url-js', function( $combined_file_url, $done ) {
  return str_replace( 'storage.googleapis.com/media.usabilitydynamics.com', ( isset( $_SERVER['ORIGINAL_HTTP_HOST'] ) ? $_SERVER['ORIGINAL_HTTP_HOST'] : $_SERVER['HTTP_HOST'] ) . '/wp-content/sites/www.usabilitydynamics.com/media', $combined_file_url  );
}, 10, 2 );

add_filter( 'minit-url-css', function( $combined_file_url, $done ) {
  return str_replace( 'storage.googleapis.com/media.usabilitydynamics.com',  ( isset( $_SERVER['ORIGINAL_HTTP_HOST'] )  ? $_SERVER['ORIGINAL_HTTP_HOST'] : $_SERVER['HTTP_HOST'] )  . '/wp-content/sites/www.usabilitydynamics.com/media', $combined_file_url  );
}, 10, 2 );

include_once( __DIR__ . '/lib/minit.php' );
