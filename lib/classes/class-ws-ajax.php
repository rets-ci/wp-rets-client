<?php
/**
 * AJAX Handler
 *
 * @since 1.0.0
 */
namespace UsabilityDynamics\WPP {

  if( !class_exists( 'UsabilityDynamics\WPP\WS_Ajax' ) ) {

    final class WS_Ajax {

      /**
       * The list of wp_ajax_{name} actions
       *
       * @var array
       */
      var $actions = array(
        'wpp_ws_get_properties_ids',
        'wpp_ws_update_walkscore'
      );

      /**
       * The list of wp_ajax_nopriv_{name} actions
       *
       * @var array
       */
      var $nopriv_actions = array(
        'wpp_ws_get_properties_ids',
        'wpp_ws_update_walkscore'
      );

      /**
       * Init AJAX actions
       *
       * @author peshkov@UD
       */
      public function __construct(){

        /**
         * Maybe extend the list by external modules.
         */
        $this->actions = apply_filters( 'wpp::walkscore::ajax_actions', $this->actions );
        $this->nopriv_actions = apply_filters( 'wpp::walkscore::ajax_nopriv_actions', $this->nopriv_actions );

        foreach( $this->actions as $action ) {
          add_action( 'wp_ajax_' . $action, array( $this, 'request' ) );
        }

        foreach( $this->nopriv_actions as $action ) {
          add_action( 'wp_ajax_nopriv_' . $action, array( $this, 'request' ) );
        }

      }

      /**
       * Handles AJAX request
       *
       * @author peshkov@UD
       */
      public function request() {

        $response = array(
          'message' => '',
          'html' => '',
        );

        try{

          $action = $_REQUEST[ 'action' ];

          /** Determine if the current class has the method to handle request */
          if( is_callable( array( $this, 'action_'. $action ) ) ) {
            $response = call_user_func_array( array( $this, 'action_' . $action ), array( $_REQUEST ) );
          }
          /** Determine if external function exists to handle request */
          elseif ( is_callable( 'action_' . $action ) ) {
            $response = call_user_func_array( $action, array( $_REQUEST ) );
          }
          elseif ( is_callable( $action ) ) {
            $response = call_user_func_array( $action, array( $_REQUEST ) );
          }
          /** Oops! */
          else {
            throw new \Exception( __( 'Incorrect Request' ) );
          }

        } catch( \Exception $e ) {
          wp_send_json_error( $e->getMessage() );
        }

        wp_send_json_success( $response );

      }

      /**
       * Sends json.
       * Use it if custom response should be sent.
       *
       * @note Why not use wp_send_json()?
       *
       * @param array $response
       * @author peshkov@UD
       */
      public function send_json( $response ) {
        @header( 'Content-Type: application/json; charset=' . get_option( 'blog_charset' ) );
        echo wp_json_encode( $response );
        if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
          wp_die();
        } else {
          die;
        }
      }

      /**
       * Returns All Properties IDs
       */
      public function action_wpp_ws_get_properties_ids( $args = false ) {
        global $wpdb;

        /* Get the list of All Properties */
        $ids = $wpdb->get_results("
          SELECT ID as post_id, post_title
            FROM {$wpdb->posts}
              WHERE post_type = 'property'
                AND post_status IN ( 'publish', 'private' )
        ", ARRAY_A );

        /* Get the IDs list of properties which already have Walk Score */
        $extra_ids = $wpdb->get_col("
          SELECT post_id
            FROM {$wpdb->postmeta}
              WHERE meta_key = '_ws_walkscore'
                AND meta_value != ''
        ");

        if( !is_array($ids) ) {
          $ids = array();
        }

        /* Ignore properties which already have Walk Score */
        foreach( $ids as $k => $v ) {
          if( in_array( $v[ 'post_id' ], $extra_ids ) ) {
            unset( $ids[$k] );
          }
        }

        return array(
          'ids' => $ids,
        );

      }

      /**
       * Updates Walk Score for
       */
      public function action_wpp_ws_update_walkscore( $args = false ) {

        if( !isset( $args[ 'post_id' ] ) || !is_numeric( $args[ 'post_id' ] ) ) {
          throw new \Exception( __( 'Post ID is not provided or invalid', ud_get_wpp_walkscore('domain') ) );
        }

        get_post( $args[ 'post_id' ] );

      }

    }

  }

}
