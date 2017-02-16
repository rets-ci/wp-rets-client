<?php
/**
 * PropertyPro Theme Loader
 *
 *
 */

// Load Vendor and Theme Classes, if available.
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
  require_once(__DIR__ . '/vendor/autoload.php');
}

if (class_exists('\UsabilityDynamics\PropertyPro\Config')) {
  $config = new \UsabilityDynamics\PropertyPro\Config();
}

// If Bootstrap class not found, we must fail, unless we are administrating.
if (!class_exists('UsabilityDynamics\PropertyPro\Bootstrap') && !is_admin()) {
  wp_die('<h2>Fatal Error</h2><p>Missing UsabilityDynamics\PropertyPro\Bootstrap class.</p>');
}

// Instantiate Class.
UsabilityDynamics\PropertyPro\Bootstrap::get_instance();

require_once get_template_directory() . '/lib/classes/class-customizer.php';

if (class_exists('SiteOrigin_Widget')) {
  require_once get_template_directory() . '/lib/widgets/property-pro-masthead/property_pro_masthead.php';
  require_once get_template_directory() . '/lib/widgets/property-pro-testimonials/property_pro_testimonials.php';
}