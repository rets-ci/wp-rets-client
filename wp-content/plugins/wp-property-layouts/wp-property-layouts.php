<?php
/**
 * Plugin Name: WP-Property: Layouts
 * Plugin URI: https://www.usabilitydynamics.com
 * Description: Significantly changes the way fronend layouts/templates are handled in WP-Property.
 * Author: Usability Dynamics, Inc.
 * Version: 1.0.0
 * Text Domain: wp-property-layouts
 * Author URI: http://usabilitydynamics.com
 *
 * Copyright 2012 - 2015 Usability Dynamics, Inc.  ( email : info@usabilitydynamics.com )
 *
 */

if (!function_exists('ud_get_wp_property_layouts')) {

  /**
   * Returns WP-Property: Layouts Instance
   *
   * @author Usability Dynamics, Inc.
   * @since 1.0.0
   */
  function ud_get_wp_property_layouts($key = false, $default = null)
  {
    $instance = \UsabilityDynamics\WPP\Layouts_Bootstrap::get_instance();
    return $key ? $instance->get($key, $default) : $instance;
  }

}

if (!function_exists('ud_check_wp_property_layouts')) {
  /**
   * Determines if plugin can be initialized.
   *
   * @author Usability Dynamics, Inc.
   * @since 1.0.0
   */
  function ud_check_wp_property_layouts()
  {
    global $_ud_wp_property_layouts_error;
    try {
      //** Be sure composer.json exists */
      $file = dirname(__FILE__) . '/composer.json';
      if (!file_exists($file)) {
        throw new Exception(__('Distributive is broken. composer.json is missed. Try to remove and upload plugin again.', 'wp-property-layouts'));
      }
      $data = json_decode(file_get_contents($file), true);
      //** Be sure PHP version is correct. */
      if (!empty($data['require']['php'])) {
        preg_match('/^([><=]*)([0-9\.]*)$/', $data['require']['php'], $matches);
        if (!empty($matches[1]) && !empty($matches[2])) {
          if (!version_compare(PHP_VERSION, $matches[2], $matches[1])) {
            throw new Exception(sprintf(__('Plugin requires PHP %s or higher. Your current PHP version is %s', 'wp-property-layouts'), $matches[2], PHP_VERSION));
          }
        }
      }
      //** Be sure vendor autoloader exists */
      if (file_exists(dirname(__FILE__) . '/vendor/autoload.php')) {
        require_once(dirname(__FILE__) . '/vendor/autoload.php');
      } else {
        throw new Exception(sprintf(__('Distributive is broken. %s file is missed. Try to remove and upload plugin again.', 'wp-property-layouts'), dirname(__FILE__) . '/vendor/autoload.php'));
      }
      //** Be sure our Bootstrap class exists */
      if (!class_exists('\UsabilityDynamics\WPP\Layouts_Bootstrap')) {
        throw new Exception(__('Distributive is broken. Plugin loader is not available. Try to remove and upload plugin again.', 'wp-property-layouts'));
      }
    } catch (Exception $e) {
      $_ud_wp_property_layouts_error = $e->getMessage();
      return false;
    }
    return true;
  }

}

if (!function_exists('ud_wp_property_layouts_message')) {
  /**
   * Renders admin notes in case there are errors on plugin init
   *
   * @author Usability Dynamics, Inc.
   * @since 1.0.0
   */
  function ud_wp_property_layouts_message()
  {
    global $_ud_wp_property_layouts_error;
    if (!empty($_ud_wp_property_layouts_error)) {
      $message = sprintf(__('<p><b>%s</b> can not be initialized. %s</p>', 'wp-property-layouts'), 'WP-Property: Layouts', $_ud_wp_property_layouts_error);
      echo '<div class="error fade" style="padding:11px;">' . $message . '</div>';
    }
  }

  add_action('admin_notices', 'ud_wp_property_layouts_message');
}

if (!function_exists('wpp_layouts_disable_adding_terms')) {
  /**
   * Disabling adding terms in 'layout_type' taxonomy
   *
   * @author Usability Dynamics, Inc.
   * @since 1.0.0
   */
  function wpp_layouts_disable_adding_terms($term, $taxonomy)
  {
    if ('layout_type' === $taxonomy) {
      return new WP_Error('term_addition_blocked', __('You cannot add terms to this taxonomy'));
    }
    return $term;
  }
}


if (function_exists('siteorigin_panels_init')) {
  add_filter('siteorigin_panels_settings_defaults', function ($defaults) {
    $defaults['post-types'] = array('page', 'post', 'wpp_layout');
    return $defaults;
  });
}

if (!defined('WPP_LAYOUTS_PATH')) {
  define('WPP_LAYOUTS_PATH', plugin_dir_path(__FILE__));
}

if (!defined('WPP_LAYOUTS_URL')) {
  define('WPP_LAYOUTS_URL', plugin_dir_url(__FILE__));
}

if (!defined('WPP_LAYOUTS_VERSION')) {
  $file = json_decode(file_get_contents(plugin_dir_path(__FILE__) . '/package.json'));
  define('WPP_LAYOUTS_VERSION', $file->version);
}

if (ud_check_wp_property_layouts()) {

  include_once('lib/updater.php');

  //** Initialize. */
  ud_get_wp_property_layouts();

}
