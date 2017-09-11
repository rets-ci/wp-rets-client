<?php

/**
 * Compatibility connector for WP-Property
 */
namespace UsabilityDynamics\WPRETSC\Connectors {

  if ( !class_exists( 'UsabilityDynamics\WPRETSC\Connectors\WPProperty' ) ) {

    /**
     * Class WPProperty
     * @package UsabilityDynamics\WPRETSC\Connectors
     */
    final class WPProperty {

      /**
       * WPML constructor.
       */
      public function __construct() {

        /**
         * WP-Property: Supermap add-on support
         *
         * Ignore 'exclude_from_supermap' parameter
         */
        add_filter( 'wpp:supermap:query_defaults', function($query, $atts) {
          if( isset( $query['exclude_from_supermap'] ) ) {
            unset($query['exclude_from_supermap']);
          }
          return $query;
        }, 10, 2 );

        /**
         * Flush all object caches (WPP) related to current property
         */
        add_action( 'wrc::xmlrpc::on_flush_cache', function( $post_id ) {
          if( method_exists( '\UsabilityDynamics\WPP\Property_Factory', 'flush_cache' ) ) {
            //ud_get_wp_rets_client()->write_log( "Flushing WPP object cache for [" . $post_id . "] psot_id", 'info' );
            \UsabilityDynamics\WPP\Property_Factory::flush_cache( $post_id );
          }
        }, 10, 1 );

      }

    }

  }

}