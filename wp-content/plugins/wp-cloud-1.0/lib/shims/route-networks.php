<?php
/**
 * Plugin Name: Disable Archived/Deleted Blogs
 * Plugin Url: http://wordpress.stackexchange.com/q/98151/1261
 * Version: 1.0
 * Author: Rodolfo Buaiz
 * Author URI: http://wordpress.stackexchange.com/users/12615/brasofilo
 *
 * {"blog_id":"12","site_id":"2","domain":"discodonniepresents.com","path":"\/","registered":"2013-11-17 02:18:59","last_updated":"2014-11-07 06:43:41","public":"1","archived":"0","mature":"0","spam":"0","deleted":"0","lang_id":"0","blogname":"Disco Donnie Presents","siteurl":"http:\/\/discodonniepresents.com","post_count":"1033"}
 *
 */
add_filter( 'ms_site_check', function () {

		if ( current_user_can( 'manage_network' ) ) {
			return;
		}

		$blog = get_blog_details();

		if ( '1' == $blog->deleted or '2' == $blog->deleted or '1' == $blog->archived or '1' == $blog->spam ) {
			//wp_redirect( network_site_url() );
			// die();
		}

	}
);