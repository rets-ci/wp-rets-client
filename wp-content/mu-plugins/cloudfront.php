<?php
/**
 * Plugin Name: CloudFront and Redirection Support
 * Plugin URI: http://usabilitydynamics.com
 * Description: Enable support for serving site via CloudFront
 * Author: Andy Potanin
 * Version: 2.1
 * Author URI: http://usabilitydynamics.com
 *
 *
 * ### Notes
 *
 * - For some reason the homepage request (https://cloudfront.usabilitydynamics.com/) does not include the HTTP_CLOUDFRONT_ headers.
 * - Woo cookies:
 *  - wp_woocommerce
 *  - woocommerce_items_in_cart
 *  - woocommerce_cart_hash
 *  - wp_woocommerce_session_XXX
 *
 *
 * ### Configure
 * First make sure you are using the correct DB.
 *
 *    wp option get db_name
 *
 * Anything required to login/logout and admin does not use "www". AJAX URL should not be cached either in most cases.
 * For the frontend (siteurl, home) we use the www prefix.
 *
 * wp option update adminurl    https://reddoorcompany.com/wp-admin (Required for module to work)
 * wp option update loginurl    https://reddoorcompany.com/wp-login.php
 * wp option update ajaxurl     https://reddoorcompany.com/wp-admin/admin-ajax.php
 * wp option update cloudfront  https://www.reddoorcompany.com
 *
 * On latest:
 * wp option update adminurl    https://reddoorcompany.com
 * wp option update cloudfront  https://cloudfront-staging.reddoorcompany.com
 *
 *
 * ### Testing
 *
 *  curl -k https://localhost -H 'x-cloudfront-proto:https' -H "host:reddoorcompany.com"
 *  curl -k https://localhost -H "host:www.reddoorcompany.com"
 *  curl -k https://localhost -H "host:cloudfront.reddoorcompany.com"
 *
 *
 * @todo Setup custom cache-control rules for home-page, while not caching any WC API requests. CF does not have default settings for /
 *
 */
namespace UsabilityDynamics\CloudFront {

	if( defined( 'WP_CLI' ) ) {
		return;
	}

	if ( defined( 'DOING_CRON' ) ) {
		return;
	}

	// Do nothing for certain domains.
	if( in_array( $_SERVER['HTTP_HOST'], array( 'subdomains-to-exclude-completely.example.com' ) ) ) {
		return;
	}

	// For now its simple, a handful of domains all will function as "www.reddoorcompany.com" internally while using the custom urls in the browser.
	$_domains_to_mask = array(
		"cloudfront-staging.reddoorcompany.com" => "www.reddoorcompany.com",
		"usabilitydynamics-www-reddoorcompany-com-latest.c.wpcloud.io" => "www.reddoorcompany.com",
		"usabilitydynamics-www-reddoorcompany-com-latest.c.rabbit.ci" => "www.reddoorcompany.com",
		"usabilitydynamics-www-reddoorcompany-com-production.c.wpcloud.io" => "www.reddoorcompany.com",
		"usabilitydynamics-www-reddoorcompany-com-production.c.rabbit.ci" => "www.reddoorcompany.com",
		"usabilitydynamics-www-reddoorcompany-com-develop-mehul.c.rabbit.ci" => "www.reddoorcompany.com",
		"d1s5isrzd47wsa.cloudfront.net" => "www.reddoorcompany.com", // prod cloudfront
		"d85q7g852omyp.cloudfront.net" => "www.reddoorcompany.com" // latest cloudfront
	);

	// If cloudfront not set we assume nothing is configured. Should just be URL of what to use for CF.
	if( !get_option( 'cloudfront' ) ) {
		return;
	}

	// Check if the request hostname is supposed to be used as a "mask" or "silent redirection" to another. This is what makes development subdomains possible.
	if( isset( $_domains_to_mask[$_SERVER['HTTP_HOST']] ) ) {

		// Store actual request-host.
		$_SERVER['WP_CLOUDFRONT_ORIGINAL_HOST'] = ( isset( $_SERVER[ 'WP_CLOUDFRONT_ORIGINAL_HOST' ] ) ? $_SERVER[ 'WP_CLOUDFRONT_ORIGINAL_HOST' ] : $_SERVER['HTTP_HOST'] );

		// Set domain name that we are "masking from", what will be used in browser for urls
		$_SERVER['WP_CLOUDFRONT_HOST_FOR_BROWSER'] = $_SERVER['HTTP_HOST'];

		// actual host to use interlaly for DB and stuff
		$_SERVER['WP_CLOUDFRONT_HOST_FOR_SERVER'] = $_domains_to_mask[$_SERVER['HTTP_HOST']];
	}

