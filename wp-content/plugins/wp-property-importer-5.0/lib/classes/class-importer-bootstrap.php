<?php
/**
 * Bootstrap
 *
 * @since 5.0.0
 */
namespace UsabilityDynamics\WPP {

  if( !class_exists( 'UsabilityDynamics\WPP\Importer_Bootstrap' ) ) {

    final class Importer_Bootstrap extends \UsabilityDynamics\WP\Bootstrap_Plugin {


      public $cron;

      /**
       * Singleton Instance Reference.
       *
       * @protected
       * @static
       * @property $instance
       * @type UsabilityDynamics\WPP\Importer_Bootstrap object
       */
      protected static $instance = null;
      
      /**
       * Instantaite class.
       */
      public function init() {

        require_once( dirname( __DIR__ ) . '/class-wpp-rets.php' );
        require_once( dirname( __DIR__ ) . '/class-gc-import.php' );
        require_once( dirname( __DIR__ ) . '/class-wpp-cli-xmli.php' );
        require_once( dirname( __DIR__ ) . '/class-wpp-property-import.php' );

        add_action( 'wpp_post_init', array( 'class_wpp_property_import', 'init' ) );
        add_action( 'wpp_pre_init', array( 'class_wpp_property_import', 'pre_init' ) );

        //** @todo: What a hell is it? peshkov@UD */
        if( !is_admin() ) {
          do_action( 'wpp_init' );
        }

        //** Adds WP-Cron Management and handler */
        $this->cron = new Importer_Cron();
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
