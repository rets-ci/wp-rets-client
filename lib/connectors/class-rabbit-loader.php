<?php

/**
 * Compatibility connector for rabbit loader
 */

namespace UsabilityDynamics\WPRETSC\Connectors {

  if( !class_exists( 'UsabilityDynamics\WPRETSC\Connectors\RabbitLoader' ) ) {

    /**
     * Class RabbitLoader
     * @package UsabilityDynamics\WPRETSC\Connectors
     */
    final class RabbitLoader {

      /**
       * RabbitLoader constructor.
       */
      public function __construct() {

        add_action( 'wrc::manage_property::before_update', function () {
          remove_filter( 'save_post', 'rabbit_save_post_purging_handler', 50 );
        } );

      }
    }

  }

}