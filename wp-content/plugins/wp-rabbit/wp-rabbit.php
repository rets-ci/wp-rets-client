<?php
/**
 * Plugin Name: WP-Rabbit
 * Plugin URI: https://www.usabilitydynamics.com
 * Description: Rabbit.ci environment helper. Purges cache on Varnish/CloudFront, shows a navbar with information about the container.
 * Author: Usability Dynamics, Inc.
 * Version: 1.0.5
 * Text Domain: wp-rabbit
 * Author URI: https://www.usabilitydynamics.com
 *
 * Copyright 2016 Usability Dynamics, Inc.  ( email : info@usabilitydynamics.com )
 *
 */

// Get updates from Git.
include_once( 'lib/updater.php' );

// Purge Varnish/CloudFront cache.
include_once( 'lib/varnish.php' );

// Add navbar to admin menu.
include_once( 'lib/navbar.php' );

