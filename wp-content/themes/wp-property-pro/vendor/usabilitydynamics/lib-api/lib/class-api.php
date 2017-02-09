<?php
/**
 * API Library
 *
 * @author team@UD
 * @version 0.1.1
 * @module UsabilityDynamics
 */
namespace UsabilityDynamics {

  /**
   * API Library
   *
   * @module UsabilityDynamics
   * @author team@UD
   *
   * @version 0.1.2
   *
   * @class API
   * @extends Utility
   */
  class API {

    /**
     * API Class version.
     *
     * @public
     * @static
     * @property $version
     * @type {Object}
     */
    public static $version = '0.5.0';

    /**
     * Flag
     * @var bool
     */
    public static $xml_rpc_done = false;

    /**
     * API Namespace
     *
     * @public
     * @static
     * @property $namespace
     * @type {String}
     */
    public static $namespace = null;

    /**
     * API Routes
     *
     * @public
     * @static
     * @property $_actions
     * @type {Array}
     */
    public static $_actions = Array();

    /**
     * Define API Endpoints.
     *
     *    Veneer\API::define( '/merchant-feed/google', array( 'CDO\Application\API\MerchantFeed', 'compute' ) )
     *
     * @param       $path
     * @param null  $handler
     * @param array $args
     *
     * @return array|void
     */
    public static function define( $path, $handler = null, $args = array() ) {

      if( $handler && is_array( $handler ) && !$args ) {
        $_args = $handler;
      } else {
        $_args = $args;
      }

      if( did_action( 'xmlrpc_methods' ) ) {
        _doing_it_wrong( 'UsabilityDynamics\Veneer\API::define', __( 'Called too late - xmlrpc_methods action alrady processed..' ), null );

        return false;
      }

      // Apply Defaults.
      $_args = Utility::parse_args( $_args, array(
        'path'       => $path,
        'method'     => 'GET',
        'version'    => 1.0,
        'handler'    => $handler,
        'namespace'  => self::$namespace,
        'priority'   => 20,
        'scopes'     => array(),
        'parameters' => array()
      ) );

      // Verify Handler is Callable.
      if( !is_callable( $_args->handler ) ) {
        _doing_it_wrong( 'UsabilityDynamics\Veneer\API::define', __( 'Handler not callable.' ), null );

        return false;
      }

      // Create Action.
      $_action = self::$_actions[ ] = (object) array(
        'id'         => isset( $_args->id ) ? $_args->id : self::get_id( $path, $_args ),
        'path'       => self::get_path( $path, $_args ),
        'version'    => self::parse_version( $_args->version, $_args ),
        'handler'    => self::get_handler( $_args->handler, $_args ),
        'namespace'  => isset( $_args->namespace ) ? $_args->namespace : null,
        'method'     => $_args->method,
        'parameters' => $_args->parameters,
        'scopes'     => $_args->scopes,
        'url'        => self::get_url( $path, $_args ),
        'meta'       => $_args->scopes ? $_args->scopes : array()
      );

      // Bind Actions.
      add_action( 'wp_ajax_' . self::get_path( $path, $_args ), $_args->handler, $_args->priority );
      add_action( 'wp_ajax_nopriv_' . self::get_path( $path, $_args ), $_args->handler, $_args->priority );
      add_action( 'xmlrpc_methods', array( 'UsabilityDynamics\API', 'xmlrpc_methods' ), $_args->priority );

      return $_action;

    }

    /**
     * XML RPC Methods Filter.
     *
     * @filter xmlrpc_methods
     *
     * @param array $methods
     *
     * @return array
     */
    public static function xmlrpc_methods( $methods = array() ) {

      // Do nothing if this has already been ran.
      if( API::$xml_rpc_done ) {
        die( 'already ran' );

        return $methods;
      }

      // Add Each Action.
      foreach( (array) API::$_actions as $action ) {
        $methods[ $action->id ] = 'UsabilityDynamics\API::rpc_handler';
      }

      // Set Flag.
      API::$xml_rpc_done = true;

      // Return method array.
      return $methods;

    }

    /**
     * List Routes
     *
     * @param array $args
     *
     * @return array
     */
    public static function routes( $args = array() ) {

      // Filter.
      $args = (object) Utility::extend( array(), $args );

      $_actions = array();

      foreach( (array) API::$_actions as $action ) {

        $_actions[ ] = apply_filters( 'usabilitydynamics::api::get_route', array(
          'id'      => $action->id,
          'path'    => $action->path,
          'version' => $action->version,
          'path'    => $action->path,
          'method'  => $action->method
        ), $args );;

      }

      return $_actions;

    }

    /**
     * Default Response Handler.
     *
     */
    public static function default_handler() {
      self::send( new \WP_Error( "API endpoint does not have a handler." ) );
    }

