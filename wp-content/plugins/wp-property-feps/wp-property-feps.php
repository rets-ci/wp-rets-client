<?php
/**
 * Plugin Name: WP-Property FEPS
 * Plugin URI: https://usabilitydynamics.com
 * Description: Front End Property Submission (FEPS) lets you create forms and display them on the front-end of the website. The forms may be used by visitors to submit properties, which are then held for approval.
 * Author: Usability Dynamics, Inc.
 * Version: 3.0.0-RC1
 * Text Domain: wpp_feps
 * Author URI: http://usabilitydynamics.com
 *
 * Copyright 2012 - 2014 Usability Dynamics, Inc.  ( email : info@usabilitydynamics.com )
 *
 */
if ( !defined( 'FEPS_VIEW_PAGE' ) ) define( 'WPP_FEPS_Version', '3.0.0' );
if ( !defined( 'FEPS_VIEW_PAGE' ) ) define( 'FEPS_VIEW_PAGE', 'my_feps_listings' );
if ( !defined( 'FEPS_EDIT_PAGE' ) ) define( 'FEPS_EDIT_PAGE', 'feps_edit_page' );
if ( !defined( 'FEPS_SPC_PAGE' ) ) define( 'FEPS_SPC_PAGE', 'feps_spc_page' );

//** Specific FEPS meta data */
if ( !defined( 'FEPS_META_FORM' ) ) define( 'FEPS_META_FORM', 'wpp::feps::form_id' );
if ( !defined( 'FEPS_META_PLAN' ) ) define( 'FEPS_META_PLAN', 'wpp::feps::subscription_plan' );
if ( !defined( 'FEPS_META_EXPIRED' ) ) define( 'FEPS_META_EXPIRED', 'wpp::feps::expired_time' );
if ( !defined( 'FEPS_USER_CREDITS' ) ) define( 'FEPS_USER_CREDITS', 'wpp::feps::credits' );
if ( !defined( 'FEPS_RENEW_PLAN' ) ) define( 'FEPS_RENEW_PLAN', 'wpp::feps::renew_plan' ); 
 
if( !function_exists( 'ud_get_wpp_feps' ) ) {

  /**
   * Returns  Instance
   *
   * @author Usability Dynamics, Inc.
   * @since 3.0.0
   */
  function ud_get_wpp_feps( $key = false, $default = null ) {
    $instance = \UsabilityDynamics\WPP\FEPS_Bootstrap::get_instance();
    return $key ? $instance->get( $key, $default ) : $instance;
  }

}

if( !function_exists( 'ud_check_wpp_feps' ) ) {
  /**
   * Determines if plugin can be initialized.
   *
   * @author Usability Dynamics, Inc.
   * @since 3.0.0
   */
  function ud_check_wpp_feps() {
    global $_ud_wpp_feps_error;
    try {
      //** Be sure composer.json exists */
      $file = dirname( __FILE__ ) . '/composer.json';
      if( !file_exists( $file ) ) {
        throw new Exception( __( 'Distributive is broken. composer.json is missed. Try to remove and upload plugin again.', 'wpp_feps' ) );
      }
      $data = json_decode( file_get_contents( $file ), true );
      //** Be sure PHP version is correct. */
      if( !empty( $data[ 'require' ][ 'php' ] ) ) {
        preg_match( '/^([><=]*)([0-9\.]*)$/', $data[ 'require' ][ 'php' ], $matches );
        if( !empty( $matches[1] ) && !empty( $matches[2] ) ) {
          if( !version_compare( PHP_VERSION, $matches[2], $matches[1] ) ) {
            throw new Exception( sprintf( __( 'Plugin requires PHP %s or higher. Your current PHP version is %s', 'wpp_feps' ), $matches[2], PHP_VERSION ) );
          }
        }
      }
      //** Be sure vendor autoloader exists */
      if ( file_exists( dirname( __FILE__ ) . '/vendor/autoload.php' ) ) {
        require_once ( dirname( __FILE__ ) . '/vendor/autoload.php' );
      } else {
        throw new Exception( sprintf( __( 'Distributive is broken. %s file is missed. Try to remove and upload plugin again.', 'wpp_feps' ), dirname( __FILE__ ) . '/vendor/autoload.php' ) );
      }
      //** Be sure our Bootstrap class exists */
      if( !class_exists( '\UsabilityDynamics\WPP\FEPS_Bootstrap' ) ) {
        throw new Exception( __( 'Distributive is broken. Plugin loader is not available. Try to remove and upload plugin again.', 'wpp_feps' ) );
      }
    } catch( Exception $e ) {
      $_ud_wpp_feps_error = $e->getMessage();
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
  function ud_wpp_feps_message() {
    global $_ud_wpp_feps_error;
    if( !empty( $_ud_wpp_feps_error ) ) {
      $message = sprintf( __( '<p><b>%s</b> can not be initialized. %s</p>', 'wpp_feps' ), 'WP-Property FEPS', $_ud_wpp_feps_error );
      echo '<div class="error fade" style="padding:11px;">' . $message . '</div>';
    }
  }
  add_action( 'admin_notices', 'ud_wpp_feps_message' );
}

if( ud_check_wpp_feps() ) {
  //** Initialize. */
  ud_get_wpp_feps();
}