	// These always apply because relative all siteurl based urls.
	add_filter( 'admin_url', 'UsabilityDynamics\CloudFront\Redirection::drop_www', 10 );
	add_filter( 'network_admin_url', 'UsabilityDynamics\CloudFront\Redirection::drop_www', 10 );
	add_filter( 'logout_url', 'UsabilityDynamics\CloudFront\Redirection::drop_www', 10 );
	add_filter( 'lostpassword_url', 'UsabilityDynamics\CloudFront\Redirection::drop_www', 10 );

	// If we are on a "staging" domain, we tweak the URLs used.
	if( isset( $_SERVER[ 'WP_CLOUDFRONT_HOST_FOR_SERVER' ] ) && isset(  $_SERVER[ 'WP_CLOUDFRONT_HOST_FOR_BROWSER' ] ) && $_SERVER[ 'WP_CLOUDFRONT_HOST_FOR_SERVER' ] !== $_SERVER[ 'WP_CLOUDFRONT_HOST_FOR_BROWSER' ] ) {

		add_filter( 'home_url', 'UsabilityDynamics\CloudFront\Redirection::staging_domain', 10 );
		add_filter( 'site_url', 'UsabilityDynamics\CloudFront\Redirection::staging_domain', 10 );
		add_filter( 'admin_url', 'UsabilityDynamics\CloudFront\Redirection::staging_domain', 10 );
		add_filter( 'plugins_url', 'UsabilityDynamics\CloudFront\Redirection::staging_domain', 10 );
		add_filter( 'network_admin_url', 'UsabilityDynamics\CloudFront\Redirection::staging_domain', 10 );
		add_filter( 'content_url', 'UsabilityDynamics\CloudFront\Redirection::staging_domain', 10 );
	}

	// Not sure where they shouold be defined. Bit added here since dealing with redirection issues/concerns of wp-admin/wp-login.php
	// add_filter( 'login_url', function() {return home_url('/account');}, 10 );

	// We assume that https is always present by this point, but should add a check for it later.
	// Would be prudent to coordinate better with wp_login_url(), admin_url(), etc.
	$_case = array(
		'options' => array(
			'adminurl' => admin_url(),
			'loginurl' => get_option( 'loginurl' ), //site_url( 'wp-login.php' ),
			'ajaxurl' => get_admin_url( null, 'admin-ajax.php' ),
			'siteurl' => site_url(),
			'home' => home_url()
		),
		'url' => 'https://' . ( isset( $_SERVER[ 'WP_CLOUDFRONT_ORIGINAL_HOST' ] ) ? $_SERVER[ 'WP_CLOUDFRONT_ORIGINAL_HOST' ] : $_SERVER['HTTP_HOST'] ) . '' . $_SERVER['REQUEST_URI'],
		'redirect' => false,
		'ok' => null
	);

	// This happens for "api" subdomain requests that are forwarded to admin-ajax.php by Varnish.
	if( isset( $_SERVER['HTTP_X_FORWARDED_HOST'] ) && isset( $_SERVER['HTTP_X_FORWARDED_URI'] ) ) {
		$_case['url'] = 'https://' . $_SERVER[ 'HTTP_X_FORWARDED_HOST'] . '' . $_SERVER['HTTP_X_FORWARDED_URI'];
	}

	// No good way to catch wp-login, no constant set on it.
	if( strpos( $_SERVER['REQUEST_URI'],'/wp-login.php' ) === 0 ) {
		define('WP_LOGIN_PAGE', true);
	}

