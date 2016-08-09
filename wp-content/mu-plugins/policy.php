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

/**
 * Caching Policy (Varnish).
 *
 */
add_action('template_redirect', function() {

  $_policy = array(
    "set" => false,
    "value" => 'public,max-age=31536000,s-maxage=31536000,force-cache=true',
    "reason" => "",
    "query" => $wp_query
  );

  // On non-production, cache for 60 seconds.
  if( isset( $_SERVER['GIT_BRANCH'] ) && $_SERVER['GIT_BRANCH'] !== 'production' ) {
    $_policy['value'] = 'public,max-age=60,s-maxage=60,force-cache=true';
  }

  // We cache normal content "forever" and then purge when need to.
  if( !$_policy['set'] && ( is_archive() ) ) {
    $_policy[ "set" ] = true;
    $_policy[ "reason" ] = "Archive/term page.";
  }

  // We cache normal content "forever" and then purge when need to.
  if( !$_policy['set'] && ( is_page() || is_single() || is_attachment() || is_home() || is_front_page() ) ) {
    $_policy[ "set" ] = true;
    $_policy[ "reason" ] = "Single post, single page, attachment, home or front page are cached forever.";
  }

  // Questionable...
  if( !$_policy['set'] && is_search() ) {
    $_policy[ "set" ] = true;
    $_policy[ "reason" ] = "Search cached forever.";
  }

  // Lets home previews use very unique hashes, they'll be cached forever.
  if( !$_policy['set'] && is_preview() ) {
    $_policy[ "set" ] = true;
    $_policy[ "reason" ] = "Previews are cached forever.";
  }

  // Traditionally this would not be cached, but now - we no longer give a shit. Everything is cached the same for everybody.
  if( !$_policy['set'] && is_user_logged_in() ) {
    $_policy[ "set" ] = true;
    $_policy[ "reason" ] = "You are logged in, but we do not care.";
  }

  // This is no exception.
  if( !$_policy['set'] && is_404() ) {
    $_policy[ "set" ] = true;
    $_policy[ "reason" ] = "404 requests are cached forever.";
  }

  // Set cache-control header.
  if( $_policy[ "set" ] && !headers_sent()) {
    header('cache-control:'.$_policy[ "value" ]);
    header('cache-control-reason:'.$_policy[ "reason" ]);
  }

  return $_policy;

}, 20);

// By default minit puts everything into footer, which causes issues with dependencies.
add_filter( 'minit-js-in-footer', '__return_false' );

// We disable all caching. 
add_filter( 'minit-use-cache', '__return_false' );
add_filter( 'minit-script-tag-async', '__return_false' );
add_filter( 'minit-cache-expiration', function() { return 0; });

// Regenerates every time.
add_filter( 'minit-file-pattern', function( $_path, $extension ) {
  return str_replace( '/minit/', '/minit/asset-' . $_SERVER['GIT_BRANCH'] . '-' . time() . '-', $_path );
}, 10, 2 );

// Force minit to be enabled if its avialable.
add_filter( 'option_active_plugins', function( $_plugins ) {

  if( file_exists( WP_PLUGIN_DIR . '/minit-master/minit.php' )) {
    $_plugins[] = 'minit-master/minit.php';
  }

  return array_unique( $_plugins );

} );
