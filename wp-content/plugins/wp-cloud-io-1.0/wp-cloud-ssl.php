<?php
/**
 * Plugin Name: WP-Cloud: SSL
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
namespace wpCloud\SSL {

  if( file_exists( __DIR__ . '/vendor/libraries/autoload.php' ) ) {
    include_once( __DIR__ . '/vendor/libraries/autoload.php' );
  }

  add_action( 'option_active_plugins', 'wpCloud\SSL\Action::init' );

  class Action {

    static public function init() {

      if( is_ssl() ) {

        ob_start( function( $buffer ) {

          // Known CDNs.
          $buffer = str_replace( 'http://ajax.googleapis.com', 'https://ajax.googleapis.com', $buffer );

          // Internal/General.
          $buffer = str_replace( 'href="http://', 'href="https://', $buffer );
          $buffer = str_replace( 'href=\'http://', 'href=\'https://', $buffer );
          $buffer = str_replace( 'src=\'http://', 'src=\'https://', $buffer );
          $buffer = str_replace( 'src="http://', 'src="https://', $buffer );

          return $buffer;

        });

      }

    }

  }

}