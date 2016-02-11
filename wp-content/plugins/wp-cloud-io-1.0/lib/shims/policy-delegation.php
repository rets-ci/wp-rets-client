<?php
/**
 * Plugin Name: Policy Delegation
 * Plugin URI: http://usabilitydynamics.com/plugins/
 * Description: Main plugin to handle all site specific bootstrap tasks
 * Author: Usability Dynamics, Inc.
 * Version: 0.1.2
 * Author URI: http://usabilitydynamics.com
 *
 * ### Cloud Options
 * Settings that apply to entire cloud/cluster of sites.
 *
 * ### Network (Site) Options
 * Stored in "site-options" cache group using site_id prefix, otherwise fetched from sitemeta table.
 *
 * * pre_site_option_{key} - Ran before making DB call and checking cache.
 * * default_site_option_{key} - Ran after have value
 * * site_option_{key} - Ran before making DB call and checking cache.
 *
 * ### Site (Blog) Options
 * Settings pertaining to a single site.
 *
 * * pre_option_{key} - Ran before making DB call and checking cache.
 * * default_option_{key}
 * * option_{key}
 *
 * ### Transients
 * Transients check to see if external cache is being used before checking in options/sitemeta tables.
 *
 * * pre_transient_{$key} | pre_site_transient_{$key} - Called before cache/DB check.
 * * transient_{$key} | site_transient_{$key} - Applies after cache/DB check.
 *
 * ### General Notes
 * * The pre_ filters are applied when WP_SETUP_CONFIG constant is set.
 *
 *
 * * can_compress_scripts - Should be disabled if PageSpeed is available.
 * * https://gist.githubusercontent.com/andypotanin/2de82e5d6502cc92a654/raw/recently_activated
 * * https://gist.githubusercontent.com/andypotanin/2de82e5d6502cc92a654/raw/_transient_plugin_slugs
 *
 */
namespace EDM\Application\Policy {

	// must have no-transform in cache-control for some reason for server to take it.
	add_filter( 'nocache_headers', function( $headers = array() ) {
		$headers[ 'Cache-Control' ] = 'private, no-cache, no-store, max-age=0, no-transform';
		return $headers;
	});

	add_filter( 'extra_theme_headers', function( $extra_headers ) {
		$extra_headers[] = 'GitHub';
		return $extra_headers;
	});

	add_filter( 'extra_plugin_headers', function( $extra_headers ) {
		$extra_headers[] = 'GitHub';
		return $extra_headers;
	});

	use \wpCloud\Vertical;

	add_action( 'plugins_loaded', 'EDM\Application\Policy\Override::plugins_loaded', 5 );

	// http://discodonniepresents.com/api/v1/site.json
	add_action( 'wp_ajax_/site/v1/meta', 'EDM\Application\Policy\api_site' );
	add_action( 'wp_ajax_nopriv_/site/v1/meta', 'EDM\Application\Policy\api_site' );

	// Filters Disabled.
	add_filter( 'pre_site_option_siteurl', '__return_false' );
	add_filter( 'pre_site_option_site_admins', '__return_false' );
	add_filter( 'pre_option_recently_activated', '__return_false' );
	add_filter( 'pre_option_theme_switched', '__return_false' );

	// Filters return true, works well for booleans.
	add_filter( 'pre_site_option_global_terms_enabled', '__return_false' ); // disabled because causes weird issue with: edm_sitecategories
	add_filter( 'pre_site_option_add_new_users', '__return_true' );
	add_filter( 'pre_site_option_ms_files_rewriting', '__return_true', 5 );
	add_filter( 'pre_site_option_can_compress_scripts', '__return_true', 5 );
	add_filter( 'pre_site_option_subdomain_install', '__return_true' );
	add_filter( 'pre_option_uploads_use_yearmonth_folders', '__return_true' );
	add_filter( 'pre_option_blog_public', '__return_true' );

	// Force the "medium" size to be cropped, by default is not.
	add_filter( 'pre_option_medium_crop', '__return_true' );

	// Blank out options by returning an empty array.
	add_filter( 'pre_site_option_illegal_names', 'EDM\Application\Policy\Override::illegal_names' );
	add_filter( 'pre_option_recently_edited', '__return_empty_array' );

