<?php
/**
 * Plugin Name: Dashboard Changes
 * Plugin URI: http://usabilitydynamics.com/
 * Description: Load composer stuff.
 * Author: Usability Dynamics, Inc.
 * Version: 0.1
 * Author URI: http://usabilitydynamics.com
 *
 */

add_action('template_redirect', function() {
	//update_option( 'some-tthing', true );
	//die('dasf');
});

add_action('admin_menu', function() {

	add_dashboard_page( 'Changes', 'Changes', 'manage_options', 'changes', function() {

    if( !class_exists('Parsedown') ) {
      return;
    }
		$Parsedown = new Parsedown();

		echo '<div class="wrap">';
		echo '<h2>Changes</h2>';
		echo $Parsedown->text(file_get_contents( ABSPATH . '/changes.md' ));
		echo "</div>";

	});

});
