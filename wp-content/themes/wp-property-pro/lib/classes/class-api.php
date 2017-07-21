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

        register_rest_route( 'wp-property-pro/v1', '/collaborator/(?P<user>[\d]+)/create', array(
          'methods' => array( 'POST' ),
          'callback' => array( $this, 'create_user_collaborator' ),
          'args' => array(
            'collaborator' => array(
              'validate_callback' => function($param, $request, $key) {
                // TODO: should be replaced by a better validation check, to make sure the sent item is a string encoded JSON document
                if ( ! is_string( $param ) ) {
                  return new WP_Error( 'rest_invalid_param', esc_html__( 'the collaborator param must be an object.', 'my-text-domain' ), array( 'status' => 400 ) );
                } else {
                  return true;
                }
              },
              'type' => 'string'
            )
          )
        ));

        register_rest_route( 'wp-property-pro/v1', '/collaborator/(?P<user>[\d]+)/delete', array(
          'methods' => array( 'POST' ),
          'callback' => array( $this, 'delete_user_collaborator' ),
          'args' => array(
            'collaborator_id' => array(
              'validate_callback' => function($param, $request, $key) {
                // TODO: should be replaced by a better validation check, to make sure the sent item is a string encoded JSON document
                if ( ! is_numeric( $param ) ) {
                  return new WP_Error( 'rest_invalid_param', esc_html__( 'the collaborator id must be a number.', 'my-text-domain' ), array( 'status' => 400 ) );
                } else {
                  return true;
                }
              },
              'type' => 'integer'
            )
          )
        ));

        register_rest_route( 'wp-property-pro/v1', '/collaborator/(?P<user>[\d]+)', array(
          'methods' => array( 'GET' ),
          'callback' => array( $this, 'list_user_collaborator' )
        ));

        register_rest_route( 'wp-property-pro/v1', '/listing/(?P<listing>[\d]+)/comment', array(
          'methods' => array( 'POST' ),
          'callback' => array( $this, 'listing_add_comment' ),
          'args' => array(
            'comment' => array(
              'validate_callback' => function($param, $request, $key) {
                // TODO: should be replaced by a better validation check, to make sure the sent item is a string encoded JSON document
                if ( ! is_string( $param ) ) {
                  return new WP_Error( 'rest_invalid_param', esc_html__( 'the comment param must be an object.', 'my-text-domain' ), array( 'status' => 400 ) );
                } else {
                  return true;
                }
              },
              'type' => 'string'
            )
          )
        ));

        // Return JSON schema for each form.
        register_rest_route( 'wp-property-pro/v1', '/something-else/', array(
          'methods' => array( 'GET' ),
          'callback' => array( $this, 'get_sample_json' )
        ) );

      }

      /**
       * Create Collaborator for a Given User
       *
       *
       * @param WP_REST_Request $request
       * @return array
       */
      public function create_user_collaborator( WP_REST_Request $request ) {
        
        nocache_headers();

        return array(
          'collaborator' => array(
            json_decode($request['collaborator'])
          ),
          'message' => 'user collaborator created',
          'ok' => true,
          'user' => $request['user']
        );

      }

      /**
       * Delete Collaborator for a Given User
       *
       *
       * @param WP_REST_Request $request
       * @return array
       */
      public function delete_user_collaborator( WP_REST_Request $request ) {
        nocache_headers();
        $collaborator_id = (int)$request['collaborator_id'];
        $collaborators = $this->get_user_collaborators($request['user']);
        if (empty($collaborators)) {
          return array(
            'ok'=> false,
            'message' => 'user not found'
          );
        }
        $deletedCollaborator = array_filter($collaborators, function($obj) use ($collaborator_id) {
          return $obj->collaborator_id === $collaborator_id;
        });

        if (empty($deletedCollaborator)) {
          return array(
            'ok'=> false,
            'message' => 'collaborator not found'
          );
        } else {
          return array(
            'collaborator' => array_values($deletedCollaborator)[0],
            'message' => 'user collaborator deleted',
            'ok' => true,
            'user' => $request['user']
          );
        }
      }

      /**
       * List Collaborators for a Given User
       *
       *
       * @param WP_REST_Request $request
       * @return array
       */
      public function list_user_collaborator( WP_REST_Request $request ) {
        
        nocache_headers();
        $collaborators = $this->get_user_collaborators($request['user']);
        
        if (!$collaborators) {
          return array(
            'ok'=> false,
            'message' => 'user not found'
          );
        } else {
          return array(
            'ok'=> true,
            'data' => $collaborators,
            'message' => 'user collaborators',
            'user' => $request['user']
          );
        }
      }


      public function listing_add_comment( WP_REST_Request $request ) {
        nocache_headers();
        // TODO: logic to add comment to listing...
        if (!isset($request['comment'])) {
          return array(
            'message' => 'comment missing from body',
            'ok' => false
          );
        }
        return array(
          'comment' => json_decode($request['comment']),
          'listing' => $request['listing'],
          'message' => 'comment added to listing',
          'ok' => true,
        );
      }
      
      /**
       * Retrieve Collaborators for a Given User
       *
       *
       * @param $user
       * @return array|bool
       */
      public function get_user_collaborators ($user) {
        $collaboratorsJSON = file_get_contents( get_template_directory() . '/static/fixtures/sample-collaborators.json' );
        $json_decoded = json_decode($collaboratorsJSON);

        $user = (int)$user;
  
        $filtered_item = array_filter($json_decoded->data, function($obj) use ($user) {
          return $obj->user_id === $user;
        });
        if (empty($filtered_item)) {
          return false;
        } else {
          return $collaborators = array_values($filtered_item)[0]->collaborators;
        }
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