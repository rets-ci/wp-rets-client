<?php
/**
 * Bootstrap
 *
 * @since 1.0.0
 */
namespace RDC\Theme {

  if( !class_exists( 'RDC\Theme\Bootstrap' ) ) {

    final class Bootstrap extends \UsabilityDynamics\WP\Bootstrap_Theme {
      
      /**
       * Singleton Instance Reference.
       *
       * @protected
       * @static
       * @property $instance
       * @type RDC\Theme\Bootstrap object
       */
      protected static $instance = null;
      
      /**
       * Instantaite class.
       */
      public function init() {
        
        //** Here is we go. */
        
      }

    }

  }

}