	// Means somebody opened wp-admin/admin-ajax.php file.
	// https://cloudfront.usabilitydynamics.com/wp-admin/admin-ajax.php?action=/v1/status
	// https://usabilitydynamics.com/wp-admin/admin-ajax.php
	// https://api.usabilitydynamics.com
	if( defined( 'DOING_AJAX' ) ) {
		if( strpos( $_case['url'],  $_case['options']['ajaxurl'] ) !== 0 ) {

			// @note This may cause issues - we try to take the "action" argument and append it to the request, may be better just to forward to root.
			$_case['redirect'] = $_case['options']['ajaxurl'] . ( isset( $_GET['action'] ) ? $_GET['action'] : '' );
			$_case['ok'] = false;
			$_case['failure'] = 'ajax';

			return;
		} else {
			$_case['ok'] = true;
		}

	}

	// redirect all xmlrpc.php requests to non-www. CloueFront won't accept POST requests to www so it'll fail, but should only affect hackers anyway.
	if( defined( 'XMLRPC_REQUEST' ) ) {
		if( strpos( $_case['url'], get_option( 'xmlrpcurl' ) ) !== 0 ) {
			$_case['redirect'] = get_option( 'xmlrpcurl' );
			$_case['ok'] = false;
			$_case['failure'] = 'xmlrpc';
		} else {
			$_case['ok'] = true;
		}
	}

	// General admin that is NOT admi-ajax. We must verify that the current request meets the adminurl prefix.
	if( defined( 'WP_ADMIN' ) && !defined( 'DOING_AJAX'  ) ) {

		if( strpos( $_case['url'], $_case['options']['adminurl'] ) !== 0 ) {
			$_case['redirect'] = $_case['options']['adminurl'];
			$_case['ok'] = false;
			$_case['failure'] = 'admin';
		} else {
			$_case['ok'] = true;
			add_filter( 'site_url', 'UsabilityDynamics\CloudFront\Redirection::drop_www', 10 );
			add_filter( 'admin_url', 'UsabilityDynamics\CloudFront\Redirection::drop_www', 10 );
			add_filter( 'plugins_url', 'UsabilityDynamics\CloudFront\Redirection::drop_www', 10 );
			add_filter( 'network_admin_url', 'UsabilityDynamics\CloudFront\Redirection::drop_www', 10 );
			add_filter( 'content_url', 'UsabilityDynamics\CloudFront\Redirection::drop_www', 10 );
		}

	}

	// Check Login. // https://usabilitydynamics.com/wp-login.php?redirect_to=https%3A%2F%2Fusabilitydynamics.com%2Fwp-admin%2F&reauth=1
	if( !defined( 'WP_ADMIN' ) && !defined( 'DOING_AJAX'  ) && defined( 'WP_LOGIN_PAGE' ) ) {

		if( strpos( $_case['url'], $_case['options']['loginurl'] ) !== 0 ) {
			//wp_die('Incorrect login page.');
			$_case['redirect'] = $_case['options']['loginurl'];
			$_case['ok'] = false;
			$_case['failure'] = 'login';
		} else {
			$_case['ok'] = true;
			add_filter( 'home_url', 'UsabilityDynamics\CloudFront\Redirection::drop_www', 10 );
			add_filter( 'site_url', 'UsabilityDynamics\CloudFront\Redirection::drop_www', 10 );
			add_filter( 'plugins_url', 'UsabilityDynamics\CloudFront\Redirection::drop_www', 10 );
			add_filter( 'content_url', 'UsabilityDynamics\CloudFront\Redirection::drop_www', 10 );
		}

	}

	// Check all other content, if everything "ok" so far and no redirection has already been set. We make a special exception for "preview" links.
	if( !defined( 'DOING_AJAX' ) && !defined( 'WP_ADMIN' ) && !defined( 'WP_LOGIN_PAGE' ) && !defined( 'XMLRPC_REQUEST' ) ) {

		if( ( strpos( $_case[ 'url' ], $_case['options']['siteurl'] ) !== 0 ) && ( !isset( $_GET['preview'] ) && !isset( $_GET['p'] ) ) ) {
			$_case[ 'redirect' ] = $_case['options']['siteurl'] . $_SERVER[ 'REQUEST_URI' ];
			$_case[ 'ok' ] = false;
			$_case['failure'] = 'content';
		} else {
			$_case[ 'ok' ] = true;
			// @note we do not apply filters to change the urls here to not have "www" because even if we do they (js/css assets) will 301 to www
		}

	}


	// If redirection has been found, we do so now.
	if( !$_case['ok'] && $_case['redirect']  ) {
		die(header("Location: " . $_case['redirect'], true, 302));
	}

