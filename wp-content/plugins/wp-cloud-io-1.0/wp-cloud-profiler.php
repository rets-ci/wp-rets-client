<?php
/**
 * Plugin Name: WP-Cloud: Profiler
 * Plugin URI: http://wpcloud.io/plugins/wp-cloud
 * Description: Manage upstram git pushes.
 * Version: 0.5.0
 * Author: wpCloud.io
 * Author URI: http://wpcloud.io/
 * License: GPLv2 or later
 * Network: True
 * Domain Path: /static/locale/
 * Text Domain: wp-cloud
 *
 */
namespace wpCloud\Profiler {

  //global $current_site;
  //die( '<pre>' . print_r( $current_site, true ) . '</pre>' );

  add_action( 'plugins_loaded', 'wpCloud\Profiler\Actions::plugins_loaded' );

  // die( 'current_action:' . current_action() );
  class Actions {

    function plugins_loaded() {
      // die( 'plugins_loaded' );

      if( !isset( $wp_cloud ) ) {
        $wp_cloud = (object)array( '_events' => array() );
      }

      if( file_exists( __DIR__ . '/vendor/libraries/autoload.php' ) ) {
        include_once( __DIR__ . '/vendor/libraries/autoload.php' );
      }

      // add_action( 'init', 'wpCloud\Profiler\Action::log' );
      // add_action( 'muplugins_loaded', 'wpCloud\Profiler\Action::log' );
      // add_action( 'wp', 'wpCloud\Profiler\Action::log' );
      // add_action( 'template_redirect', 'wpCloud\Profiler\Action::log' );
      // add_action( 'wp_loaded', 'wpCloud\Profiler\Action::log' );
      // add_action( 'parse_request', 'wpCloud\Profiler\Action::log' );
      // add_action( 'get_header', 'wpCloud\Profiler\Action::log' );
      // add_action( 'plugins_loaded', 'wpCloud\Profiler\Action::log' );
      // add_action( 'get_header', 'wpCloud\Profiler\Action::log' );
      // add_action( 'wp_print_styles', 'wpCloud\Profiler\Action::log' );
      // add_action( 'get_footer', 'wpCloud\Profiler\Action::log' );

      register_shutdown_function( function () {
        global $wp_cloud;

      } );

    }

    function init() {

    }

    function log() {
      global $wp_locale, $wpdb;

      if( headers_sent() ) {
        return;
      }

      if( !isset( $wp_locale ) ) {
        require_once ABSPATH . WPINC . '/locale.php';
        $wp_locale = new \WP_Locale();
      }
      header( "X-Debug-Database-Connections:" . count( $wpdb->db_connections ) );
      header( "X-Debug-Database-FirstConnection:" . $wpdb->db_connections[ 0 ][ 'user' ] . "@" . $wpdb->db_connections[ 0 ][ 'host' ] . ":" . $wpdb->db_connections[ 0 ][ 'name' ] );
      header( "X-Debug-Database-Dataset:" . $wpdb->dataset );
      header( "X-Debug-Database-SaveQueries:" . $wpdb->save_queries );

      if( !headers_sent() ) {
        global $wp_locale;
        if( !isset( $wp_locale ) ) {
          require_once ABSPATH . WPINC . '/locale.php';
          $wp_locale = new \WP_Locale();
        }
        header( "X-Debug-Trace-" . current_action() . ':' . timer_stop() );
      }

    }

  }

}