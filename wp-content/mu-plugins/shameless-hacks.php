<?php
/**
 * Shameless Hacks
 */


// force non-minified version of siteorigin scripts
// define( 'SOW_BUNDLE_JS_SUFFIX', '' );

if( isset( $_SERVER[ 'HTTP_X_EDGE' ] ) && $_SERVER[ 'HTTP_X_EDGE' ] === '__andy' ) {
  header( 'cache-control:no-cache, private' );

  add_action( 'template_redirect', function () {

    die( 'test from template_redirect' );
  } );
}
