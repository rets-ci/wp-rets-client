<?php
/**
 * API Routes
 *
 * @author team@UD
 * @version 0.1.1
 * @module UsabilityDynamics
 */
namespace UsabilityDynamics\API {

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
  class Routes {

    /**
     * API Class version.
     *
     * @public
     * @static
     * @property $version
     * @type {Object}
     */
    public static $version = '0.1.2';

    /**
     * Constructor for the UD API class.
     *
     * @author potanin@UD
     * @version 0.0.1
     * @method __construct
     *
     * @constructor
     * @for API
     *
     * @param array $options
     */
    public function __construct( $options = array() ) {
    }

    /**
     * Generates API routes
     *
     * @author potanin@UD
     */
    static function api_routes( $args = false ) {
      global $wp, $wpdb, $wp_properties;

      $_api_key = WPP_F::get_key( 'api_key' );

      if( !$_api_key || is_wp_error( $_api_key ) ) {
        return false;
      }

      $is_permalink = '' != get_option( 'permalink_structure' ) ? true : false;

      $wp_properties[ '_api_routes' ] = array(
        'path'      => $is_permalink ? "/{$_api_key}/resources" : "/index.php?wpp_api_key={$_api_key}&wpp_api_action=resources",
        'response'  => 'json',
        'resources' => array(),
      );

      $wp_properties[ '_api_routes' ][ 'resources' ] = apply_filters( 'wpp::api_routes', array(
        'wpp' => array(
          'description' => 'WP-Property Core',
          'apis'        => array(
            'feature_check'       => array(
              'path'        => "/{$_api_key}/wpp/feature_check",
              'description' => __( 'Check all features for updates against Updates server, and download all eligible..', 'wpp' ),
              'operations'  => array(
                'httpMethod' => 'GET',
                'summary'    => 'Run update.',
                'nickname'   => 'feature_check'
              ),
              '_method'     => array( 'WPP_F', 'feature_check' ),
            ),
            'server_capabilities' => array(
              'path'        => "/{$_api_key}/wpp/server_capabilities",
              'description' => __( 'Output server capabilities.', 'wpp' ),
              'operations'  => array(
                'httpMethod' => 'GET',
                'summary'    => 'View server capabilities.',
                'nickname'   => 'server_capabilities',
              ),
              '_method'     => array( 'WPP_F', 'get_server_capabilities' )
            ),
            'data_model'          => array(
              'path'        => "/{$_api_key}/wpp/data_model",
              'description' => __( 'Output Data Structure when API Key is set and matches.', 'wpp' ),
              'operations'  => array(
                'httpMethod' => 'GET',
                'summary'    => 'View standard data model.',
                'nickname'   => 'data_model',
                'parameters' => array(
                  array(
                    'name'            => 'model', 'paramType' => 'query', 'required' => true, 'description' => __( 'Model name, usually slug of listing type.', 'wpp' ),
                    'allowableValues' => array( 'valueType' => 'LIST', 'values' => array_keys( (array) $wp_properties[ 'property_types' ] ) ),
                  ),
                  array(
                    'name'            => 'push', 'paramType' => 'query', 'description' => __( 'To synchronize with Semantics API, set to true.', 'wpp' ),
                    'allowableValues' => array( 'valueType' => 'LIST', 'values' => array( 'true', '' ) ),
                  )
                )
              ),
              '_method'     => array( 'WPP_F', 'get_data_model' )
            ),
            'listings'            => array(
              'path'        => "/{$_api_key}/wpp/listings",
              'description' => __( 'Export listings in JSON or XML format using RESTful queries.', 'wpp' ),
              'operations'  => array(
                'httpMethod' => 'GET',
                'summary'    => __( 'Export listings in JSON or XML format using RESTful queries.', 'wpp' ),
                'nickname'   => 'get_listings',
                'parameters' => array(
                  array(
                    'name'            => 'property_type', 'paramType' => 'query', 'description' => __( 'Property Type to query.', 'wpp' ),
                    'allowableValues' => array( 'valueType' => 'LIST', 'values' => array_keys( (array) $wp_properties[ 'property_types' ] ) ),
                    'allowMultiple'   => true
                  ),
                  array(
                    'name'            => 'sort_by', 'paramType' => 'query', 'description' => __( 'Results sorted by specific attribute.', 'wpp' ),
                    'allowableValues' => array( 'valueType' => 'LIST', 'values' => array_keys( (array) $wp_properties[ 'sortable_attributes' ] ) )
                  ),
                  array(
                    'name'            => 'sort_order', 'paramType' => 'query', 'description' => __( 'Ascending (ASC ) and Descending ( DESC ) order.', 'wpp' ),
                    'allowableValues' => array( 'valueType' => 'LIST', 'values' => array( 'ASC', 'DESC' ) )
                  ),
                  array( 'name' => 'limit', 'paramType' => 'query', 'dataType' => 'int', 'description' => __( 'Limit exported listings to.', 'wpp' ) ),
                  array( 'name' => 'per_page', 'paramType' => 'query', 'dataType' => 'int', 'description' => __( 'To synchronize with Semantics API, set to true.', 'wpp' ) ),
                  array( 'name' => 'starting_row', 'dataType' => 'int', 'description' => __( 'To synchronize with Semantics API, set to true.', 'wpp' ), 'paramType' => 'query' ),
                  array( 'name' => 'format', 'paramType' => 'query', 'allowableValues' => array( 'valueType' => 'LIST', 'values' => array( 'JSON', 'XML' ) ), 'required' => true )
                )
              ),
              '_method'     => array( 'WPP_Export', 'wpp_export_properties' )
            ),
            'configuration'       => array(
              'path'        => "/{$_api_key}/wpp/configuration",
              'description' => __( 'Output Configuration Structure when API Key is set and matches.', 'wpp' ),
              'operations'  => array(
                'httpMethod' => 'GET',
                'nickname'   => 'get_configuration',
                'summary'    => 'View standard data model.',
              ),
              '_method'     => array( 'WPP_Config', 'get' )
            )
          )
        )
      ), $_api_key );

      //** Check API routes and fix|modify data and structure */
      foreach( $wp_properties[ '_api_routes' ][ 'resources' ] as $key => $instance ) {
        if( !isset( $instance[ 'apis' ] ) || !is_array( $instance[ 'apis' ] ) ) {
          unset( $wp_properties[ '_api_routes' ][ $key ] );
          continue;
        }
        if( $is_permalink ) {
          $wp_properties[ '_api_routes' ][ 'resources' ][ $key ][ 'path' ] = "/{$_api_key}/{$key}";
        } else {
          $wp_properties[ '_api_routes' ][ 'resources' ][ $key ][ 'path' ] = "/index.php?wpp_api_key={$_api_key}&wpp_api_action=resource_methods&wpp_api_resource={$key}";
        }
        foreach( $instance[ 'apis' ] as $route => $data ) {
          $data = self::set_api_route( $data );
          if( !$data ) {
            unset( $wp_properties[ '_api_routes' ][ 'resources' ][ $key ][ 'apis' ][ $route ] );
          } else {
            if( !$is_permalink ) {
              $data[ 'path' ] = "/index.php?wpp_api_key={$_api_key}&wpp_api_action=do_method&wpp_api_resource={$key}&wpp_api_method={$route}";
            }
            $wp_properties[ '_api_routes' ][ 'resources' ][ $key ][ 'apis' ][ $route ] = $data;
          }
        }
      }

      return $wp_properties[ '_api_routes' ];

    }

