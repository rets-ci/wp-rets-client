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
              'property_id' => array(
                'name' => sprintf( __( '%s ID', ud_get_wp_property( 'domain' ) ), \WPP_F::property_label() ),
                'description' => sprintf( __( 'If not empty, Slideshow will show for particular %s, which ID is set. If not provided will show slideshow for current %s', ud_get_wp_property( 'domain' ) ), \WPP_F::property_label(), \WPP_F::property_label() ),
                'type' => 'text',
                'default' => ''
              ),
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
          'property_id' => '',
        ), $atts );
        self::maybe_print_styles();
        return $this->get_template( 'property-responsive-shortcode', $data, false );

      }

      /**
       * Render property_overview default styles at once!
       */
      static public function maybe_print_styles() {
        $suffix = defined('SCRIPT_DEBUG') && SCRIPT_DEBUG ?  '' : '.min';
        wp_enqueue_style( 'dashicons' );
        wp_enqueue_style("swiper-style", ud_get_wpp_resp_slideshow()->path( "static/styles/swiper/swiper$suffix.css", "url" ));
        wp_enqueue_style("lightbox-style", ud_get_wpp_resp_slideshow()->path( "static/styles/lightbox$suffix.css", "url" ));
        wp_enqueue_style("property-responsive-slideshow-style", ud_get_wpp_resp_slideshow()->path( "static/styles/res-slideshow$suffix.css", "url" ));

        wp_enqueue_script("lightbox-script", ud_get_wpp_resp_slideshow()->path( "static/scripts/lightbox.js", "url" ));
        wp_enqueue_script("swiper-script", ud_get_wpp_resp_slideshow()->path( "static/scripts/swiper.jquery.js", "url" ));
        wp_enqueue_script("property-responsive-slideshow-script", ud_get_wpp_resp_slideshow()->path( "static/scripts/res-slideshow.js", "url" ));
      }

    }
    add_action('init', function(){
      new Property_Responsive_Slideshow_Shortcode();
    });
  }

}

