<?php
/**
 * Plugin Name: wpCloud: Persistence
 * Plugin URI: http://usabilitydynamics.com/plugins/
 * Description: Adds Pingdom XML API endpoint. http://www.usabilitydynamics.com/wp-admin/admin-ajax.php?action=/status/pingdom
 * Author: Usability Dynamics, Inc.
 * Version: 0.1.0
 * Author URI: http://usabilitydynamics.com
 *
 * - Sets a "wp-cloud-backend" cookie whenever login page is opened or whenever the authentication cookies are set.
 * - Cheks if the VARNISH_BACKEND server setting exists, and that it matches with requested backend stored in cookie, if not, show notice for admins.
 * - On logout the "wp-cloud-backend" cookie is cleared out.
 *
 */
namespace wpCloud {

  class Persistence {
    /**
     * Cluster core version.
     *
     * @static
     * @property $version
     * @type {Object}
     */
    public static $backend = null;

    public static function init() {

      if( isset( $_SERVER['HTTP_X_SELECTED_BACKEND'] ) && $_SERVER['HTTP_X_SELECTED_BACKEND'] ) {
        self::$backend = $_SERVER['HTTP_X_SELECTED_BACKEND'];
      }

      //die( '<pre>' . print_r( $_SERVER, true ) . '</pre>' );
      // if( isset( $_SERVER['HTTP_X_SET_BACKEND'] ) && $_SERVER['HTTP_X_SET_BACKEND'] ) {
        // self::$backend = $_SERVER['HTTP_X_SET_BACKEND'];
      // }

      if ( !defined( 'COOKIEHASH' ) )  {
        // die( 'no cookie');
      }

      if ( !defined( 'WP_CLOUD_BACKEND_COOKIE' ) )  {
        define( 'WP_CLOUD_BACKEND_COOKIE', 'wp-cloud-backend' );
      }

    }

    /**
     * Called after WP test cookie is set.
     */
    public static function login_init( ) {
      self::set_cookie();
    }

    public static function admin_init( ) {
      self::set_cookie();
    }

    /**
     *
     * @see wp_clear_auth_cookie()
     *
     */
    public static function clear_auth_cookie() {
      setcookie( WP_CLOUD_BACKEND_COOKIE, null, time() - YEAR_IN_SECONDS, COOKIEPATH,   COOKIE_DOMAIN );
      setcookie( WP_CLOUD_BACKEND_COOKIE, null, time() - YEAR_IN_SECONDS, SITECOOKIEPATH,   COOKIE_DOMAIN );
      setcookie( WP_CLOUD_BACKEND_COOKIE, null, time() - YEAR_IN_SECONDS, ADMIN_COOKIE_PATH,   COOKIE_DOMAIN );
      setcookie( WP_CLOUD_BACKEND_COOKIE, null, time() - YEAR_IN_SECONDS, PLUGINS_COOKIE_PATH,   COOKIE_DOMAIN );
    }

    /**
     * Due to the WP login redirection, we seem to lose the HTTP_X_SELECTED_BACKEND header at this action...
     *
     * @param $auth_cookie
     * @param $expire
     * @param $expiration
     * @param $user_id
     * @param $scheme
     */
    public static function set_auth_cookie( $auth_cookie, $expire, $expiration, $user_id, $scheme ) {
      self::set_cookie( $expire, $expiration, $user_id );
    }



    /**
     *
     * @todo Make sure this works with SSL.
     *
     * COOKIE_DOMAIN: discodonniepresents.com
     * SITECOOKIEPATH: /
     * COOKIEPATH: /
     *
     * @param bool $expire
     * @param bool $expiration
     * @param bool $user_id
     *
     */
    public static function set_cookie( $expire = false, $expiration = false, $user_id = false ) {

      // Prevent from removing a good cookie on certain internal requests that may clear-our the X-Varnish-Backend header.
      if( !self::$backend ) {
        return;
      }

      $secure = ( 'https' === parse_url( site_url(), PHP_URL_SCHEME ) && 'https' === parse_url( home_url(), PHP_URL_SCHEME ) );

      if( !$secure && is_ssl() ) {
        $secure = true;
      }

      // @note We're only setting the backend-persistence for login and wp-admin pages.
      setcookie( WP_CLOUD_BACKEND_COOKIE, self::$backend, 0, COOKIEPATH . 'wp-login.php', COOKIE_DOMAIN, $secure );
      setcookie( WP_CLOUD_BACKEND_COOKIE, self::$backend, 0, ADMIN_COOKIE_PATH, COOKIE_DOMAIN, $secure );

      // Set Site Path only if its different...
      if ( SITECOOKIEPATH != COOKIEPATH ) {
        setcookie( WP_CLOUD_BACKEND_COOKIE, self::$backend, 0, SITECOOKIEPATH . 'wp-login.php', COOKIE_DOMAIN, $secure );
      }

      // die( 'set'. self::$backend );

    }

  }


  // add_action( 'login_init', array( 'wpCloud\Persistence', 'login_init' ), 5 );
  // add_action( 'admin_init', array( 'wpCloud\Persistence', 'admin_init' ), 5 );
  // add_action( 'clear_auth_cookie', array( 'wpCloud\Persistence', 'clear_auth_cookie' ), 5 );

  // add_action( 'init', array( 'wpCloud\Persistence', 'init' ), 10 );

  // add_action( 'set_auth_cookie', array( 'wpCloud\Persistence', 'set_auth_cookie' ), 5, 5 );

}