    /**
     * Adds rewrite rules for API methods.
     * Based on $wp_properties[ '_api_routes' ]
     *
     * @author potanin@UD
     * @author peshkov@UD
     */
    static function generate_rewrites() {
      global $wp, $wp_properties;

      //** Client API Rewrite Vars */
      $wp->add_query_var( 'wpp_api_action' );
      $wp->add_query_var( 'wpp_api_resource' );
      $wp->add_query_var( 'wpp_api_method' );
      $wp->add_query_var( 'wpp_api_key' );
      $wp->add_query_var( 'wpp_api_response' );

      $_api_key = WPP_F::get_key( 'api_key' );

      if( empty( $wp_properties[ '_api_routes' ][ 'resources' ] ) || !$_api_key || is_wp_error( $_api_key ) ) {
        return;
      }

      //** API method. Resources  */
      $wp_properties[ '_rewrite_rules' ][ '(' . $_api_key . ')/resources(.(xml|json)/?)?' ] = 'index.php?wpp_api_key=$matches[1]&wpp_api_action=resources';

      foreach( (array) $wp_properties[ '_api_routes' ][ 'resources' ] as $resource => $resource_data ) {

        //** API method. Resource Methods Documentation */
        $wp_properties[ '_rewrite_rules' ][ '(' . $_api_key . ')/' . $resource . '(\.(xml|json)/?)?$' ] =
          'index.php?wpp_api_key=$matches[1]&wpp_api_action=resource_methods&wpp_api_resource=' . $resource;

        foreach( (array) $resource_data[ 'apis' ] as $method => $data ) {
          //** Prepare condition */
          $condition = preg_replace( '#^\/#', '', $data[ 'path' ] );
          $condition = str_replace( $_api_key, "({$_api_key})", $condition );
          $condition = str_replace( "/{$resource}/", "/{$resource}(?:\.(?:xml|json)/?)?/", $condition );

          //** Prepare rule */
          $rule = "index.php?wpp_api_key=\$matches[1]&wpp_api_action=do_method&wpp_api_resource={$resource}&wpp_api_method={$method}";

          //** Determine if we have parameters in $condition and modify condition and rule if parameters exist */
          if( preg_match_all( '#\{[^\}]+\}#', $condition, $matches ) ) {
            if( is_array( $matches[ 0 ] ) ) {
              for( $i = 0; $i < count( $matches[ 0 ] ); $i++ ) {
                $param_found = false;
                $param       = str_replace( array( '{', '}' ), '', $matches[ 0 ][ $i ] );
                foreach( (array) $data[ 'operations' ] as $oprt ) {
                  foreach( (array) $oprt[ 'parameters' ] as $prm ) {
                    if( isset( $prm[ 'name' ] ) && $prm[ 'name' ] == $param ) {
                      $condition = str_replace( $matches[ 0 ][ $i ], '([^\/]+)', $condition );
                      $rule .= '&' . $param . '=$matches[' . ( $i + 2 ) . ']';
                      //** We need to add query var for the current param */
                      $wp->add_query_var( $param );
                      break;
                    }
                  }
                  if( $param_found ) break;
                }
              }
            }
          }

          //** Use filters if needed */
          $_rc = apply_filters( 'wpp::generate_api_route_rewrite_rule', array( 'condition' => $condition, 'rule' => $rule ), array( 'resource' => $resource, 'method' => $method ) );

          //** Rewrite Rule for API Method */
          $wp_properties[ '_rewrite_rules' ][ $_rc[ 'condition' ] ] = $_rc[ 'rule' ];
        }

      }

    }