	// Override options - return a fixed array/string
	add_filter( 'pre_option_app:api:url', 'EDM\Application\Policy\Override::app_api_url' );
	add_filter( 'pre_option_app:api:key', 'EDM\Application\Policy\Override::app_api_key' );
	add_filter( 'pre_option_app:api:secret', 'EDM\Application\Policy\Override::app_api_secret' );
	add_filter( 'pre_option_app:api:index', 'EDM\Application\Policy\Override::app_api_index' );

	add_filter( 'pre_option_upload_path', 'EDM\Application\Policy\Override::upload_path' );
	add_filter( 'option_upload_url_path', 'EDM\Application\Policy\Extend::upload_url_path' );

	add_filter( 'pre_option_stylesheet_root', 'EDM\Application\Policy\Override::theme_root' );
	add_filter( 'pre_option_template_root', 'EDM\Application\Policy\Override::theme_root' );
	add_filter( 'pre_option_elasticsearch', 'EDM\Application\Policy\Override::elasticsearch' );

	add_filter( 'option_home', 'EDM\Application\Policy\Extend::home' );
	add_filter( 'option_siteurl', 'EDM\Application\Policy\Extend::siteurl' );

	add_filter( 'option_current_theme', 'EDM\Application\Policy\Extend::theme_selection' );
	add_filter( 'option_allowedthemes', 'EDM\Application\Policy\Extend::allowedthemes' );
	add_filter( 'option_template', 'EDM\Application\Policy\Extend::theme_selection' );
	add_filter( 'option_stylesheet', 'EDM\Application\Policy\Extend::theme_selection' );
	add_filter( 'option_active_plugins', 'EDM\Application\Policy\Extend::active_plugins' );
	add_filter( 'site_option_active_sitewide_plugins', 'EDM\Application\Policy\Extend::sitewide_plugins' );

	// General Actions.
	add_filter( 'admin_print_footer_scripts', array( 'EDM\Application\Policy\Actions', 'admin_print_footer_scripts' ) );

	// Bypass filters for now.
	add_filter( 'pre_site_transient_plugin_slugs', '__return_false' );
	add_filter( 'pre_site_transient_update_themes', '__return_false' );
	add_filter( 'pre_site_transient_theme_roots', '__return_false' );
	add_filter( 'pre_site_transient_timeout_theme_roots', '__return_false' );

	// Site/Network change detection.
	add_action( 'update_option_home', 'EDM\Application\Policy\site_changed' );
	add_action( 'update_option_siteurl', 'EDM\Application\Policy\site_changed' );
	add_filter( 'upload_dir', 'EDM\Application\Policy\Extend::upload_dir', 5 );


	// Cache busting.
	add_filter( 'wp_cache_themes_persistently', '__return_false' );

	class Actions {

		/**
		 * Changes styling of sitewide plugin in network plugin view.
		 *
		 */
		public static function admin_print_footer_scripts() {

			foreach( get_site_option( 'active_sitewide_plugins' ) as $_plugin => $_timestamp ) {
				echo '<style type="text/css">table.wp-list-table.plugins tr#' . dirname( $_plugin ) . ' > td {background-color: rgb(249, 241, 221);}</style>';
				echo '<style type="text/css">table.wp-list-table.plugins tr#' . dirname( $_plugin ) . ' > th {background-color: rgb(249, 241, 221);}</style>';
				echo '<style type="text/css">table.wp-list-table.plugins tr#' . dirname( $_plugin ) . ' > th.check-column > * {opacity:0;}</style>';
				echo '<style type="text/css">table.wp-list-table.plugins tr#' . dirname( $_plugin ) . ' span.deactivate {display:none;}</style>';
			}

		}

	}

	class Defaults {


	}

	class Extend {

		static public function home($data) {

			// $data = str_replace( 'https://', 'http://', $data );

			return $data;

		}

		static public function siteurl($data) {

			// $data = str_replace( 'https://', 'http://', $data );

			return $data;

		}

