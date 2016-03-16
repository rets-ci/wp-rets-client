<?php
/*
Plugin Name: Property carousel
Description: Gives you possibility to display your properties as a carousel.
Version: 1.0
Author: UsabilityDynamics, Inc.
Author URI: https://www.usabilitydynamics.com
*/

add_action('widgets_init', function () {
  register_widget('SiteOrigin_Widget_PropertyCarousel_Widget');
});

class SiteOrigin_Widget_PropertyCarousel_Widget extends SiteOrigin_Widget {
  function __construct() {

    $attributes = array(
      '0' => 'Not Selected',
    );
    $sattrs = ud_get_wp_property( 'searchable_attributes', array() );
    if( !empty( $sattrs ) && is_array( $sattrs ) ) {
      foreach( $sattrs as $k ) {
        $attributes[ $k ] =  ud_get_wp_property( "property_stats.{$k}", "No label" );
      }
    }
    $attributes['s'] = __('Full Text', 'rdc');

    $types = array(
      'range_dropdown' => 'Range Dropdown',
      'dropdown' => 'Dropdown',
      'input' => 'Text Input'
    );

    parent::__construct(
      'rdc-property-carousel',
      __('RDC Property Carousel', 'rdc'),
      array(
        'description' => __('Display your properties as a carousel.', 'rdc'),
        'has_preview' => false
      ),
      array(),
      array(
        'filter1' => array(
          'type' => 'select',
          'label' => __( 'Filter 1', 'rdc' ),
          'options' => $attributes
        ),
        'filter1_type' => array(
          'type' => 'select',
          'label' => __( 'Filter 1 Type', 'rdc' ),
          'options' => $types
        ),
        'filter1_default' => array(
          'type' => 'text',
          'label' => __( 'Filter 1 Default Value', 'rdc' )
        ),
        'filter2' => array(
          'type' => 'select',
          'label' => __( 'Filter 2', 'rdc' ),
          'options' => $attributes
        ),
        'filter2_type' => array(
          'type' => 'select',
          'label' => __( 'Filter 2 Type', 'rdc' ),
          'options' => $types
        ),
        'filter2_default' => array(
          'type' => 'text',
          'label' => __( 'Filter 2 Default Value', 'rdc' )
        ),
        'filter3' => array(
          'type' => 'select',
          'label' => __( 'Filter 3', 'rdc' ),
          'options' => $attributes
        ),
        'filter3_type' => array(
          'type' => 'select',
          'label' => __( 'Filter 3 Type', 'rdc' ),
          'options' => $types
        ),
        'filter3_default' => array(
          'type' => 'text',
          'label' => __( 'Filter 3 Default Value', 'rdc' )
        ),
      )
    );
  }

  function initialize() {
    $this->register_frontend_scripts(
      array(
        array(
          'touch-swipe',
          plugin_dir_path() . '/ud-property-carousel/js/jquery.touchSwipe.min.js',
          array( 'jquery' ),
          '1.6.6'
        ),
        array(
          'rdc-carousel-basic',
          plugin_dir_path() . '/ud-property-carousel/js/carousel.js',
          array( 'jquery', 'touch-swipe' ),
          '1.4.4',
          true
        )
      )
    );
    $this->register_frontend_styles(
      array(
        array(
          'rdc-carousel-basic',
          plugin_dir_path() . '/ud-property-carousel/css/style.css',
          array(),
          rand( 10000, 99999 ),
        )
      )
    );
  }

  function get_template_name($instance){
    return 'base';
  }

  function get_style_name($instance){
    return false;
  }
}