    /**
     * API action handler.
     * Performs API method and returns result or error.
     *
     * @author peshkov@UD
     *
     * @param array $args
     *
     * @return bool|WP_Error|mixed
     */
    static function do_action( $args = array() ) {
      global $wp_properties;

      $args = wp_parse_args( (array) $args, array(
        'api_key'    => false,
        'permalink'  => '' != get_option( 'permalink_structure' ) ? true : false,
        'action'     => false,
        'resource'   => false,
        'method'     => false,
        'query_vars' => array(),
        'type'       => 'json',
        'return'     => false,
      ) );

      $result = false;

      try {

        /**
         * Determine if API request has api_key and it's correct
         * The API requests must be safety.
         */
        if( $args[ 'api_key' ] !== WPP_F::get_key( 'api_key' ) ) {
          throw new Exception( "Request is forbidden." );
        }

        //**  */
        if( empty( $wp_properties[ '_api_routes' ][ 'resources' ] ) || !is_array( $wp_properties[ '_api_routes' ][ 'resources' ] ) ) {
          throw new Exception( "API is not available." );
        }

        //** Perfom specific action */
        switch( $args[ 'action' ] ) {

          case 'resources':
            $resources = array();
            foreach( $wp_properties[ '_api_routes' ][ 'resources' ] as $resource => $data ) {
              $resources[ $resource ] = array(
                'path'       => $data[ 'path' ],
                'desription' => isset( $data[ 'description' ] ) ? $data[ 'description' ] : '',
              );
            }
            $result = WPP_F::strip_protected_keys( array(
              'apiVersion' => WPP_Version,
              'resources'  => $resources,
            ) );
            break;

          case 'resource_methods':
            if( !isset( $args[ 'resource' ] ) || !isset( $wp_properties[ '_api_routes' ][ 'resources' ][ $args[ 'resource' ] ] ) ) break;
            $result = WPP_F::strip_protected_keys( array(
              'path'       => $wp_properties[ '_api_routes' ][ 'resources' ][ $args[ 'resource' ] ][ 'path' ],
              'apiVersion' => WPP_Version,
              'apis'       => array_values( (array) $wp_properties[ '_api_routes' ][ 'resources' ][ $args[ 'resource' ] ][ 'apis' ] ),
            ) );
            break;

          case 'do_method':
            //** Be sure that all request's params are correct */
            if( !isset( $args[ 'resource' ] ) || !isset( $args[ 'method' ] ) ) {
              throw new Exception( "Request is incorrect." );
            }
            //** Determine if API route's method exists */
            if( !isset( $wp_properties[ '_api_routes' ][ 'resources' ][ $args[ 'resource' ] ][ 'apis' ][ $args[ 'method' ] ] ) ) {
              throw new Exception( "Request is incorrect." );
            }
            $data   = $wp_properties[ '_api_routes' ][ 'resources' ][ $args[ 'resource' ] ][ 'apis' ][ $args[ 'method' ] ];
            $params = array();
            foreach( (array) $data[ 'operations' ] as $opr ) {
              if( isset( $opr[ 'httpMethod' ] ) && strtolower( $opr[ 'httpMethod' ] ) == strtolower( $_SERVER[ 'REQUEST_METHOD' ] ) ) {
                foreach( (array) $opr[ 'parameters' ] as $prm ) {
                  switch( $prm[ 'paramType' ] ) {
                    case 'query':
                      $params[ $prm[ 'name' ] ] = isset( $_REQUEST[ $prm[ 'name' ] ] ) ? $_REQUEST[ $prm[ 'name' ] ] : null;
                      break;
                    case 'path':
                      if( $args[ 'permalink' ] ) {
                        $params[ $prm[ 'name' ] ] = isset( $args[ 'query_vars' ][ $prm[ 'name' ] ] ) ? $args[ 'query_vars' ][ $prm[ 'name' ] ] : null;
                      } else {
                        $params[ $prm[ 'name' ] ] = isset( $_REQUEST[ $prm[ 'name' ] ] ) ? $_REQUEST[ $prm[ 'name' ] ] : null;
                      }
                      break;
                    case 'body':
                      throw new Exception( "Parameter's type 'body' is not supported yet." );
                      break;
                    default:
                      throw new Exception( "Parameter's type is incorrect." );
                      break;
                  }
                  if( empty( $params[ $prm[ 'name' ] ] ) && $prm[ 'required' ] == true ) {
                    throw new Exception( "Parameter {$prm['name']} is required." );
                  }
                }
              }
            }
            $result = @call_user_func_array( $data[ '_method' ], array( $params ) );
            break;

          default:
            throw new Exception( "Request is incorrect." );
            break;

        }

      } catch( exception $e ) {
        $result = new WP_Error( __METHOD__, $e->getMessage() );
      }

      if( $args[ 'return' ] ) {
        return $result;
      }

      //* Response */
      if( is_wp_error( $result ) ) {
        $result = array( 'success' => false, 'message' => $result->get_error_message() );
      } else if( !$result ) {
        $result = array( 'success' => false, 'message' => "There is no response." );
      }

      switch( $args[ 'type' ] ) {
        case 'xml':
          WPP_F::xml_response( $result );
          break;
        case 'json':
        default:
          WPP_F::json_response( $result );
          break;
      }

      return false;

    }