    /**
     * Send Response
     *
     * @todo Add content-type detection for XML response handling.
     *
     * @param       $data
     * @param array $headers
     *
     * @return bool
     */
    public static function send( $data, $headers = array() ) {

      $format = isset( $_REQUEST[ 'format' ] ) ? $_REQUEST[ 'format' ] : 'json';

      nocache_headers();

      // Remove any notices or other output that could break JSON.
      if( ob_get_length() ) {
        ob_end_clean();
      };

      ob_start();

      if( is_string( $data ) ) {
        echo( $data );
      }

      // Error Response.
      if( is_wp_error( $data ) ) {
        $response = array( "ok"    => false, "error" => $data );
      }

      // Standard Object Response.
      if( ( is_object( $data ) || is_array( $data ) ) && !is_wp_error( $data ) ) {

        $data = (object) $data;

        if( !isset( $data->ok ) ) {
          $data = (object) ( array( 'ok' => true ) + (array) $data );
        }

        $response = $data;

      }

      if( $format === 'json' )  {
        $output = self::prepare_json( $response, $headers );
      } elseif( $format === 'xml' )  {
        $output = self::prepare_xml( $response, $headers );
      } else {
        $output = $response;
      }

      ob_end_clean();

      die( $output );

      return true;

    }

    /**
     * @param       $data
     * @param array $headers
     *
     * @return mixed|string|void
     */
    public static function prepare_json( $data, $headers = array() ) {
      header( 'Content-Type:application/json' );
      return json_encode( $data );
    }

    /**
     * Array to XML
     *
     * @todo Avoid double-nesting of root object - e.g. (http://screencast.com/t/3EJwkyAR)
     * @todo Add better handling of arrays.
     *
     *  * Function returns XML string for input associative array.
     *  * @param Array $array Input associative array
     *  * @param String $wrap Wrapping tag
     *  * @param Boolean $upper To set tags in uppercase
     *  *
     *
     * @return string
     */
    public static function array_to_xml( $array = array(), $wrap = 'ROW0', $upper = true ) {

      $xml = '';

      if( $wrap != null ) {
        $xml .= "<$wrap>\n";
      }

      foreach( (array) $array as $key => $value ) {

        if( $upper == true ) {
          $key = strtoupper( $key );
        }

        // @note This is a hack to make array items validate.
        if( is_numeric( $key ) ) {
          $key = '_' . $key;
        }

        if( is_object( $value ) ) {
          // $xml .= self::array_to_xml( (array) $value, $key, $upper );
        }

        if( is_array( $value ) ) {
          $xml .= self::array_to_xml( (array) $value, $key, $upper );
        }

        if( is_string( $value ) ) {
          $xml .= "<$key>" . htmlspecialchars( trim( $value ) ) . "</$key>";
        }

        if( is_numeric( $value ) ) {
          $xml .= "<$key>" .  $value . "</$key>";
        }

      }

      if( $wrap != null ) {
        $xml .= "\n</$wrap>\n";
      }

      return $xml;

    }

    /**
     * Prepare XML Output
     *
     * @todo Migrate into Utility class.
     *
     * @param       $data
     * @param array $headers
     *
     * @return string
     */
    public static function prepare_xml( $data, $headers = array() ) {
      header( "Content-Type:text/xml" );
      return self::array_to_xml( $data, 'data', false );

    }

    /**
     * @param null  $path
     * @param array $args
     *
     * @internal param array $action
     * @return mixed|void
     */
    public static function get_id( $path = null, $args = null ) {
      $args = (object) $args;
      return apply_filters( 'usabilitydynamics::api::get_id', ltrim( str_replace( '/', '.', $path ), '.' ), $args );

    }

    /**
     * Get URL to REST Action.
     *
     * @param $path
     * @param $args
     *
     * @return mixed|void
     */
    public static function get_url( $path = null, $args = null ) {
      $args = (object) isset( $args ) ? $args : array();

      return apply_filters( 'usabilitydynamics::api::get_url', add_query_arg( array( 'action' => self::get_path( $path, $args ) ), admin_url( 'admin-ajax.php' ) ) );
    }

    /**
     * @param $path
     * @param $args
     *
     * @return mixed|void
     */
    public static function get_path( $path, $args = null ) {

      $args = (object) $args;

      return apply_filters( 'usabilitydynamics::api::get_path', str_replace( '//', '/', ( '/' . ( $args->namespace ? $args->namespace . '/' : '' ) . $path ), $args ) );

    }

    /**
     * Wrapper for XML-RPC Methods.
     *
     */
    public static function rpc_handler() {
      die( '<pre>rpc_handler:' . print_r( func_get_args(), true ) . '</pre>' );
    }

    /**
     * Get Callback Handler.
     *
     * @param      $handler
     * @param null $args
     *
     * @return mixed
     */
    public static function get_handler( $handler, $args = null ) {

      $args = (object) $args;

      return $handler;
    }

    /**
     * Parse Route Verison.
     *
     * @param      $version
     * @param null $args
     *
     * @return mixed|void
     */
    public static function parse_version( $version, $args = null ) {
      $args = (object) $args;

      return apply_filters( 'usabilitydynamics::api::version', $version );

    }

  }

}
