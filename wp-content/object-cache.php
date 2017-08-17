<?php
/**
 * Memcached Object Cache Loader
 *
 * It allows us to disable external object-cache
 * via constant MEMCACHED_DISABLED
 *
 * see: wp_start_object_cache()
 */

if( !defined( 'MEMCACHED_DISABLED' ) || !MEMCACHED_DISABLED ) {
  if ( !file_exists( WP_CONTENT_DIR . '/object-cache-load.php' ) ) {
    die( 'Object Cache file is not found' );
  }
  
  if( class_exists( 'Memcached' )  ) {
  require_once ( WP_CONTENT_DIR . '/object-cache-load.php' );
}
  
} else {
  wp_using_ext_object_cache( false );
  require_once ( ABSPATH . WPINC . '/cache.php' );
  add_action( 'muplugins_loaded', function() {
    wp_using_ext_object_cache( false );
  } );
}