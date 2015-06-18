<?php
/**
 * Plugin Name: Prevent Archived/Deleted blogs warning in Multisite
 * Plugin Url: http://wordpress.stackexchange.com/q/98151/1261
 * Version: 1.0
 * Author: Rodolfo Buaiz
 * Author URI: http://wordpress.stackexchange.com/users/12615/brasofilo
 *
 */

add_filter( 'ms_site_check', function () {

		if ( current_user_can( 'manage_network' ) ) {
			return;
		}

		$blog = get_blog_details();

		//die( '<pre>' . print_r( $blog, true ) . '</pre>');

		if ( '1' == $blog->deleted or '2' == $blog->deleted or '1' == $blog->archived or '1' == $blog->spam ) {
			//wp_redirect( network_site_url() );
			// die();
		}

	}
);