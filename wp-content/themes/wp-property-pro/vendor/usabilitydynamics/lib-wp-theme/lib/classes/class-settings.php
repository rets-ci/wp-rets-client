<?php
/**
 * Theme Settings
 *
 * @author Usability Dynamics, Inc. <info@usabilitydynamics.com>
 * @package Theme
 * @since 2.0.0
 */
namespace UsabilityDynamics\Theme {

  if( !class_exists( 'UsabilityDynamics\Theme\Settings' ) ) {

    class Settings extends \UsabilityDynamics\Settings {

      /**
       * Create Settings Instance
       *
       * @since 2.0.0
       */
      static function define( $args = false, $data = array() ) {

        // Instantiate Settings object
        $_instance = new Settings( Utility::parse_args( $args, array(
          "store" => "options",
          "key"   => 'theme::' . ( wp_get_theme()->get( 'Name' ) ),
        )));

        // Merge with default data.
        $data = \UsabilityDynamics\Utility::extend( self::get_system_settings(), $_instance->get(), (array) $data );

        if( !empty( $data ) ) {
          $_instance->set( $data );
        }

        // Return Instance.
        return $_instance;

      }

      /**
       * Get default Settings from schema
       *
       */
      static public function get_system_settings( $path = '/static/schemas/default.settings.json' ) {

        if( file_exists( $file = get_stylesheet_directory() . $path ) ) {
          return \UsabilityDynamics\Utility::l10n_localize( json_decode( file_get_contents( $file ), true ) );
        }

        return array();

      }

    }

  }

}



