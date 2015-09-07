<?php
/**
 * Madison Theme Customizer
 *
 */


/**
 * Add custom options to the theme customizer.
 */
function rdc_customize_register( $wp_customize ) {

  $wp_customize->add_section( 'rdc_search', array(
    'title'       => __( 'Multipurpose Search', 'madison' ),
    'description' => __( 'Control a multipurpose search form in a header.', 'madison' ),
    'priority'    => 61
  ));

  $wp_customize->add_setting( 'madison_multipurpose_search_enable', array(
    'default'              => ''
  ));

  $wp_customize->add_control( 'madison_multipurpose_search_enable', array(
    'label'   => __( 'Enable Multipurpose Search', 'madison' ),
    'section' => 'rdc_search',
    'type'    => 'checkbox',
    'settings' => 'madison_multipurpose_search_enable'
  ));

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

}

add_action( 'customize_register', 'rdc_customize_register' );