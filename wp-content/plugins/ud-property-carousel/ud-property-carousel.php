<?php
/*
Plugin Name: Property carousel
Description: Gives you possibility to display your properties as a carousel.
Version: 1.0
Author: UsabilityDynamics, Inc.
Author URI: https://www.usabilitydynamics.com
*/



add_action('widgets_init', function () {
  require_once 'so-property-carousel-widget.php';
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

    //die( '<pre>' . print_r( $attributes, true ) . '</pre>' );

    $attributes['s'] = __('Full Text', 'ud');

    $types = array(
      'range_dropdown' => 'Range Dropdown',
      'dropdown' => 'Dropdown',
      'input' => 'Text Input'
    );

    parent::__construct(
      'ud-property-carousel',
      __('UD Property Carousel', 'ud'),
      array(
        'description' => __('Display your properties as a carousel.', 'ud'),
        'has_preview' => false
      ),
      array(),
      array(
        'Description' => array(
          'type' => 'tinymce',
          'label' => __( 'Description', 'ud' ),
        ),
      )
    );
  }

  function initialize() {
    $this->register_frontend_scripts(
      array(
        array(
          'touch-swipe',
          plugin_dir_url(__FILE__) . 'js/jquery.touchSwipe.min.js',
          array( 'jquery' ),
          '1.6.6'
        ),
        array(
          'ud-carousel-basic',
          plugin_dir_url(__FILE__) . 'js/carousel.js',
          array( 'jquery', 'touch-swipe' ),
          '1.4.4',
          true
        )
      )
    );
    $this->register_frontend_styles(
      array(
        array(
          'ud-carousel-basic',
          plugin_dir_url(__FILE__) . 'css/style.css',
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

