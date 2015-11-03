<?php
/**
 * Shameless Hacks
 */

// Redirect to https mode.
if( empty($_SERVER['HTTPS']) ) {
  header( 'Cache-Control:no-cache' );
  header( 'Location:' . home_url( $_SERVER['REQUEST_URI'] ));
  die();
}