    /**
     * Set API route.
     * Parses route's data and fixes its structure
     *
     * @author peshkov@UD
     *
     * @param array $data
     *
     * @return array|bool
     */
    static function set_api_route( $data ) {

      $data = array_merge( array(
        'path'        => false,
        'description' => '',
        'operations'  => array(),
        '_method'     => false,
      ), (array) $data );

      //** Determine if API method can be called */
      if( !$data[ '_method' ] || !is_callable( $data[ '_method' ] ) ) {
        return false;
      }

      if( !$data[ 'path' ] ) {
        return false;
      }

      $operation = array(
        'httpMethod'     => 'GET', // GET, POST, PUT, DELETE
        'nickname'       => '',
        'summary'        => '',
        'notes'          => '',
        'parameters'     => array(),
        'errorResponses' => array(),
      );

      $parameter = array(
        'name'          => '',
        'description'   => '',
        'paramType'     => 'query', // query, path, body
        'required'      => false, // boolean
        'allowMultiple' => false, // boolean
        'dataType'      => 'string', // int, string
      );

      $error_responses = array(
        'code'   => '', // 400, 401, 403...
        'reason' => '',
      );

      //** Check and fix operations array structure if needed */
      foreach( (array) $data[ 'operations' ] as $k => $opr ) {
        if( is_string( $opr ) && in_array( $k, array( 'httpMethod', 'summary', 'notes', 'nickname' ) ) ) {
          $data[ 'operations' ] = array( $data[ 'operations' ] );
          break;
        }
      }

      $data[ 'operations' ] = array_values( (array) $data[ 'operations' ] );

      //* Data 'operations' is required */
      if( empty( $data[ 'operations' ] ) ) {
        return false;
      }

      foreach( $data[ 'operations' ] as $k => $opr ) {
        $data[ 'operations' ][ $k ] = array_merge( $operation, (array) $opr );
        if( !empty( $data[ 'operations' ][ $k ][ 'parameters' ] ) ) {

          if( !is_array( $data[ 'operations' ][ $k ][ 'parameters' ] ) ) $data[ 'operations' ][ $k ][ 'parameters' ] = array();
          else foreach( $data[ 'operations' ][ $k ][ 'parameters' ] as $i => $v ) {
            $v = array_merge( $parameter, (array) $v );
            //** Check paramType */
            if( !is_string( $v[ 'paramType' ] ) || !in_array( $v[ 'paramType' ], array( 'query', 'path', 'body' ) ) ) {
              return false;
            }
            $data[ 'operations' ][ $k ][ 'parameters' ][ $i ] = $v;
          }
          $data[ 'operations' ][ $k ][ 'parameters' ] = array_values( $data[ 'operations' ][ $k ][ 'parameters' ] );

          if( !is_array( $data[ 'operations' ][ $k ][ 'errorResponses' ] ) ) $data[ 'operations' ][ $k ][ 'errorResponses' ] = array();
          else foreach( $data[ 'operations' ][ $k ][ 'errorResponses' ] as $i => $v ) {
            $data[ 'operations' ][ $k ][ 'errorResponses' ][ $i ] = array_merge( $parameter, (array) $v );
          }
          $data[ 'operations' ][ $k ][ 'errorResponses' ] = array_values( $data[ 'operations' ][ $k ][ 'errorResponses' ] );
        }
      }

      return $data;
    }

