<?php
/**
 * Plugin Name: WP-Property: Slideshow
 * Plugin URI: https://usabilitydynamics.com/product/wp-property-slideshow
 * Description: The slideshow Add-on allows you to insert a slideshow into any property page, home page, or virtually anywhere in your blog.
 * Author: Usability Dynamics, Inc.
 * Version: 4.0.0
 * Text Domain: wpp_slideshow
 * Author URI: http://usabilitydynamics.com
 * Domain Path: /static/languages/
 * Network: False
 * GitHub Plugin URI: wp-property/wp-property-slideshow
 * GitHub Branch: v4.0
 *
 * Copyright 2012 - 2014 Usability Dynamics, Inc.  ( email : info@usabilitydynamics.com )
 *
 */

if( !function_exists( 'ud_get_wpp_slideshow' ) ) {

  /**
   * Returns  Instance
   *
   * @author Usability Dynamics, Inc.
   * @since 4.0.0
   */
  function ud_get_wpp_slideshow( $key = false, $default = null ) {
    $instance = \UsabilityDynamics\WPP\Slideshow_Bootstrap::get_instance();
    return $key ? $instance->get( $key, $default ) : $instance;
  }

}

if( !function_exists( 'ud_check_wpp_slideshow' ) ) {
  /**
   * Determines if plugin can be initialized.
   *
   * @author Usability Dynamics, Inc.
   * @since 4.0.0
   */
  function ud_check_wpp_slideshow() {
    global $_ud_wpp_slideshow_error;
    try {
      //** Be sure composer.json exists */
      $file = dirname( __FILE__ ) . '/composer.json';
      if( !file_exists( $file ) ) {
        throw new Exception( __( 'Distributive is broken. composer.json is missed. Try to remove and upload plugin again.', 'wpp_slideshow' ) );
      }
      $data = json_decode( file_get_contents( $file ), true );
      //** Be sure PHP version is correct. */
      if( !empty( $data[ 'require' ][ 'php' ] ) ) {
        preg_match( '/^([><=]*)([0-9\.]*)$/', $data[ 'require' ][ 'php' ], $matches );
        if( !empty( $matches[1] ) && !empty( $matches[2] ) ) {
          if( !version_compare( PHP_VERSION, $matches[2], $matches[1] ) ) {
            throw new Exception( sprintf( __( 'Plugin requires PHP %s or higher. Your current PHP version is %s', 'wpp_slideshow' ), $matches[2], PHP_VERSION ) );
          }
        }
      }
      //** Be sure vendor autoloader exists */
      if ( file_exists( dirname( __FILE__ ) . '/vendor/autoload.php' ) ) {
        require_once ( dirname( __FILE__ ) . '/vendor/autoload.php' );
      } else {
        throw new Exception( sprintf( __( 'Distributive is broken. %s file is missed. Try to remove and upload plugin again.', 'wpp_slideshow' ), dirname( __FILE__ ) . '/vendor/autoload.php' ) );
      }
      //** Be sure our Bootstrap class exists */
      if( !class_exists( '\UsabilityDynamics\WPP\Slideshow_Bootstrap' ) ) {
        throw new Exception( __( 'Distributive is broken. Plugin loader is not available. Try to remove and upload plugin again.', 'wpp_slideshow' ) );
      }
    } catch( Exception $e ) {
      $_ud_wpp_slideshow_error = $e->getMessage();
      return false;
    }
    return true;
  }

}

if( !function_exists( 'ud_my_wp_plugin_message' ) ) {
  /**
   * Renders admin notes in case there are errors on plugin init
   *
   * @author Usability Dynamics, Inc.
   * @since 1.0.0
   */
  function ud_wpp_slideshow_message() {
    global $_ud_wpp_slideshow_error;
    if( !empty( $_ud_wpp_slideshow_error ) ) {
      $message = sprintf( __( '<p><b>%s</b> can not be initialized. %s</p>', 'wpp_slideshow' ), 'WP-Property Slideshow', $_ud_wpp_slideshow_error );
      echo '<div class="error fade" style="padding:11px;">' . $message . '</div>';
    }
  }
  add_action( 'admin_notices', 'ud_wpp_slideshow_message' );
}

if( ud_check_wpp_slideshow() ) {
  //** Initialize. */
  ud_get_wpp_slideshow();
}