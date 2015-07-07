<?php
/**
 * Bootstrap
 *
 * @since 2.0.0
 */
namespace UsabilityDynamics\WPP {

  if( !class_exists( 'UsabilityDynamics\WPP\Agents_Bootstrap' ) ) {

    final class Agents_Bootstrap extends \UsabilityDynamics\WP\Bootstrap_Plugin {
      
      /**
       * Singleton Instance Reference.
       *
       * @protected
       * @static
       * @property $instance
       * @type UsabilityDynamics\WPP\Agents_Bootstrap object
       */
      protected static $instance = null;
      
      /**
       * Instantaite class.
       */
      public function init() {
        require_once( dirname( __DIR__ ) . '/class-agents.php' );
        add_action('wpp_init', array('class_agents', 'init'));
        add_action('wpp_pre_init', array('class_agents', 'pre_init'));
        add_action('widgets_init', create_function('', 'return register_widget("AgentWidget");'));
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
