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

/**
 * Load Site Origin Custom Widgets
 */
add_filter( 'siteorigin_widgets_widget_folders', function( $folders ) {
  $folders[] = dirname( __FILE__ ) . '/so_widgets/';
  return $folders;
} );
add_filter( 'siteorigin_widgets_default_active', function( $widgets ) {
  $widgets['so-property-carousel-widget'] = 1;
  $widgets['so-tabs-unit-widget'] = 1;
  $widgets['so-recent-posts-widget'] = 1;
  return $widgets;
} );