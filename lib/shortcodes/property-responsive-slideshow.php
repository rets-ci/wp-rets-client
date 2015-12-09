<?php
/**
 * Shortcode: [property_responsive_slideshow]
 *
 * @since 1.0.0
 */
namespace UsabilityDynamics\WPP {

  if( !class_exists( 'UsabilityDynamics\WPP\Property_Responsive_Slideshow_Shortcode' ) ) {

    class Property_Responsive_Slideshow_Shortcode extends RS_Shortcode {

      /**
       * Constructor
       */
      public function __construct() {

        $options = array(
          'id' => 'property_responsive_slideshow',
          'params' => array(

            // See params examples in: wp-property/lib/shortcodes

          ),
          'description' => __( 'Renders Responsive Slideshow', ud_get_wpp_resp_slideshow()->domain ),
          'group' => 'WP-Property',
        );

        parent::__construct( $options );

      }

      /**
       *  Renders Shortcode
       */
      public function call( $atts = "" ) {

        $data = shortcode_atts( array(

          // Default Params

        ), $atts );

        return $this->get_template( 'property_responsive_shortcode', $data, false );

      }

    }

    new Property_Responsive_Slideshow_Shortcode();

  }

}

