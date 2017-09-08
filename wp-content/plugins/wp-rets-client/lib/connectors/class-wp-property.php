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

      }

    }

  }

}