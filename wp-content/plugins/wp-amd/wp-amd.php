<?php
/**
 * Plugin Name: WP-AMD
 * Text Domain: wp-amd
 * Plugin URI: http://UsabilityDynamics.com/plugins/wp-amd/
 * Description: Global JS and CSS handling.
 * Author: Usability Dynamics, Inc
 * Version: 1.2.1
 * Author URI: http://UsabilityDynamics.com
 * Domain Path: /static/languages/
 * Text Domain: wp-amd
 * GitHub Plugin URI: UsabilityDynamics/wp-amd
 *
 * Copyright 2011-2014  Usability Dynamics, Inc.   (email : info@UsabilityDynamics.com)
 *
 * Created by Usability Dynamics, Inc
 * (website: UsabilityDynamics.com       email : info@UsabilityDynamics.com)
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 *
 * @author Andy Potanin <andy.potanin@usabilitydynamics.com>
 */

if( !function_exists( 'get_wp_amd' ) ) {

  if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
    require_once ( __DIR__ . '/vendor/autoload.php' );
  }

  define( 'WP_AMD_DIR', plugin_dir_path( __FILE__ ) );
  define( 'WP_AMD_URL', plugin_dir_url( __FILE__ ) );

  /**
   * Returns WP_AMD object
   *
   * @author peshkov@UD
   */
  function get_wp_amd( $key = false, $default = null ) {
    if( class_exists( '\UsabilityDynamics\AMD\Bootstrap' ) ) {
      $instance = \UsabilityDynamics\AMD\Bootstrap::get_instance();
      return $key ? $instance->get( $key, $default ) : $instance;
    }
    return false;
  }

}

// Initialize.
get_wp_amd();
