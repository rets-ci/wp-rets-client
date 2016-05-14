<?php
/**
 * Plugin Name: Redirection
 * Plugin URI: http://usabilitydynamics.com/
 * Description: Handles sub-domain sharding and SSL enforcement.
 * Author: Usability Dynamics, Inc.
 * Version: 0.1.0
 * Author URI: http://usabilitydynamics.com
 *
 * * Redirection only affects the front-end.
 * * As long as "siteurl" matches domain set in "wp_blogs" WordPress will not have redirection loops.
 * * The "home" value should include www.
 *
 */
namespace wpCloud\MU {

	class Redirection {

		/**
		 * Handle Domain Sharding
		 *
		 */
		static public function init() {
			global $current_blog;

			$_host = isset( $_SERVER['X_HTTP_ORIGINAL_HOST'] ) ? $_SERVER['X_HTTP_ORIGINAL_HOST'] : $_SERVER['HTTP_HOST'];

			if( !isset( $_SERVER[ 'REQUEST_SCHEME' ] ) ) {
				$_SERVER[ 'REQUEST_SCHEME' ]  = 'http';
			}

			$requested_url  = $_SERVER[ 'REQUEST_SCHEME' ] . '://' . $_host . $_SERVER[ 'REQUEST_URI' ];
			$redirect_url   = $_SERVER[ 'REQUEST_SCHEME' ] . '://' . $_host . $_SERVER[ 'REQUEST_URI' ];

			// Require SSL scheme for all "api" subdomain requests
			if( get_option( '_force:ssl:api' ) === 'true' && strpos( $redirect_url, '://api.' ) && $_SERVER[ 'REQUEST_SCHEME' ] === 'http' ) {
				$redirect_url = set_url_scheme( $redirect_url, 'https' );
			}

			if( get_option( '_shard:api' ) ) {

				if( is_admin() ) {}

				// Ensure that home "URL" includes prefix, forcing redirect_canocial to handle the redirection properly in template_redirect
				add_filter( 'admin_url', function( $default ) {
					return strpos( $default, '://api.' ) ? $default : str_replace( array( '://', 'wp-admin/admin-ajax.php' ), array( '://api.', '' ), $default );
				});

			}

			if( get_option( '_shard:assets' ) ) {

			}

			if( get_option( '_shard:media' ) ) {

			}

			// For all web requests the "www" prefix must be used.
			if( get_option( '_shard:www' ) &&  $current_blog->domain === $_host && !strpos( $redirect_url, '://www.' ) ) {
				// $redirect_url = str_replace( '://', '://www.', $redirect_url );

				$current_blog->domain = 'www.' . $current_blog->domain;

				if( $_SERVER[ 'SCRIPT_NAME' ] === '/wp-login.php' ) {}

				// Ensure that home "URL" includes prefix, forcing redirect_canocial to handle the redirection properly in template_redirect
				add_filter( 'option_home', function( $default ) {
					return strpos( $default, '://www.' ) ? $default : str_replace( '://', '://www.', $default );
				});

			}

			//die( '<pre>' . print_r( $current_blog, true ) . '</pre>');
			//die($redirect_url);
			// Redirect if redirection URL has changed.
			if( $requested_url !== $redirect_url ) {
				header( 'Pragma:no-cache' );
				header( 'Cache-Control:no-cache' );
				header( "Location: $redirect_url", true, 301 );
				exit;
			}

		}

		/**
		 * Called when a redirection is detected/required by WordPress.
		 *
		 * For some reason it ignored https:// prefix for now.
		 *
		 * @param $redirect_url
		 * @param $requested_url
		 *
		 * @return mixed|string
		 */
		static public function redirect_canonical( $redirect_url, $requested_url ) {

			// Don't do anything with SSL redirection if we appear already to be in SSL.
			if( ( isset( $_SERVER[ 'HTTP_X_FORWARDED_PROTO' ] ) && $_SERVER[ 'HTTP_X_FORWARDED_PROTO' ] === 'https' ) || is_ssl() ) {
				return $redirect_url;
			}

			// Require SSL scheme for all "www" subdomain requests
			if( get_option( '_force:ssl:www' ) === 'true' && strpos( $redirect_url, '://www.' ) && $_SERVER[ 'REQUEST_SCHEME' ] === 'http' ) {
				$redirect_url = set_url_scheme( $redirect_url, 'https' );
			}

			// Require SSL scheme for all "api" subdomain requests
			if( get_option( '_force:ssl:api' ) === 'true' && strpos( $redirect_url, '://api.' ) && $_SERVER[ 'REQUEST_SCHEME' ] === 'http' ) {
				$redirect_url = set_url_scheme( $redirect_url, 'https' );
			}

			// Require SSL scheme for all "media" subdomain requests
			if( get_option( '_force:ssl:media' ) === 'true' && strpos( $redirect_url, '://media.' ) && $_SERVER[ 'REQUEST_SCHEME' ] === 'http' ) {
				$redirect_url = set_url_scheme( $redirect_url, 'https' );
			}

			// Require SSL scheme for all "assets" subdomain requests
			if( get_option( '_force:ssl:assets' ) === 'true' && strpos( $redirect_url, '://assets.' ) && $_SERVER[ 'REQUEST_SCHEME' ] === 'http' ) {
				$redirect_url = set_url_scheme( $redirect_url, 'https' );
			}

			return $redirect_url;

		}

	}

	//add_action( 'init',               array( 'wpCloud\MU\Redirection', 'init' ), 10 );
	//add_filter( 'redirect_canonical', array( 'wpCloud\MU\Redirection', 'redirect_canonical' ), 10, 2 );

}