		/**
		 *
		 * If upload_url_path is set it will be used as a Base URL for all uploads. e.g. https://storage.googleapis.com/media.discodonniepresents.com
		 *
		 * Make sure Stateless Media is set to CDN Mode if using storage.googleapis.com/media.discodonniepresents.com
		 *
		 * @param $data
		 * @return mixed
		 */
		static public function upload_dir($data) {
			global $current_blog;
			//return "storage/" . $current_blog->domain . "/media" ;

			$data[ 'baseurl' ] = str_replace( '/files', '/media', $data[ 'baseurl' ] );
			$data[ 'url' ] = str_replace( '/files', '/media', $data[ 'url' ] );
			$data[ 'basedir' ] = str_replace( 'blogs.dir/' . $current_blog->blog_id . '/files', 'storage/' . $current_blog->domain . '/media', $data[ 'basedir' ] );
			$data[ 'path' ] = str_replace( 'blogs.dir/' . $current_blog->blog_id . '/files', 'storage/' . $current_blog->domain . '/media', $data[ 'path' ] );

			if( $upload_url_path = get_option( 'upload_url_path' ) ) {
				$data[ 'baseurl' ] = $upload_url_path;
				$data[ 'url' ] = $data[ 'baseurl' ] . $data[ 'subdir' ];
			}

			return $data;

		}

		/**
		 * @param array $_plugins
		 *
		 * @return array
		 */
		static function sitewide_plugins( $_plugins = array() ) {
			global $current_blog;

			// return $_plugins;
			// $_plugins = false;

			$_plugins = array_merge( (array) $_plugins, array(
				//"wp-stateless-media/wp-stateless-media.php" => time(),
				"wpmandrill/wpmandrill.php" => time(),
				"simple-page-ordering/simple-page-ordering.php" => time(),
				"widget-css-classes/widget-css-classes.php"  => time(),
				"wp-options-definitely/options-definitely.php" => time(),
				"public-post-preview/public-post-preview.php" => time(),
				"wp-github-updater/github-updater.php" => time(),
				"wp-cluster/wp-cluster.php" => time(),
				"wp-simplify/wp-simplify.php" => time(),
				"wp-network/wp-network.php" => time(),
				"wp-pagespeed/wp-pagespeed.php" => time(),
				"wp-vertical-edm/vertical-edm.php" => time(),
				"gravityforms/gravityforms.php" => time(),
				"debug-bar/debug-bar.php" => time(),
				"debug-bar-slow-actions/debug-bar-slow-actions.php"  => time()
			));

			unset( $_plugins['wp-veneer/wp-veneer.php'] );

			if( $current_blog->domain == 'mobile.discodonniepresents.com' ) {
				unset( $_plugins[ 'jetpack/jetpack.php' ] );
				unset( $_plugins[ 'widget-css-classes/widget-css-classes.php' ] );
				unset( $_plugins[ 'google-analytics-for-wordpress/googleanalytics.php' ] );
				unset( $_plugins[ 'wordpress-seo/wp-seo.php' ] );
			}

			return $_plugins;

		}

		/**
		 * Verify Theme is Valid
		 *
		 * @param null $default
		 *
		 * @return string
		 */
		static function theme_selection( $default = null ) {

			// $default = str_replace( array( 'wp-splash', 'wp-disco-v1.0' ), array( 'wp-splash-v1.0', 'wp-disco-v2.0' ), $default );

			if( $default === 'flawless' ) {
				return 'wp-disco-v2.0';
			}

			return $default;

		}

		/**
		 * Applied as a stanard option filter, so there may be a default.
		 *
		 * - URL without a trailing slash.
		 *
		 * @param null $upload_url_path
		 *
		 * @return null|string
		 */
		static function upload_url_path( $upload_url_path = null ) {

			if( !$upload_url_path ) {
				$upload_url_path  = get_option( 'home' ) . '/media';
			}

			return $upload_url_path;

		}

		/**
		 * Automatically Set for Network.
		 *
		 * @param array $setting
		 *
		 * @return array
		 */
		static function allowedthemes( $setting = array() ) {

			$setting = array_merge( $setting, array(
				"wp-braxton" => true,
				"wp-bassoddysey" => true,
				"wp-monsterblockparty" => true,
				// "wp-freaksbeatstreats" => true,
				// "wp-hififest" => true,
				"wp-spectacle-chmf" => true,
				"wp-festival-smf" => true,
				"wp-spectacle-fbt" => true,
				"wp-spectacle-isladelsol" => true,
				"wp-spectacle-mbp" => true,
				"wp-dayafter" => true,
				//"wp-thegift" => true,
				//"wp-winterfantasy" => true,
				//"wp-kboom" => true,
				"wp-disco-v1.0" => true,
				"wp-disco-v2.0" => true,
				"wp-spectacle-v1.0" => true,
				"wp-spectacle-v2.0" => true,
				"wp-splash-v1.0" => true,
				"wp-splash-v2.0" => true
			));

			// Fix legacy.
			unset( $setting[ 'flawless' ] );

			// return die( '<pre>' . print_r( $setting, true ) . '</pre>');

			return $setting;

		}

	}

