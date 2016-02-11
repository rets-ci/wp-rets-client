<?php
/**
 * Plugin Name: DB Error
 * Version: 0.2.0
 * Description: Dropin..
 * Author: Usability Dynamics
 *
 */
global $wpdb;

// If installing or in the admin, provide the verbose message.
if ( $wpdb && ( defined('WP_INSTALLING') || defined('WP_ADMIN') ) ) {
	wp_die($wpdb->error);
}

// Otherwise, be terse.
status_header( 500 );
nocache_headers();
header( 'Content-Type: text/html; charset=utf-8' );
?>
	<!DOCTYPE html>
	<html xmlns="http://www.w3.org/1999/xhtml"<?php if ( is_rtl() ) echo ' dir="rtl"'; ?>>
  <style>body { background-color: #f1f1f1} </style>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title><?php _e( 'Network Error' ); ?></title>
	</head>
	<body>
	<h1><?php _e( 'Network Error' ); ?></h1>
	<p><?php _e( 'Error establishing a database connection.' ); ?></p>

  <?php if( defined( 'WP_DEBUG' ) && WP_DEBUG ) { ?>
    <pre><?php echo printf( __( 'Current Host: %s.' ), $wpdb->current_host ); ?></pre>
  <?php } ?>

  </body>
	</html>
<?php
die();