<?php
/**
 * Plugin Name: wpCloud.io Loader
 * Plugin URI: http://usabilitydynamics.com/
 * Description: wpCloud.io functionality.
 * Author: Usability Dynamics, Inc.
 * Version: 0.1.2
 * Author URI: http://usabilitydynamics.com
 *
 *
 * add "wp cloud" CLI commands.
 *
 *
 * HTTP_X_VARNISH
 * HTTP_X_WP_CONSTANTS
 * HTTP_X_OPTION_ACTIVETHEME
 * HTTP_X_SELECTED_BACKEND
 * HTTP_X_WP_ADVANCEDCACHE
 * HTTP_X_WP_OBJECTCACHE
 * HTTP_X_WP_DATABASE
 * HTTP_X_WP_CLUSTER
 * HTTP_X_USER_DEVICE
 *
 */
namespace wpCloud {

  // Can't always expect Apache to fix this.
  if( isset( $_SERVER[ 'HTTP_X_FORWARDED_PROTO' ] ) && $_SERVER[ 'HTTP_X_FORWARDED_PROTO' ] == 'https' && !isset( $_SERVER[ 'HTTPS' ] ) ) {
    $_SERVER[ 'HTTPS' ] = 'on';
  }

  // Seems to occur on Nginx.
  if( isset( $_SERVER[ 'HTTP_HOST' ] ) && $_SERVER[ 'HTTP_HOST' ] !== $_SERVER[ 'SERVER_NAME' ] && $_SERVER[ 'SERVER_NAME' ] === 'localhost')   {
    $_SERVER[ 'SERVER_NAME' ] = $_SERVER[ 'HTTP_HOST' ];
  }

  // @todo When errors happen but we don't want to show them on front-end, log it to wpcloud.io and reference it using the request ID ($_SERVER['UNIQUE_ID'])
  // ini_set( 'display_errors', 1 );
  // ini_set( 'log_errors', 1 );
  // error_reporting( E_CORE_ERROR | E_CORE_WARNING | E_COMPILE_ERROR | E_ERROR | E_WARNING | E_PARSE | E_USER_ERROR | E_USER_WARNING | E_RECOVERABLE_ERROR );

  // disabled until we refine it
  // set_error_handler('wpCloud\Special::myErrorHandler' );

  // Change default /var/www/wp-content/debug.log to /var/www/wp-logs/debug.log
  if( defined( 'WP_LOGS_DIR' ) ) {
    ini_set( 'error_log', rtrim( ABSPATH, '/' ) . '/' . ltrim( WP_LOGS_DIR, '/' ) );
  }

  // Theme Override.
  if( isset( $_SERVER[ 'HTTP_X_OPTION_ACTIVETHEME' ] ) ) {
    add_filter( 'pre_option_current_theme', function() { return $_SERVER[ 'HTTP_X_OPTION_ACTIVETHEME' ]; });
    add_filter( 'pre_option_stylesheet', function() { return $_SERVER[ 'HTTP_X_OPTION_ACTIVETHEME' ]; });
    add_filter( 'pre_option_template', function() { return $_SERVER[ 'HTTP_X_OPTION_ACTIVETHEME' ]; });
  }

  // Return 200 if varnish uptime probe. This solves the 301 issue. Could also be ran in sunrise earlier but sunrise isn't always enabled.
  if( isset( $_SERVER['HTTP_X_REQUEST_TYPE'] ) && $_SERVER['HTTP_X_REQUEST_TYPE'] === 'varnish-probe' ) {
    Endpoints::varnishResponse();
  }

  // common low-level endpoint.
  if( ( isset( $_SERVER['REDIRECT_URL'] ) && $_SERVER['REDIRECT_URL'] === '/api/cloud/v1/status' ) || ( isset( $_SERVER[ 'REQUEST_URI' ] ) && $_SERVER['REQUEST_URI'] === '/api/cloud/v1/status' ) ) {
    Endpoints::statusResponse();
  }

  add_action( 'init', 'wpCloud\Action::init', 20 );
  add_action( 'plugins_loaded', 'wpCloud\Action::plugins_loaded', 0 );
  add_action( 'admin_init', 'wpCloud\Action::admin_init', 20 );
  add_action( 'template_redirect', 'wpCloud\Action::template_redirect', 20 );

  add_filter( 'redirect_canonical', 'wpCloud\Filter::redirect_canonical' , 10, 2 );
  add_filter( 'option_active_plugins', 'wpCloud\Filter::active_plugins' );
  add_filter( 'site_option_active_sitewide_plugins', 'wpCloud\Filter::sitewide_plugins' );