	class Override {

		/**
		 * For now all themese are in same directory, relative to wp-content
		 * @return string
		 */
		static public function theme_root() {
			return '/themes';
		}

		/**
		 * Can Not be configured like upload_url_path so we fix it here.
		 *
		 * @param $settings
		 *
		 * @return string
		 */
		static public function upload_path( $settings ) {
			global $current_blog;
			return "storage/" . $current_blog->domain . "/media" ;
		}

		/**
		 * Override Lodded Plugins' Settings
		 *
		 */
		static public function plugins_loaded() {
			global $wp_veneer, $wp_cluster, $wp_pagespeed;

			if ( class_exists( 'wpCloud\Vertical\EDM\Bootstrap' ) ) {
				Vertical\EDM\Bootstrap::set( 'toolbar.remove.comments', true );
				Vertical\EDM\Bootstrap::set( 'toolbar.remove.seo', true );
				Vertical\EDM\Bootstrap::set( 'toolbar.remove.wp', true );
			}

			if ( isset( $wp_pagespeed ) && method_exists( $wp_pagespeed, 'set' ) ) {
				$wp_pagespeed->set( 'core.enabled', true );
				$wp_pagespeed->set( 'minify.enabled', false );
			}

			if ( isset( $wp_cluster ) && method_exists( $wp_cluster, 'set' ) ) {
				$wp_cluster->set( 'toolbar.git.enabled', true );
				$wp_cluster->set( 'toolbar.remove.wp', true );
			}

			if ( isset( $wp_veneer ) && method_exists( $wp_veneer, 'set' ) ) {
				$wp_veneer->set( 'varnish.enabled', true );
				$wp_veneer->set( 'api.enabled', true );
				$wp_veneer->set( 'logs.enabled', false );
				$wp_veneer->set( 'rewrites.enabled', true );
				$wp_veneer->set( 'rewrites.login', false );
				$wp_veneer->set( 'rewrites.manage', false );
				$wp_veneer->set( 'rewrites.api', false );
				$wp_veneer->set( 'static.enabled', false );
				$wp_veneer->set( 'cdn.enabled', false );
				$wp_veneer->set( 'cache.enabled', false );
				$wp_veneer->set( 'media.shard.enabled', false );
				$wp_veneer->set( 'assets.shard.enabled', false );
				$wp_veneer->set( 'scripts.shard.enabled', false );
				$wp_veneer->set( 'styles.shard.enabled', false );
			}

		}

		/**
		 * Configure ElaticSearch
		 *
		 * @todo Fetch types, taxonomies and fields based on post types available on site.
		 *
		 * @return array
		 */
		static public function elasticsearch() {

			$_serviceUrl = get_option( 'app:api:url' );
			$_secretKey = get_option( 'app:api:secret' );
			$_serviceIndex = get_option( 'app:api:index' );

			if( !$_secretKey || !$_serviceIndex ) {
				return false;
			}

			$_types = array(
				"post" => 1,
				"page" => 1,
				"promoter" => 1,
				"tour" => 1,
				"videoobject" => 1,
				"event" => 1,
				"venue" => 1,
				"artist" => 1,
				"credit" => 1,
				"imagegallery" => 1
			);

			$_taxonomies = array(
				"category" => 1,
				"post_tag" => 1,
				"post_format" => 1
			);

			$_fields = array(
				"post_content" => 1,
				"post_title" => 1
			);

			$_setting = array(
				"last_tab" => "index",
				"server_url" => str_replace( 'http://', '' . $_secretKey . '@', $_serviceUrl ),
				"server_index" => "",
				"server_timeout_read" => "",
				"server_timeout_write" => "",
				"fields" => $_fields,
				"types" => $_types,
				"taxonomies" => $_taxonomies,
				"fuzzy" => '',
				"score_field_post_content" => 1,
				"score_field_post_title" => '',
				"score_field_post_date" => '',
				"score_tax_category" => '',
				"score_tax_post_tag" => '',
				"score_tax_post_format" => ''
			);

			// die( '<pre>' . print_r( $_setting, true ) . '</pre>');

			return $_setting;

		}

