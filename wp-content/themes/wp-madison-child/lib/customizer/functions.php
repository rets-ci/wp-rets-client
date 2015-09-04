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

}

add_action( 'customize_register', 'rdc_customize_register' );