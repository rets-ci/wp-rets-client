<?php
/**
 * Bootstrap
 *
 * @since 3.0.0
 */
namespace UsabilityDynamics\WPP {

  if( !class_exists( 'UsabilityDynamics\WPP\PDF_Bootstrap' ) ) {

    final class PDF_Bootstrap extends \UsabilityDynamics\WP\Bootstrap {
      
      /**
       * Singleton Instance Reference.
       *
       * @protected
       * @static
       * @property $instance
       * @type UsabilityDynamics\WPP\PDF_Bootstrap object
       */
      protected static $instance = null;
      
      /**
       * Instantaite class.
       */
      public function init() {
        //** Be sure we do not have errors. Do not initialize plugin if we have them. */
        if( $this->has_errors() ) {
          return null;
        }
        
        require_once( dirname( __DIR__ ) . '/class-wpp-pdf-flyer.php' );
        add_action( 'wpp_init', array( 'class_wpp_pdf_flyer', 'init' ) );
        add_action( 'wpp_pre_init', array( 'class_wpp_pdf_flyer', 'pre_init' ) );
        /* Any front-end Functions */
        add_action( 'template_redirect', array( 'class_wpp_pdf_flyer', 'template_redirect' ) );
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
