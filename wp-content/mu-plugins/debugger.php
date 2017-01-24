<?php
/**
 * Plugin Name: Chrome WordPress Debug
 * Plugin URI: http://usabilitydynamics.com/plugins/
 * Description: Output to console API action timers.
 * Author: Usability Dynamics, Inc.
 * Version: 0.1.0
 * Author URI: http://usabilitydynamics.com
 *
 */


// Debug display turned off, do nothing.
if( defined( 'WP_DEBUG_DISPLAY' ) && !WP_DEBUG_DISPLAY ) {
  return;
}

// REST Request, do nothing.
if( ( defined( 'REST_REQUEST' ) && REST_REQUEST ) || ( isset( $_SERVER['REQUEST_URI'] ) && strpos( $_SERVER['REQUEST_URI'], rest_get_url_prefix() ) === 1 ) ) {
  return;
}

if( defined( 'DOING_AJAX' ) || !class_exists( 'UD_ChromePhp' ) ) {
  return;
}

ob_start(function( $data ) { return $data; });

add_action( 'muplugins_loaded',   function () { UD_ChromePhp::log(  timer_stop(), 'muplugins_loaded', 10 ); } );
add_action( 'init',               function () { UD_ChromePhp::log(  timer_stop(), 'init', 5 ); }, 5 );
add_action( 'init',               function () { UD_ChromePhp::log(  timer_stop(), 'init', 10 ); }, 10 );
add_action( 'init',               function () { UD_ChromePhp::log(  timer_stop(), 'init', 20 ); }, 20 );
add_action( 'in_print_scripts',   function () { UD_ChromePhp::log(  timer_stop(), 'in_print_scripts', 10 ); } );
add_action( 'plugins_loaded',     function () { UD_ChromePhp::log(  timer_stop(), 'plugins_loaded', 10 ); } );
add_action( 'after_setup_theme',  function () { UD_ChromePhp::log(  timer_stop(), 'after_setup_theme', 10 ); } );
add_action( 'the_post',           function () { UD_ChromePhp::log(  timer_stop(), 'the_post', 10 ); } );
add_action( 'get_footer',         function () { UD_ChromePhp::log(  timer_stop(), 'get_footer', 10 ); } );
add_action( 'wp_footer',          function () { UD_ChromePhp::log(  timer_stop(), 'wp_footer', 10 ); } );
add_action( 'admin_notices',      function () { UD_ChromePhp::log(  timer_stop(), 'admin_notices', 10 ); } );
add_action( 'admin_init',         function () {UD_ChromePhp::log(  timer_stop(), 'admin_init', 10 );} );
add_action( 'wp_loaded',          function () {UD_ChromePhp::log(  timer_stop(), 'wp_loaded', 10 );} );
add_action( 'current_screen',     function () {UD_ChromePhp::log(  timer_stop(), 'current_screen', 10 );} );
add_action( 'admin_footer',       function () {UD_ChromePhp::log(  timer_stop(), 'admin_footer', 10 );} );
add_action( 'send_headers',       function () {UD_ChromePhp::log(  timer_stop(), 'send_headers', 10 );} );
add_action( 'wp_print_scripts',   function () {UD_ChromePhp::log(  timer_stop(), 'wp_print_scripts', 10 );} );
add_action( 'wp_head',            function () {UD_ChromePhp::log(  timer_stop(), 'wp_head', 10 );} );
add_action( 'template_redirect',  function () {UD_ChromePhp::log(  timer_stop(), 'template_redirect', 10 );} );
add_action( 'rest_api_init',      function () {UD_ChromePhp::log(  timer_stop(), 'rest_api_init', 10 );} );
add_action( 'parse_request',      function () {UD_ChromePhp::log(  timer_stop(), 'parse_request', 10 );} );
add_action( 'parse_query',        function () {UD_ChromePhp::log(  timer_stop(), 'parse_query', 10 );} );
add_action( 'shutdown',           function () {UD_ChromePhp::log(  timer_stop(), 'shutdown', 10 );} );
add_action( 'wp',                 function () {UD_ChromePhp::log(  timer_stop(), 'wp', 10 );} );


add_action( 'wpp_init',           function () {UD_ChromePhp::log(  timer_stop(), 'wpp_init', 10 );} );
add_action( 'wpp_post_init',      function () {UD_ChromePhp::log(  timer_stop(), 'wpp_post_init', 10 );} );


/**
 * Server Side Chrome PHP debugger class
 *
 * @package UD_ChromePhp
 * @author Craig Campbell <iamcraigcampbell@gmail.com>
 */