  header( 'X-Enhanced-By:wpCloud.io' );

  ob_start( function ( $buffer ) {

    // @todo WIll be set to hidden later and then unhidden via our Chrome Plugin.
    // $buffer = str_replace( '</body>', '<div class="wp-cloud-banner" style="background:#222;display: block;position: absolute;top: 0;text-align: center;width: 100%;color: #ccc;opacity:0.6">Powered by wpCloud.io</div></body>', $buffer );
    $buffer = str_replace( '</body>', '<div class="wp-cloud-banner" style="display:none;">Provisioned by wpCloud.io</div></body>', $buffer );

    return $buffer;

  } );

  // register_shutdown_function();

  class Special {

    static public function myErrorHandler($errno, $errstr, $errfile, $errline){

      $errno = $errno & error_reporting();

      if(!defined('E_STRICT'))            define('E_STRICT', 2048);
      if(!defined('E_RECOVERABLE_ERROR')) define('E_RECOVERABLE_ERROR', 4096);

      if( $errno === 0 ) {
        return;
      }
      print "<pre>\n<b>";
      switch($errno){
        case E_ERROR:               print "Error";                  break;
        case E_WARNING:             print "Warning";                break;
        case E_PARSE:               print "Parse Error";            break;
        case E_NOTICE:              print "Notice";                 break;
        case E_CORE_ERROR:          print "Core Error";             break;
        case E_CORE_WARNING:        print "Core Warning";           break;
        case E_COMPILE_ERROR:       print "Compile Error";          break;
        case E_COMPILE_WARNING:     print "Compile Warning";        break;
        case E_USER_ERROR:          print "User Error";             break;
        case E_USER_WARNING:        print "User Warning";           break;
        case E_USER_NOTICE:         print "User Notice";            break;
        case E_STRICT:              print "Strict Notice";          break;
        case E_RECOVERABLE_ERROR:   print "Recoverable Error";      break;
        default:                    print "Unknown error ($errno)"; break;
      }

      $_report = (object) array(
        "uid" =>  strtolower( $_SERVER['UNIQUE_ID'] ),
        "time" => $_SERVER['REQUEST_TIME'],
        "ip" => $_SERVER['HTTP_X_FORWARDED_FOR'],
        "grace" => $_SERVER['HTTP_GRACE'],
        "server" => $_SERVER['SERVER_SOFTWARE'],
        "url" => $_SERVER['REDIRECT_URL'],
        "backend" => $_SERVER['HTTP_X_SELECTED_BACKEND'],
        "varnish" => $_SERVER['HTTP_X_VARNISH'],
        "error" => $lastError = error_get_last()
      );

      if (!empty($lastError) && $lastError['type'] == E_ERROR) {
        header('Status: 500 Internal Server Error');
        header('HTTP/1.0 500 Internal Server Error');
      }

      wp_die('We apologize, but looks like we have an error.<br />You may help resolve this by providing some feedback. <a href="https://api.wpcloud.io/application/v1/issue.json?_id=' . $_report->uid . '">View Details</a><pre>' . json_encode( $_report, JSON_PRETTY_PRINT ).  '</pre>');

    }


    /**
     *
     *
     * curl localhost -H "X-WP-Database:mysql://user:password@api.wpcloud.io/dbname"
     * curl localhost -H "X-WP-Database:mysql://user:password@api.wpcloud.io/asdfaf/www.asdfasdf.com?read=10&write=20"
     * curl localhost -H "X-WP-Database:mysql://user:password@api.wpcloud.io:11455/asdfaf/www.asdfasdf.com?read=10&write=20"
     *
     * @return array
     */
    public function parseHeaderUri() {
      global $wpdb;

      $_data = array();

      foreach( (array) $_parts = explode( ',', $_SERVER[ 'HTTP_X_WP_DATABASE' ] ) as $part ) {

        $_uri = parse_url( ltrim( $part ) );

        parse_str( $_uri[ 'query' ], $_uri[ 'options' ] );

        $_data[] =  array(
          'host' => isset( $_uri[ 'host' ] ) ? $_uri[ 'host' ] : null,
          'user' => isset( $_uri[ 'user' ] ) ? $_uri[ 'user' ] : null,
          'port' => isset( $_uri[ 'port' ] ) ? $_uri[ 'port' ] : 3306,
          'password' => isset( $_uri[ 'pass' ] ) ? $_uri[ 'pass' ] : null,
          'name' => isset( $_uri[ 'path' ] ) ? ltrim( $_uri[ 'path' ], '/' ) : null,
          'read' => isset( $_uri[ 'options' ][ 'read' ] ) ? $_uri[ 'options' ][ 'read' ] : 10,
          'write' => isset( $_uri[ 'options' ][ 'write' ] ) ? $_uri[ 'options' ][ 'write' ] : 10
        );

      }

      return $_data;

    }

  }

