<?php
/**
 * RESTful API Routes for Theme
 *
 * @since 0.1.0
 * @author potanin@UD
 */
namespace UsabilityDynamics\PropertyPro {

  use WP_REST_Request;

  if( !class_exists( '\UsabilityDynamics\PropertyPro\API' ) ) {

    class API {

      /**
       * API constructor.
       *
       */
      function __construct() {

        add_action( 'rest_api_init', array( $this, 'rest_api_init' ) );

      }

      /**
       * Initialize API
       *
       * /wp-json/wp-property-pro/v1/version
       * /wp-json/wp-property-pro/v1/get_sample_json
       *
       */
      public function rest_api_init() {

        register_rest_route( 'wp-property-pro/v1', '/version/', array(
          'methods' => array( 'GET' ),
          'callback' => array( $this, 'get_version' ),
        ) );

        // Return JSON schema for each form.
        register_rest_route( 'wp-property-pro/v1', '/something-else/', array(
          'methods' => array( 'GET' ),
          'callback' => array( $this, 'get_sample_json' )
        ) );

      }

      /**
       * Get Version (example)
       *
       * https://usabilitydynamics-www-reddoorcompany-com-develop-v3-andy.c.rabbitci.com/wp-json/wp-property-pro/v1/version/
       *
       * @param WP_REST_Request $request
       * @return array
       */
      public function get_version( WP_REST_Request $request ) {

        nocache_headers();

        return array(
          'ok' => true,
          'message' => 'Version coming'
        );

      }

      /**
       * Get Data from a Static JSON file
       *
       *
       * @param WP_REST_Request $request
       * @return array
       */
      public function get_sample_json( WP_REST_Request $request ) {

        return array(
          'ok'=>true,
          'data' => json_decode ( file_get_contents( get_template_directory() . '/static/fixtures/sample-json.json' ) )
        );

      }


    }

  }
}