class UD_ChromePhp {
  /**
   * @var string
   */
  const VERSION = '4.1.0';

  /**
   * @var string
   */
  const HEADER_NAME = 'X-ChromeLogger-Data';

  /**
   * @var string
   */
  const BACKTRACE_LEVEL = 'backtrace_level';

  /**
   * @var string
   */
  const LOG = 'log';

  /**
   * @var string
   */
  const WARN = 'warn';

  /**
   * @var string
   */
  const ERROR = 'error';

  /**
   * @var string
   */
  const GROUP = 'group';

  /**
   * @var string
   */
  const INFO = 'info';

  /**
   * @var string
   */
  const GROUP_END = 'groupEnd';

  /**
   * @var string
   */
  const GROUP_COLLAPSED = 'groupCollapsed';

  /**
   * @var string
   */
  const TABLE = 'table';

  /**
   * @var string
   */
  protected $_php_version;

  /**
   * @var int
   */
  protected $_timestamp;

  /**
   * @var array
   */
  protected $_json = array(
    'version' => self::VERSION,
    'columns' => array( 'log', 'backtrace', 'type' ),
    'rows' => array()
  );

  /**
   * @var array
   */
  protected $_backtraces = array();

  /**
   * @var bool
   */
  protected $_error_triggered = false;

  /**
   * @var array
   */
  protected $_settings = array(
    self::BACKTRACE_LEVEL => 1
  );

  /**
   * @var UD_ChromePhp
   */
  protected static $_instance;

  /**
   * Prevent recursion when working with objects referring to each other
   *
   * @var array
   */
  private $_processed = array();

  /**
   * constructor
   */
  private function __construct() {
    $this->_php_version = phpversion();
    $this->_timestamp = $this->_php_version >= 5.1 ? $_SERVER[ 'REQUEST_TIME' ] : time();
    $this->_json[ 'request_uri' ] = $_SERVER[ 'REQUEST_URI' ];
  }

  /**
   * gets instance of this class
   *
   * @return UD_ChromePhp
   */
  public static function getInstance() {
    if( self::$_instance === null ) {
      self::$_instance = new self();
    }
    return self::$_instance;
  }

  /**
   * logs a variable to the console
   *
   * @param mixed $data,... unlimited OPTIONAL number of additional logs [...]
   * @return void
   */
  public static function log() {
    $args = func_get_args();
    return self::_log( '', $args );
  }

  /**
   * logs a warning to the console
   *
   * @param mixed $data,... unlimited OPTIONAL number of additional logs [...]
   * @return void
   */
  public static function warn() {
    $args = func_get_args();
    return self::_log( self::WARN, $args );
  }

  /**
   * logs an error to the console
   *
   * @param mixed $data,... unlimited OPTIONAL number of additional logs [...]
   * @return void
   */
  public static function error() {
    $args = func_get_args();
    return self::_log( self::ERROR, $args );
  }

  /**
   * sends a group log
   *
   * @param string value
   */
  public static function group() {
    $args = func_get_args();
    return self::_log( self::GROUP, $args );
  }

  /**
   * sends an info log
   *
   * @param mixed $data,... unlimited OPTIONAL number of additional logs [...]
   * @return void
   */
  public static function info() {
    $args = func_get_args();
    return self::_log( self::INFO, $args );
  }

  /**
   * sends a collapsed group log
   *
   * @param string value
   */
  public static function groupCollapsed() {
    $args = func_get_args();
    return self::_log( self::GROUP_COLLAPSED, $args );
  }

  /**
   * ends a group log
   *
   * @param string value
   */
  public static function groupEnd() {
    $args = func_get_args();
    return self::_log( self::GROUP_END, $args );
  }

  /**
   * sends a table log
   *
   * @param string value
   */
  public static function table() {
    $args = func_get_args();
    return self::_log( self::TABLE, $args );
  }

  /**
   * internal logging call
   *
   * @param string $type
   * @return void
   */
  protected static function _log( $type, array $args ) {
    // nothing passed in, don't do anything
    if( count( $args ) == 0 && $type != self::GROUP_END ) {
      return;
    }

    $logger = self::getInstance();

    $logger->_processed = array();

    $logs = array();
    foreach( $args as $arg ) {
      $logs[] = $logger->_convert( $arg );
    }

    $backtrace = debug_backtrace( false );
    $level = $logger->getSetting( self::BACKTRACE_LEVEL );

    $backtrace_message = 'unknown';
    if( isset( $backtrace[ $level ][ 'file' ] ) && isset( $backtrace[ $level ][ 'line' ] ) ) {
      $backtrace_message = $backtrace[ $level ][ 'file' ] . ' : ' . $backtrace[ $level ][ 'line' ];
    }

    $logger->_addRow( $logs, $backtrace_message, $type );
  }

