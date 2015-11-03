<?php
/**
 * Shameless Hacks
 */

// Redirect to https mode.c
if( empty($_SERVER['HTTPS']) ) {
  header( "HTTP/1.1 301 Moved Permanently" );
  header( 'Cache-Control:no-cache' );
  header( 'Location:' . home_url( $_SERVER['REQUEST_URI'] ));
  die();
}

