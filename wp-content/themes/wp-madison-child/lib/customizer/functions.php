<?php
/**
 * Madison Theme Customizer
 *
 */


/**
 * Add custom options to the theme customizer.
 */
function rdc_customize_register( $wp_customize ) {

  /* reCAPTCHA See: https://www.google.com/recaptcha/ */

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

  /* SEARCH WIDGET */

  $wp_customize->add_section( 'rdc_search', array(
    'title'       => __( 'Multipurpose Search', 'rdc' ),
    'description' => __( 'Control a multipurpose search form in a header.', 'rdc' ),
    'priority'    => 61
  ));

  $wp_customize->add_setting( 'rdc_multipurpose_search_enable', array(
    'default'              => ''
  ));

  $wp_customize->add_control( 'rdc_multipurpose_search_enable', array(
    'label'   => __( 'Enable Multipurpose Search', 'rdc' ),
    'section' => 'rdc_search',
    'type'    => 'checkbox',
    'settings' => 'rdc_multipurpose_search_enable'
  ));

  /* FOOTER LOGO */

  $desc = 'Upload a footer logo. Your theme recommends a image size of <strong>180 × 230</strong> pixels.<br/>';
  $desc .= '<strong>Note</strong>, if image is not selected the default one below will be used.<br/>';
  $desc .= '<span class="customize-control-title">Default Image</span>';
  $desc .= '<div><img style="display:block;width:90px;margin:0 auto;border:1px solid #eee;" src="' . get_stylesheet_directory_uri() . '/static/images/footer-logo.png" alt="" /></div>';

  $wp_customize->add_section( 'rdc_footer_logo' , array(
    'title'       => __( 'Footer Image', 'rdc' ),
    'priority'    => 60,
    'description' => $desc
  ) );

  $wp_customize->add_setting( 'footer_logo' );

  $wp_customize->add_control(
    new WP_Customize_Image_Control( $wp_customize, 'footer_logo', array(
        'label'      => __( 'Upload a Footer Logo', 'rdc' ),
        'section'    => 'rdc_footer_logo',
        'settings'   => 'footer_logo',
      )
    )
  );

  /* FOOTER SITE INFORMATION */

  // Remove Contact Information Section since it's not used anymore.
  $wp_customize->remove_section( 'madison_contact_infomation' );
  $wp_customize->remove_section( 'madison_footer' );

  // Footer site information.
  $wp_customize->add_section( 'rdc_footer', array(
    'title'    => __( 'Site & Contact Info', 'rdc' ),
    'description' => __( 'Use this section to customize the site and contact info sections. HTML is allowed.', 'rdc' ),
    'priority' => 103,
  ));

  $wp_customize->add_setting( 'rdc_footer_menu_label', array(
    'default'   => '',
  ));

  $wp_customize->add_control( 'rdc_footer_menu_label', array(
    'label'    => __( 'Footer Menu Label', 'rdc' ),
    'section'  => 'rdc_footer',
    'settings' => 'rdc_footer_menu_label',
    'type'     => 'text'
  ));

  $wp_customize->add_setting( 'rdc_footer_site_info_label', array(
    'default'   => '',
  ));

  $wp_customize->add_control( 'rdc_footer_site_info_label', array(
    'label'    => __( 'Site Info Label', 'rdc' ),
    'section'  => 'rdc_footer',
    'settings' => 'rdc_footer_site_info_label',
    'type'     => 'text'
  ));

  $wp_customize->add_setting( 'rdc_footer_site_info_text', array(
    'default'   => '',
    'transport' => 'postMessage'
  ));

  $wp_customize->add_control( new Madison_Customize_Textarea_Control( $wp_customize, 'rdc_footer_site_info_text', array(
    'label'    => 'Site Info Text',
    'section'  => 'rdc_footer',
    'settings' => 'rdc_footer_site_info_text',
  )));


  $wp_customize->add_setting( 'rdc_footer_contact_info_label', array(
    'default'   => '',
  ));

  $wp_customize->add_control( 'rdc_footer_contact_info_label', array(
    'label'    => __( 'Contact Info Label', 'rdc' ),
    'section'  => 'rdc_footer',
    'settings' => 'rdc_footer_contact_info_label',
    'type'     => 'text'
  ));

  $wp_customize->add_setting( 'rdc_footer_contact_info_text', array(
    'default'   => '',
    'transport' => 'postMessage'
  ));

  $wp_customize->add_control( new Madison_Customize_Textarea_Control( $wp_customize, 'rdc_footer_contact_info_text', array(
    'label'    => 'Contact Info Text',
    'section'  => 'rdc_footer',
    'settings' => 'rdc_footer_contact_info_text',
  )));

}

add_action( 'customize_register', 'rdc_customize_register', 99 );