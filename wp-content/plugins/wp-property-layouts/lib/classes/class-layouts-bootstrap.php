<?php
/**
 * Bootstrap
 *
 * @since 1.0.0
 */
namespace UsabilityDynamics\WPP {

  if( !class_exists( 'UsabilityDynamics\WPP\Layouts_Bootstrap' ) ) {

    final class Layouts_Bootstrap extends \UsabilityDynamics\WP\Bootstrap_Plugin {
      
      /**
       * Singleton Instance Reference.
       *
       * @protected
       * @static
       * @property $instance
       * @type UsabilityDynamics\WPP\Layouts_Bootstrap object
       */
      protected static $instance = null;

      /**
       * @var null
       */
      public $layouts_builder = null;
      
      /**
       * Instantaite class.
       */
      public function init() {

        $this->layouts_builder  = new Layouts_Builder();

      }
      
      /**
       * Plugin Activation
       *
       */
      public function activate() {}
      
      /**
       * Plugin Deactivation
       *
       */
      public function deactivate() {}

    }

  }

}
