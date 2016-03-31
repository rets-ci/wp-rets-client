<?php

/**
 *
 */
namespace UsabilityDynamics\RDC {

  if ( !class_exists( '\UsabilityDynamics\RDC\Customizer' ) ) {

    /**
     * Class Customizer
     * @package UsabilityDynamics\RDC
     */
    class Customizer {

      /**
       * Customizer constructor.
       */
      public function __construct() {
        add_action('customize_register', array( $this, 'theme_customizer' ));
      }

      /**
       * @param $wp_customize
       */
      public function theme_customizer($wp_customize) {

        $wp_customize->add_section('rdc_logo_section', array(
            'title' => __('Logo', 'rdc'),
            'priority' => 30,
            'description' => 'Upload a logo to replace the default site name and description in the header',
        ));

        $wp_customize->add_setting('rdc_logo');

        $wp_customize->add_control(new \WP_Customize_Image_Control($wp_customize, 'rdc_logo', array(
            'label' => __('Logo', 'rdc'),
            'section' => 'rdc_logo_section',
            'settings' => 'rdc_logo',
        )));

        $wp_customize->add_section( 'rdc_recaptcha', array(
            'title'       => __( 'reCAPTCHA', 'rdc' ),
            'description' => sprintf( __( 'Add reCaptcha to your forms.<br/>See %smore details%s.', 'madison' ), '<a target="_blank" href="https://www.google.com/recaptcha/">', '</a>' ),
            'priority'    => 100
        ));

        $wp_customize->add_setting( 'rdc_recaptcha_key', array(
            'default'              => ''
        ));

        $wp_customize->add_control( 'rdc_recaptcha_key', array(
            'label'   => __( 'Key', 'rdc' ),
            'section' => 'rdc_recaptcha',
            'type'    => 'text',
            'settings' => 'rdc_recaptcha_key'
        ));

        $wp_customize->add_setting( 'rdc_recaptcha_secret', array(
            'default'              => ''
        ));

        $wp_customize->add_control( 'rdc_recaptcha_secret', array(
            'label'   => __( 'Secret Key', 'rdc' ),
            'section' => 'rdc_recaptcha',
            'type'    => 'text',
            'settings' => 'rdc_recaptcha_secret'
        ));
      }
    }
  }
}