  class Action {

    public static function plugins_loaded() {
      // die( 'plugins_loaded:' . timer_stop() );

    }

    public static function init() {
      // die( current_filter() . ':' . timer_stop() );

      // die( 'init' );


      // header( 'Cache-Control:no-cache' );

    }

    public static function template_redirect() {

      // die( 'init' );


      // header( 'Cache-Control:no-cache' );

      // die( '<pre>' . print_r( $_SERVER, true ) . '</pre>' );


    }

    public static function admin_init() {

      // die( 'admin' );

    }

  }

  class Filter {

    public static function redirect_canonical( $redirect_url, $requested_url ) {
      // die( '$redirect_url:' . $redirect_url );
      return $redirect_url;

    }

    /**
     * Returned array must be relative to WP_PLUGIN_DIR and not network-activated.
     *
     * @param array $_plugins
     *
     * @return array
     */
    public static function active_plugins( $_plugins = array() ) {

      if( file_exists( WP_PLUGIN_DIR . '/wp-cloud-v1.0/wp-cloud.php' ) ) {
        $_plugins[] = 'wp-cloud-v1.0/wp-cloud.php';
      }

      if( file_exists( WP_PLUGIN_DIR . '/wp-stateless-media-v1.0/wp-stateless-media.php' ) ) {
        // $_plugins[] = 'wp-stateless-media-v1.0/wp-stateless-media.php';
      }

      // Disabled due to redirection errors.
      return array_unique( $_plugins );

    }

    /**
     * @param array $_plugins
     *
     * @return array
     */
    public static function sitewide_plugins( $_plugins = array() ) {

      if( file_exists( WP_PLUGIN_DIR . '/wp-cloud-v1.0/wp-cloud.php' ) && is_array( $_plugins ) ) {
        $_plugins[ 'wp-cloud-v1.0/wp-cloud.php' ] = time();
      }

      if( file_exists( WP_PLUGIN_DIR . '/wp-cloud-v1.0/wp-cloud-navbar.php' ) && is_array( $_plugins ) ) {
        $_plugins[ 'wp-cloud-v1.0/wp-cloud-navbar.php' ] = time();
      }

      if( file_exists( WP_PLUGIN_DIR . '/wp-stateless-media-v1.0/wp-stateless-media.php' ) ) {
        // $_plugins[ 'wp-stateless-media-v1.0/wp-stateless-media.php' ] = time();
      }

      return $_plugins;

    }

  }

  class Endpoints {

    /**
     * For Varnish uptime probe we respond right away with status.
     *
     *
     * curl 10.215.124.63:50110 -H "host:www.wpcloud.io" -H "X-Request-Type: varnish-probe"  -I
     *
     */
    public static function varnishResponse() {
      header("HTTP/1.0 200 OK", true);
      header( "X-Host:" . gethostname());
      header( "X-Machine:" . php_uname('n'));
      header( "X-Release:" . php_uname('r'));
      header( "X-Version:" . php_uname('v'));
      header( "X-Machine:" . php_uname('m'));
      header( 'Cache-Control:public,no-cache,no-store' );
      die('ok');
    }

    /**
     *
     * http://www.wpcloud.com/api/cloud/v1/status.json
     * http://www.financialsocialwork.com/api/cloud/v1/status.json
     *
     */
    public static function statusResponse() {

      header( 'Cache-Control:no-cache,no-store,private' );

      die(json_encode(array(
        "ok" => true,
        "time" => date('H:i:s'),
        "date" => date('d/m/Y'),
        "timezone" => date_default_timezone_get(),
        "https" => isset( $_SERVER[ 'HTTPS' ] ) &&  $_SERVER[ 'HTTPS' ] === 'on' ? true : false,
        "uid" => isset( $_SERVER[ 'UNIQUE_ID' ] ) ? $_SERVER[ 'UNIQUE_ID' ] : null,
        "phpSelf" => isset( $_SERVER[ 'PHP_SELF' ] ) ? $_SERVER[ 'PHP_SELF' ] : null,
        "visitorAddress" => isset( $_SERVER[ 'REMOTE_ADDR' ] ) ? $_SERVER[ 'REMOTE_ADDR' ] : null,
        "haveNewRelic" => extension_loaded('newrelic') && function_exists('newrelic_set_appname') ? true :false,
        "haveMemcached" => class_exists('Memcached') ? true :false,
      ), JSON_PRETTY_PRINT));

    }


  }

}

// changed wpc