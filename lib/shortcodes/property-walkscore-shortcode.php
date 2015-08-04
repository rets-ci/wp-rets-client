<?php
/**
 * Shortcode: [property_walkscore]
 * Template: static/views/shortcodes/property_walkscore.php
 *
 * @since 1.0.0
 */
namespace UsabilityDynamics\WPP {

  if( !class_exists( 'UsabilityDynamics\WPP\Property_Walkscore_Shortcode' ) ) {

    class Property_Walkscore_Shortcode extends WS_Shortcode {

      /**
       * Constructor
       */
      public function __construct() {

        $options = array(
          'id' => 'example',
          'params' => array(

          ),
          'description' => __( 'Renders WalkScore', ud_get_wpp_walkscore()->domain ),
          'group' => 'WP-Property',
        );

        parent::__construct( $options );

      }

      /**
       *  Renders Shortcode
       */
      public function call( $atts = "" ) {

        $data = shortcode_atts( array(

        ), $atts );

        $this->get_template( $data[ 'template' ], $data );
      }

    }

    new Property_Walkscore_Shortcode();

  }

}

