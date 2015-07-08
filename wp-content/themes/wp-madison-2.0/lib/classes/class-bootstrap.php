<?php
/**
 * Bootstrap
 *
 * @since 2.0.0
 */
namespace UsabilityDynamics\Madison {

  if( !class_exists( 'UsabilityDynamics\Madison\Bootstrap' ) ) {

    final class Bootstrap extends \UsabilityDynamics\WP\Bootstrap_Theme {
      
      /**
       * Singleton Instance Reference.
       *
       * @protected
       * @static
       * @property $instance
       * @type UsabilityDynamics\Madison\Bootstrap object
       */
      protected static $instance = null;

      /**
       * https://github.com/UsabilityDynamics/www.reddoorcompany.com/issues/16
       */
      public function __construct() {
        include_once( get_template_directory() . '/lib/functions.php' );
      }
      
      /**
       * Instantaite class.
       */
      public function init() {
        //include_once( get_template_directory() . '/lib/functions.php' );
      }
      
      /**
       * Return localization's list.
       *
       * @return array
       */
      public function get_localization() {
        return apply_filters( 'wpp::get_localization', array(
          'licenses_menu_title' => __( 'Theme License', $this->domain ),
          'licenses_page_title' => sprintf( __( '%s License Manager', $this->domain ), $this->name ),
        ) );
      }

    }

  }

}
