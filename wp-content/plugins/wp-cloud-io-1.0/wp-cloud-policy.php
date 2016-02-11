<?php
/**
 * Plugin Name: WP-Cloud: Policy
 * Plugin URI: http://wpcloud.io/plugins/wp-cloud
 * Description: Manage delegation of site/network policies.
 * Version: 0.5.0
 * Author: wpCloud.io
 * Author URI: http://wpcloud.io/
 * License: GPLv2 or later
 * Network: True
 *
 */
namespace wpCloud\Policy {

  if( file_exists( __DIR__ . '/vendor/libraries/autoload.php' ) ) {
    include_once( __DIR__ . '/vendor/libraries/autoload.php' );
  }

  add_filter( 'option_active_plugins', 'wpCloud\Policy\Filter::active_plugins' );
  add_filter( 'site_option_active_sitewide_plugins', 'wpCloud\Policy\Filter::sitewide_plugins' );


  class Action {

    public static function plugins_loaded() {
      // die( 'plugins_loaded:' . timer_stop() );

    }

    public static function template_redirect() {

      // die( 'init' );

      // header( 'Cache-Control:no-cache' );

      // die( '<pre>' . print_r( $_SERVER, true ) . '</pre>' );

    }

    public static function admin_init() {

      // die( 'admin' );

    }

  }

  class Filter {

    public static function redirect_canonical( $redirect_url, $requested_url ) {
      // die( '$redirect_url:' . $redirect_url );
      return $redirect_url;

    }

    /**
     * Returned array must be relative to WP_PLUGIN_DIR and not network-activated.
     *
     * @param array $_plugins
     *
     * @return array
     */
    public static function active_plugins( $_plugins = array() ) {

      if( file_exists( WP_PLUGIN_DIR . '/wp-cloud-v1.0/wp-cloud.php' ) ) {
        // $_plugins[] = 'wp-cloud-v1.0/wp-cloud.php';
      }

      if( file_exists( WP_PLUGIN_DIR . '/wp-stateless-media-v1.0/wp-stateless-media.php' ) ) {
        // $_plugins[] = 'wp-stateless-media-v1.0/wp-stateless-media.php';
      }

      // Disabled due to redirection errors.
      return array_unique( $_plugins );

    }

    /**
     * @param array $_plugins
     *
     * @return array
     */
    public static function sitewide_plugins( $_plugins = array() ) {

      if( file_exists( WP_PLUGIN_DIR . '/wp-cloud-v1.0/wp-cloud.php' ) && is_array( $_plugins ) ) {
        // $_plugins[ 'wp-cloud-v1.0/wp-cloud.php' ] = time();
      }

      if( file_exists( WP_PLUGIN_DIR . '/wp-stateless-media-v1.0/wp-stateless-media.php' ) ) {
        // $_plugins[ 'wp-stateless-media-v1.0/wp-stateless-media.php' ] = time();
      }

      return $_plugins;

    }

  }

}
