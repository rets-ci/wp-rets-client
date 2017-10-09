<?php

/**
 * Compatibility connector for wp-rabbit
 */
namespace UsabilityDynamics\WPRETSC\Connectors {

  if ( !class_exists( 'UsabilityDynamics\WPRETSC\Connectors\WPRABBIT' ) ) {

    /**
     * Class WPRABBIT
     * @package UsabilityDynamics\WPRETSC\Connectors
     */
    final class WPRABBIT {

      /**
       * WPRABBIT constructor.
       */
      public function __construct() {

        add_action( 'wrc::manage_property::before_update', function() {
          remove_filter( 'save_post', 'save_post_purging_handler' );
        } );

      }
    }

  }

}