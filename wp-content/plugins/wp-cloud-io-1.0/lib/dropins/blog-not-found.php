<?php
/**
 * Plugin Name: Missing Blog
 * Version: 0.2.0
 * Description: Dropin.
 * Author: Usability Dynamics
 *
 */

wp_die( sprintf( '<h1>Network Error</h1><p>The site you requested (%s) does not exist on the (%s) server.</p>', $_SERVER[ 'HTTP_HOST' ],  $_SERVER[ 'SERVER_NAME' ] ) );
