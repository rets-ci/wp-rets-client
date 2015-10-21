<?php 
/**
 * Loading the files within the /lib directory. 
 *
 * @since 1.0.0
*/

// Load the custom header.
require_once( dirname( __FILE__ ) . '/custom-header/init.php' );

// Load the customizer.
require_once( dirname( __FILE__ ) . '/customizer/init.php' );

// Load the extras.
require_once( dirname( __FILE__ ) . '/extras/filters.php' );
require_once( dirname( __FILE__ ) . '/extras/hooks.php' );
require_once( dirname( __FILE__ ) . '/extras/post-formats.php' );
require_once( dirname( __FILE__ ) . '/extras/template-tags.php' );