		static public function illegal_names() {
			return array( "media", "cdn" );
		}

		static public function app_api_url() {
			return 'http://' . ( defined( 'WP_ELASTIC_SERVICE_URL' ) ? WP_ELASTIC_SERVICE_URL : null );
		}

		static public function app_api_key() {
			return defined( 'WP_ELASTIC_PUBLIC_KEY' ) ? WP_ELASTIC_PUBLIC_KEY : null;
		}

		static public function app_api_secret() {
			return defined( 'WP_ELASTIC_SECRET_KEY' ) ? WP_ELASTIC_SECRET_KEY : null;
		}

		static public function app_api_index() {
			return defined( 'WP_ELASTIC_SERVICE_INDEX' ) ? WP_ELASTIC_SERVICE_INDEX : null;
		}

	}

	/**
	 *
	 * http://suncitymusicfestival.com/api/site/v1/meta.json
	 * http://discodonniepresents.com/api/site/v1/meta.json
	 * http://discodonniepresents.com/wp-admin/admin-ajax.php?action=/site/v1/meta
	 *
	 */
	function api_site() {

		if( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
		}

		wp_send_json( array(
			"home" => get_option( 'home' ),
			"siteurl" => get_option( 'siteurl' ),
			"network.url" => get_site_option( 'siteurl' ),
			"app:api:url" => get_option( 'app:api:url' ),
			"app:api:index" => get_option( 'app:api:index' ),
			"app:api:key" => get_option( 'app:api:key' ),
			"app:api:secret" => get_option( 'app:api:secret' ),
			"current_theme" => get_option( 'current_theme' ),
			"stylesheet" => get_option( 'stylesheet' ),
			"stylesheet_root" => get_option( 'stylesheet_root' ),
			"template_root" => get_option( 'template_root' ),
			"template" => get_option( 'template' ),
			"theme_roots" => get_site_transient( 'theme_roots' ),
			"active_plugins" => get_option( 'active_plugins' ),
			"site_admins" => get_site_option( 'site_admins' ),
			"illegal_names" => get_site_option( 'illegal_names' ),
			"active_sitewide_plugins" => get_site_option( 'active_sitewide_plugins' ),
			"can_compress_scripts" => get_site_option( 'can_compress_scripts' ),
			"ms_files_rewriting" => get_site_option( 'ms_files_rewriting' ),
			"theme_switched" => get_option( 'theme_switched' ),
			"blog_public" => get_option( 'blog_public' ),
			"recently_edited" => get_option( 'recently_edited' ),
			"upload" => wp_upload_dir(),
			"upload_path" => get_option( 'upload_path' ),
			"upload_url_path" => get_option( 'upload_url_path' ),
			"allowedthemes" => get_option( 'allowedthemes' ),
			// "update_plugins"                => get_site_transient( 'update_plugins' ),
			// "update_themes"                 => get_site_transient( 'update_themes' ),
			// "update_core"                   => get_site_transient( 'update_core' ),
			// "uploads_use_yearmonth_folders" => get_option( 'uploads_use_yearmonth_folders' ),
			// "subdomain_install"             => get_site_option( 'subdomain_install' ),
			// "global_terms_enabled"          => get_site_option( 'global_terms_enabled' ),
			// "thumbnail_crop"                => get_option( 'thumbnail_crop' ),
			// "thumbnail_size_w"              => get_option( 'thumbnail_size_w' ),
			// "thumbnail_size_h"              => get_option( 'thumbnail_size_h' ),
			// "medium_size_w"                 => get_option( 'medium_size_w' ),
			// "medium_size_h"                 => get_option( 'medium_size_h' ),
			// "large_size_w"                  => get_option( 'large_size_w' ),
			// "large_size_h"                  => get_option( 'large_size_h' ),
		) );

	}


	/**
	 * @param $old_value
	 * @param $value
	 */
	function site_changed( $old_value, $value = null ) {

	}

	/**
	 * Adjust FantasticElastic UI
	 *
	 */
	add_filter( 'elasticsearch_nhp_options_args_setup', function( $args ) {

		// wp_enqueue_script('es-indexing', plugins_url( '/manage-index.js', __FILE__ ), array('jquery'));
		// Breaks manage-index.js from loading...

		// $args['page_type'] = 'submenu';
		// $args['page_parent'] = 'tools.php';

		return $args;
	} );

}