    /**
     * Outputs JSON with valid headers and dies.
     *
     * @updated 1.0.6 - Added WP_Error object support.
     * @since 1.0.2
     * @author potanin@UD
     */
    static function json_response( $object, $args = false ) {

      if( headers_sent() ) {
        return false;
      }

      $args = wp_parse_args( $args, array(
        'file_name' => 'data.json',
      ) );

      if( is_wp_error( $object ) ) {
        $object = array( 'success' => false, 'message' => $object->get_error_message(), 'error' => $object );
      }

      nocache_headers();

      header( 'Content-Disposition: inline; filename="' . $args[ 'file_name' ] . '"' );
      header( 'Content-Type: application/json' );
      header( 'Connection: close' );
      header( 'Content-Length: ' . strlen( $json = json_encode( array_filter( (array) $object ) ) ) );

      die( $json );

    }

    /**
     * Outputs XML with valid headers and dies.
     *
     * @updated 1.0.4
     * @author potanin@UD
     */
    static function xml_response( $xml, $args = false ) {

      if( headers_sent() ) {
        return false;
      }

      $args = wp_parse_args( $args, array(
        'file_name' => 'data.xml',
      ) );

      if( is_array( $xml ) || is_object( $xml ) ) {
        //@todo Add JSON->XML converter.
      }

      nocache_headers();

      header( 'Content-Disposition: inline; filename="' . $args[ 'file_name' ] . '"' );
      header( 'Content-Type: application/xml' );
      header( 'Connection: close' );
      header( 'Content-Length: ' . strlen( $xml ) );

      die( $xml );

    }

  }

}