	// Main flag for going into CF mode.
	if( isset( $_SERVER['HTTP_CLOUDFRONT_FORWARDED_PROTO'] ) && $_SERVER['HTTP_CLOUDFRONT_FORWARDED_PROTO'] === 'https' ) {
		define( 'CLOUDFRONT_ENABLED', true );
	}

	add_action( 'admin_init',                     array( 'UsabilityDynamics\CloudFront\Actions', 'admin_init' ), 10 );
	add_action( 'plugins_loaded',                 array( 'UsabilityDynamics\CloudFront\Actions', 'plugins_loaded' ), 10 );
	add_action( 'template_redirect',              array( 'UsabilityDynamics\CloudFront\Actions', 'template_redirect' ), 10 );
	add_action( 'template_redirect',              array( 'UsabilityDynamics\CloudFront\Actions', 'set_response_headers' ), 20 );
	add_action( 'muplugins_loaded',               array( 'UsabilityDynamics\CloudFront\Actions', 'muplugins_loaded' ), 10 );
	add_action( 'init',                           array( 'UsabilityDynamics\CloudFront\Actions', 'init' ), 10 );

	add_filter( 'secure_auth_redirect',           array( 'UsabilityDynamics\CloudFront\Filters', 'secure_auth_redirect' ), 10, 2 );
	add_filter( 'admin_url',                      array( 'UsabilityDynamics\CloudFront\Filters', 'admin_url' ), 10, 3 );
	add_filter( 'preview_post_link',              array( 'UsabilityDynamics\CloudFront\Filters', 'preview_post_link' ), 10 );

	class Redirection {

		/**
		 * Make all the WP urls work without the 'www' subdomain, which is otherwise expected.
		 *
		 * * Also make everything htttps to be on the safe side
		 *
		 * @todo Utilize $_masked_to setting.
		 * @param null $url
		 * @return null|string
		 */
		static public function drop_www( $url = null ) {

			$url = set_url_scheme( str_replace( 'www.', '', $url ), 'https' );

			// on cloudfront (staging) domain we need to drop the cloudfront part
			$url = set_url_scheme( str_replace( 'cloudfront.', '', $url ), 'https' );
			//$url = set_url_scheme( str_replace( $_SERVER['WP_CLOUDFRONT_HOST_FOR_SERVER'], $_SERVER['WP_CLOUDFRONT_HOST_FOR_BROWSER'], $url ), 'https' );

			return $url;

		}

		static public function staging_domain( $url = null ) {

			//$url = set_url_scheme( str_replace( 'www.', 'cloudfront.', $url ), 'https' );

			// Replace the for-server hostname with the for-browser hostname. e.g. "www.reddoorcompany.com/stuff" becomes "usabilitydynamics-www-reddoorcompany-com-latest.c.rabbit.ci/stuff"
			$url = set_url_scheme( str_replace( $_SERVER['WP_CLOUDFRONT_HOST_FOR_SERVER'], $_SERVER['WP_CLOUDFRONT_HOST_FOR_BROWSER'], $url ), 'https' );

			return $url;

		}

		/**
		 * For Later.
		 *
		 * @param $redirect_url
		 * @param $requested_url
		 *
		 * @return mixed|string
		 */
		static public function redirect_canonical( $redirect_url = '', $requested_url = null ) {

			return $redirect_url;

		}

	}

	class API {

	}

	class Filters {

		/**
		 *
		 * @hack to trick "auth_redirect" method into using ouf CF domain for login.
		 *
		 */
		static public function secure_auth_redirect( $setting ) {

			// Verify this is needed.
			if( is_admin() ) {
				// $_SERVER['HTTP_HOST'] = $_SERVER['WP_CLOUDFRONT_ORIGINAL_HOST'];
			}

			return $setting;

		}

		/**
		 * Modify Preview links to not use the www domain.
		 *
		 * @param $setting
		 * @return mixed
		 */
		static public function preview_post_link( $preview_link, $post ) {

			$preview_link = str_replace( 'www.', '', $preview_link );
			$preview_link = str_replace( 'cloudfront.', '', $preview_link );


			// @todo Add query arg for cache busting, random on each load.s
			// $preview_link = $preview_link

			return $preview_link;

		}