  /**
   * converts an object to a better format for logging
   *
   * @param Object
   * @return array
   */
  protected function _convert( $object ) {
    // if this isn't an object then just return it
    if( !is_object( $object ) ) {
      return $object;
    }

    //Mark this object as processed so we don't convert it twice and it
    //Also avoid recursion when objects refer to each other
    $this->_processed[] = $object;

    $object_as_array = array();

    // first add the class name
    $object_as_array[ '___class_name' ] = get_class( $object );

    // loop through object vars
    $object_vars = get_object_vars( $object );
    foreach( $object_vars as $key => $value ) {

      // same instance as parent object
      if( $value === $object || in_array( $value, $this->_processed, true ) ) {
        $value = 'recursion - parent object [' . get_class( $value ) . ']';
      }
      $object_as_array[ $key ] = $this->_convert( $value );
    }

    $reflection = new ReflectionClass( $object );

    // loop through the properties and add those
    foreach( $reflection->getProperties() as $property ) {

      // if one of these properties was already added above then ignore it
      if( array_key_exists( $property->getName(), $object_vars ) ) {
        continue;
      }
      $type = $this->_getPropertyKey( $property );

      if( $this->_php_version >= 5.3 ) {
        $property->setAccessible( true );
      }

      try {
        $value = $property->getValue( $object );
      } catch ( ReflectionException $e ) {
        $value = 'only PHP 5.3 can access private/protected properties';
      }

      // same instance as parent object
      if( $value === $object || in_array( $value, $this->_processed, true ) ) {
        $value = 'recursion - parent object [' . get_class( $value ) . ']';
      }

      $object_as_array[ $type ] = $this->_convert( $value );
    }
    return $object_as_array;
  }

  /**
   * takes a reflection property and returns a nicely formatted key of the property name
   *
   * @param ReflectionProperty
   * @return string
   */
  protected function _getPropertyKey( ReflectionProperty $property ) {
    $static = $property->isStatic() ? ' static' : '';
    if( $property->isPublic() ) {
      return 'public' . $static . ' ' . $property->getName();
    }

    if( $property->isProtected() ) {
      return 'protected' . $static . ' ' . $property->getName();
    }

    if( $property->isPrivate() ) {
      return 'private' . $static . ' ' . $property->getName();
    }
  }

  /**
   * adds a value to the data array
   *
   * @var mixed
   * @return void
   */
  protected function _addRow( array $logs, $backtrace, $type ) {
    // if this is logged on the same line for example in a loop, set it to null to save space
    if( in_array( $backtrace, $this->_backtraces ) ) {
      $backtrace = null;
    }

    // for group, groupEnd, and groupCollapsed
    // take out the backtrace since it is not useful
    if( $type == self::GROUP || $type == self::GROUP_END || $type == self::GROUP_COLLAPSED ) {
      $backtrace = null;
    }

    if( $backtrace !== null ) {
      $this->_backtraces[] = $backtrace;
    }

    $row = array( $logs, $backtrace, $type );

    $this->_json[ 'rows' ][] = $row;
    $this->_writeHeader( $this->_json );
  }

  protected function _writeHeader( $data ) {
    if( !headers_sent() ) {
      header( self::HEADER_NAME . ': ' . $this->_encode( $data ) );
    }
  }

  /**
   * encodes the data to be sent along with the request
   *
   * @param array $data
   * @return string
   */
  protected function _encode( $data ) {
    return base64_encode( utf8_encode( json_encode( $data ) ) );
  }

  /**
   * adds a setting
   *
   * @param string key
   * @param mixed value
   * @return void
   */
  public function addSetting( $key, $value ) {
    $this->_settings[ $key ] = $value;
  }

  /**
   * add ability to set multiple settings in one call
   *
   * @param array $settings
   * @return void
   */
  public function addSettings( array $settings ) {
    foreach( $settings as $key => $value ) {
      $this->addSetting( $key, $value );
    }
  }

  /**
   * gets a setting
   *
   * @param string key
   * @return mixed
   */
  public function getSetting( $key ) {
    if( !isset( $this->_settings[ $key ] ) ) {
      return null;
    }
    return $this->_settings[ $key ];
  }
}