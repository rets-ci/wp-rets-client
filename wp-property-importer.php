<?php
/**
 * Plugin Name: WP-Property: Importer
 * Plugin URI: https://www.usabilitydynamics.com/product/wp-property-importer
 * Description: The XMLI Importer enables you to automatically import property listings directly into your website. This includes MLS, RETS, XML, and many other source formats. Properties are created, merged, removed, or updated according to rules you specify. This powerful importation tool downloads and attaches images and can even associate properties with real estate agents, on the fly. Once an import schedule has been created, you can literally import hundreds, thousands, even tens of thousands of properties with a single click.
 * Author: Usability Dynamics, Inc.
 * Version: 5.1.2
 * Requires at least: 4.0
 * Tested up to: 4.4
 * Text Domain: wpp_importer
 * Author URI: http://www.usabilitydynamics.com
 * Domain Path: /static/languages/
 * GitHub Plugin URI: wp-property/wp-property-importer
 * GitHub Branch: v5.0

 * Copyright 2012 - 2015 Usability Dynamics, Inc.  ( email : info@usabilitydynamics.com )
 *
 */

if( !function_exists( 'ud_get_wpp_importer' ) ) {

  /**
   * Returns  Instance
   *
   * @author Usability Dynamics, Inc.
   * @since 5.0.0
   */
  function ud_get_wpp_importer( $key = false, $default = null ) {
    $instance = \UsabilityDynamics\WPP\Importer_Bootstrap::get_instance();
    return $key ? $instance->get( $key, $default ) : $instance;
  }

}

if( !function_exists( 'ud_check_wpp_importer' ) ) {
  /**
   * Determines if plugin can be initialized.
   *
   * @author Usability Dynamics, Inc.
   * @since 5.0.0
   */
  function ud_check_wpp_importer() {
    global $_ud_wpp_importer_error;
    try {
      //** Be sure composer.json exists */
      $file = dirname( __FILE__ ) . '/composer.json';
      if( !file_exists( $file ) ) {
        throw new Exception( __( 'Distributive is broken. composer.json is missed. Try to remove and upload plugin again.', 'wpp_importer' ) );
      }
      $data = json_decode( file_get_contents( $file ), true );
      //** Be sure PHP version is correct. */
      if( !empty( $data[ 'require' ][ 'php' ] ) ) {
        preg_match( '/^([><=]*)([0-9\.]*)$/', $data[ 'require' ][ 'php' ], $matches );
        if( !empty( $matches[1] ) && !empty( $matches[2] ) ) {
          if( !version_compare( PHP_VERSION, $matches[2], $matches[1] ) ) {
            throw new Exception( sprintf( __( 'Plugin requires PHP %s or higher. Your current PHP version is %s', 'wpp_importer' ), $matches[2], PHP_VERSION ) );
          }
        }
      }
      //** Be sure vendor autoloader exists */
      if ( file_exists( dirname( __FILE__ ) . '/vendor/autoload.php' ) ) {
        require_once ( dirname( __FILE__ ) . '/vendor/autoload.php' );
      } else {
        throw new Exception( sprintf( __( 'Distributive is broken. %s file is missed. Try to remove and upload plugin again.', 'wpp_importer' ), dirname( __FILE__ ) . '/vendor/autoload.php' ) );
      }
      //** Be sure our Bootstrap class exists */
      if( !class_exists( '\UsabilityDynamics\WPP\Importer_Bootstrap' ) ) {
        throw new Exception( __( 'Distributive is broken. Plugin loader is not available. Try to remove and upload plugin again.', 'wpp_importer' ) );
      }
    } catch( Exception $e ) {
      $_ud_wpp_importer_error = $e->getMessage();
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
  function ud_wpp_importer_message() {
    global $_ud_wpp_importer_error;
    if( !empty( $_ud_wpp_importer_error ) ) {
      $message = sprintf( __( '<p><b>%s</b> can not be initialized. %s</p>', 'wpp_importer' ), 'WP-Property Importer', $_ud_wpp_importer_error );
      echo '<div class="error fade" style="padding:11px;">' . $message . '</div>';
    }
  }
  add_action( 'admin_notices', 'ud_wpp_importer_message' );
}

if( ud_check_wpp_importer() ) {
  //** Initialize. */
  ud_get_wpp_importer();
}
