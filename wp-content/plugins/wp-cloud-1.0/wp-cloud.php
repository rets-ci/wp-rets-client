<?php
/**
 * Plugin Name: WP-Cloud
 * Plugin URI: http://wpcloud.io/plugins/wp-cloud
 * Description: Core wpCloud.io functionality.
 * Version: 1.5.1
 * Author: wpCloud.io
 * Author URI: http://wpcloud.io/
 * License: GPLv2 or later
 * Network: True
 * Domain Path: /static/locale/
 * Text Domain: wp-cloud
 * GitHub Plugin URI: wpCloud/wp-cloud
 * GitHub Branch: v1.0
 *
 */

if( file_exists( __DIR__ . '/vendor/libraries/autoload.php' ) ) {
  include_once( __DIR__ . '/vendor/libraries/autoload.php' );
}

if( class_exists( '\wpCloud\Bootstrap' ) ) {

  $_wp_cloud = new wpCloud\Bootstrap(array(
    "path" => plugin_dir_path( __FILE__ ),
    "url" => plugin_dir_url( __FILE__ )
  ));

}

