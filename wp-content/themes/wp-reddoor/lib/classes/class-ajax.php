<?php

/**
 *
 */
namespace UsabilityDynamics\RDC {

  if ( !class_exists( '\UsabilityDynamics\RDC\Ajax' ) ) {

    /**
     * Class Ajax
     * @package UsabilityDynamics\RDC
     */
    class Ajax {

      /**
       * Actions
       */
      private $actions = array(
        // slug => is_private
        'TermsSearchable' => 0
      );

      public function __construct() {

        foreach( $this->actions as $action => $is_private ) {

          if ( !is_callable( array( $this, $action ) ) ) continue;

          add_action( "wp_ajax_{$action}", array( $this, $action ) );
          if ( !$is_private ) {
            add_action( "wp_ajax_nopriv_{$action}", array( $this, $action ) );
          }

        }

      }

      /**
       *
       */
      public function TermsSearchable() {

        if ( empty( $_GET['q'] ) ) {
          $query = 'a';
        } else {
          $query = $_GET['q'];
        }

        $_terms = get_terms( array( 'high_school', 'middle_school', 'elementary_school', 'location_country', 'location_zip', 'neighborhood', 'location_city' ), array(
            'search' => $query
        ) );

        $_terms = array_map( function( $data ) {

          return array(
              "id" => $data->term_id,
              "slug" => $data->slug,
              "name" => $data->name,
              "count" => $data->count,
              "taxonomy" => ucfirst(str_replace('_', ' ', $data->taxonomy)),
          );

        }, $_terms );

        wp_send_json(array(
            "ok" => true,
            "data" => $_terms
        ));

      }
    }
  }
}