		/**
		 * For CloudFront, we use api subdomain for admin urls.
		 *
		 */
		static public function admin_url( $url, $path, $blog_id ) {

			// We don't want to apply these rules on the admin-side, only for front-end ajax calls.
			if( is_admin() ) {
				return $url;
			}

			// if its admin-ajax.php, we switch it over to api subdomain
			if( strpos( $url, 'admin-ajax.php' ) > 0 && get_option( 'apiurl' ) ) {
				$url = get_option( 'apiurl' );
			}

			return $url;

		}

	}

	class Actions {

		/**
		 *
		 */
		static public function plugins_loaded() {

			// Force WP to think this is a regular request, regardless of domain (direct., www., cloudfront., etc.)
			if( defined('CLOUDFRONT_ENABLED') ) {
				//$_SERVER['HTTPS'] = 'on';
				//$_SERVER['HTTP_HOST'] = 'www.usabilitydynamics.com';
			}

			// for testing headers received by site and returning them. We run this very early since we want to know what headers were sent before any redirection may happen.
			// curl https://cloudfront.usabilitydynamics.com/checkout/?v=3 -H "x-special-action:listHeaders" -H "x-set-branch:staging" -H "x-not-whitelisted:blah"
			if( isset( $_SERVER[ 'HTTP_X_SPECIAL_ACTION' ] ) && $_SERVER[ 'HTTP_X_SPECIAL_ACTION' ] === 'listHeaders' ) {
				die(json_encode(array('ok'=>true,"data"=>$_SERVER), JSON_PRETTY_PRINT ));
			}

		}

		/**
		 * Must do this before plugins load otherwise some of them may set URLs incorrectly by setting a constant.
		 *
		 */
		static public function muplugins_loaded() {

			if( defined('CLOUDFRONT_ENABLED') ) {
				$_SERVER['HTTPS'] = 'on';

				//  $_SERVER['WP_CLOUDFRONT_ORIGINAL_HOST'] = $_SERVER['HTTP_HOST'];

				if( is_admin() ) {
					$_SERVER['HTTP_HOST'] = $_SERVER['WP_CLOUDFRONT_ORIGINAL_HOST'];
					//die('admin override'. $_SERVER['HTTP_HOST']);
				} else {

					// Force WP to think this is a regular request, regardless of domain (direct., www., cloudfront., etc.)
					//$_SERVER['HTTP_HOST'] = 'www.usabilitydynamics.com';
				}

				// @temp So I can develop quicker...
				// $_SERVER['HTTP_HOST'] = 'cloudfront.usabilitydynamics.com';

			}

			//echo("setting host". $_SERVER['HTTP_HOST']);

		}

		/**
		 *
		 */
		static public function init() {

			// remove the existing redirection logic completely. (Its redirection will definitely conflict)
			remove_filter( 'redirect_canonical', array( 'UsabilityDynamics\MU\Redirection', 'redirect_canonical' ), 10 );

			// add our own redirection script
			add_filter( 'redirect_canonical', array( 'UsabilityDynamics\CloudFront', 'redirect_canonical' ), 10 );

			// CloudFront configuration will ignore these.
			header( 'cache-control:no-cache, private' );

			// Thought PageSpeed won't work with CF but I see that JS files are being minified.. ?
			header( 'PageSpeed:off' );
			header( 'PageSpeedFilters:combine_javascript,rewrite_javascript,remove_comments,collapse_whitespace,combine_css,rewrite_images,rewrite_css' );

			// Disable WooCommerce stuff.
			add_filter( 'pre_option_woocommerce_enable_ajax_add_to_cart', function() {return 'yes';});
			add_filter( 'pre_option_woocommerce_cart_redirect_after_add', function() {return 'no';});
			// add_filter( 'pre_option_woocommerce_enable_lightbox', function() {return false;});


		}

		/**
		 * Frontend Facing
		 *
		 */
		static public function template_redirect() {

			// No point showing it only our 1-3 non-cached pages.
			add_filter('show_admin_bar', '__return_false');

			// Removes some CSS added for admin bar.
			remove_action('wp_head', '_admin_bar_bump_cb');

		}

