<?php 
/**
 * Loading the files within the /lib directory. 
 *
 * @since 1.0.0
*/

// Load help and template functions.
require_once( dirname( __FILE__ ) . '/functions.php' );

// Load the customizer.
require_once( dirname( __FILE__ ) . '/customizer/init.php' );

// Load Widgets
require_once( dirname( __FILE__ ) . '/widgets.php' );