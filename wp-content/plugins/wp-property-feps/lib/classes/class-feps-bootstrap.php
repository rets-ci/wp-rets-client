<?php
/**
 * Bootstrap
 *
 * @since 3.0.0
 */
namespace UsabilityDynamics\WPP {

  if( !class_exists( 'UsabilityDynamics\WPP\FEPS_Bootstrap' ) ) {

    final class FEPS_Bootstrap extends \UsabilityDynamics\WP\Bootstrap_Plugin {
      
      /**
       * Singleton Instance Reference.
       *
       * @protected
       * @static
       * @property $instance
       * @type \UsabilityDynamics\WPP\FEPS_Bootstrap object
       */
      protected static $instance = null;
      
      /**
       * Instantaite class.
       */
      public function init() {
        require_once( dirname( __DIR__ ) . '/class-wpp-feps.php' );
        add_action( 'wpp_pre_init', array( 'class_wpp_feps', 'wpp_pre_init' ) );
        add_action( 'wpp_post_init', array( 'class_wpp_feps', 'wpp_post_init' ) );
        add_action( 'widgets_init', create_function( '', 'return register_widget("MyFepsWidget");' ) );
        add_action( 'widgets_init', create_function( '', 'return register_widget("MyFepsInfoWidget");' ) );
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