		/**
		 *
		 */
		static public function admin_init() {

			// may be needed from other UD domain/subdomains
			// $_custom_origin = defined( 'CLOUDFRONT_ENABLED' ) ? 'www.usabilitydynamics.com' : $_SERVER['ORIGIN'];

			if ( defined( 'DOING_AJAX' ) && defined( 'WP_ADMIN' ) ) {

				// Allow staging domains to be used (this is for API requests)
				if( isset( $_SERVER['HTTP_ORIGIN'] ) && in_array( $_SERVER['HTTP_ORIGIN'], array( 'https://cloudfront.usabilitydynamics.com', 'https://direct.usabilitydynamics.com', 'https://usabilitydynamics.com' ) ) ) {
					header( 'Access-Control-Allow-Origin:' . $_SERVER['HTTP_ORIGIN'] );
				} else {
					header( 'Access-Control-Allow-Origin:https://www.usabilitydynamics.com' );
				}

				header( 'Access-Control-Request-Method:POST,GET,OPTIONS' );
				header( 'Access-Control-Allow-Credentials:true' );

				//die( '<pre>' . print_r( $_SERVER['HTTP_ORIGIN'], true ) . '</pre>' );
			}

		}

		/**
		 * Cache home page forever, until purge. (31536000)
		 * Max Age - how long browser will cache for
		 * S-Max-Age - how long proxies will cache for
		 *
		 * This logic no longer applies, everything except for select pages defined in CF should be cahable for all.
		 *
		 * CloudFront is configured to force zero-time caching on the few select pages we hae that are truly private
		 * - /account
		 * - /cart
		 * - /checkout
		 * - /wp-admin
		 * - /xmlrpc.php - Does not forward cookies either, all others do.
		 *
		 * Not sure what to do with /wp-cron.php (probably should go to api subdomain)
		 *
		 */
		static public function set_response_headers() {
			global $wp_query;

			$_policy = array(
				"set" => false,
				"value" => 'public,max-age=31536000,s-maxage=31536000',
				"reason" => "",
				"query" => $wp_query
			);

			if( isset( $_SERVER['REQUEST_URI'] ) && strpos( $_SERVER['REQUEST_URI'], '/account' ) === 0 ) {
				header( 'cache-control:private,max-age=0' );
				return;
			}

			if( isset( $_SERVER['REQUEST_URI'] ) && strpos( $_SERVER['REQUEST_URI'], '/cart' ) === 0 ) {
				header( 'cache-control:private,max-age=0' );
				return;
			}

			if( isset( $_SERVER['REQUEST_URI'] ) && strpos( $_SERVER['REQUEST_URI'], '/checkout' ) === 0 ) {
				header( 'cache-control:private,max-age=0' );
				return;
			}

			// We cache normal content "forever" and then purge when need to.
			if( !$_policy['set'] && ( is_page() || is_single() || is_attachment() || is_home() || is_front_page() ) ) {
				$_policy[ "set" ] = true;
				$_policy[ "reason" ] = "Single post, single page, attachment, home or front page are cached forever.";
			}

			// Questionable...
			if( !$_policy['set'] && is_search() ) {
				$_policy[ "set" ] = true;
				$_policy[ "reason" ] = "Search cached forever.";
			}

			// Lets home previews use very unique hashes, they'll be cached forever.
			if( !$_policy['set'] && is_preview() ) {
				$_policy[ "set" ] = true;
				$_policy[ "reason" ] = "Previews are cached forever.";
			}

			// Traditionally this would not be cached, but now - we no longer give a shit. Everything is cached the same for everybody.
			if( !$_policy['set'] && is_user_logged_in() ) {
				$_policy[ "set" ] = true;
				$_policy[ "reason" ] = "You are logged in, but we do not care.";
			}

			// This is no exception.
			if( !$_policy['set'] && is_404() ) {
				$_policy[ "set" ] = true;
				$_policy[ "reason" ] = "404 requests are cached forever.";
			}

			// Set cache-control header.
			if( $_policy[ "set" ] && !headers_sent()) {
				header('cache-control:'.$_policy[ "value" ]);
			}

			return $_policy;

		}

		/**
		 * Should not have to do anything here?
		 *
		 * @param string $redirect_url
		 * @param null $requested_url
		 * @return null
		 */
		static public function redirect_canonical( $redirect_url = '', $requested_url = null ) {

			return null;
		}

	}

}
