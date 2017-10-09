<?php

/**
 *
 */
namespace UsabilityDynamics\WPRETSC\Connectors {

  if ( !class_exists( 'UsabilityDynamics\WPRETSC\Connectors\Loader' ) ) {

    /**
     * Class Loader
     * @package UsabilityDynamics\WPRETSC\Connectors
     */
    final class Loader {

      /**
       * @var array
       */
      private $connectors = array();

      /**
       * Loader constructor.
       */
      public function __construct() {

        //
        if ( class_exists( 'SitePress' ) ) {
          $this->connectors[] = new WPML();
        }

        // WP-Property plugin connector
        if ( function_exists( 'ud_get_wp_property' ) ) {
          $this->connectors[] = new WPProperty();
        }

        // Houzez theme connector
        add_action( 'after_setup_theme', function() {
          if( defined( 'HOUZEZ_THEME_NAME' ) ) {
            $this->connectors[] = new Houzez();
          }
        } );

      }

    }

  }

}