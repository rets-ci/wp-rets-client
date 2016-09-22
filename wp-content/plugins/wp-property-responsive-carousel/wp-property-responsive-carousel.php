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
      'wp-property-responsive-carousel',
      __('WP-Property Responsive Carousel', 'ud'),
      array(
        'description' => __('Display your properties as a carousel.', 'ud'),
        'has_preview' => false
      ),
      array(

      ),
      array(
        'posts' => array(
          'type' => 'posts',
          'label' => __('Posts query', 'so-widgets-bundle'),
          'description' => __('Note, only properties are available. Other posts types will be replaced with property type', 'ud'),
        ),
        'Description' => array(
          'type' => 'tinymce',
          'label' => __( 'Description', 'ud' ),
        ),
        'Callout_card' => array(
            'type' => 'section',
            'label' => __('Callout card', 'ud'),
            'fields' => array(
                'available' => array(
                    'type' => 'checkbox',
                    'label' => __( 'Enabled/Disabled callout card', 'ud' ),
                ),

                'title' => array(
                    'type' => 'text',
                    'label' => __( 'Title', 'ud' ),
                ),

                'primary-button-label' => array(
                    'type' => 'text',
                    'label' => __( 'Primary button label', 'ud' ),
                ),

                'primary-button-url' => array(
                    'type' => 'text',
                    'label' => __( 'Primary button url', 'ud' ),
                ),

                'secondary-button-label' => array(
                    'type' => 'text',
                    'label' => __( 'Secondary button label', 'ud' ),
                ),

                'secondary-button-url' => array(
                    'type' => 'text',
                    'label' => __( 'Secondary button url', 'ud' ),
                ),

            ),
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
    // Style moved to theme 
    //$this->register_frontend_styles(
    //  array(
    //    array(
    //      'ud-carousel-basic',
    //      plugin_dir_url(__FILE__) . 'css/style.css',
    //      array(),
    //      rand( 10000, 99999 ),
    //    )
    //  )
    //);
  }

  function get_template_name($instance){
    return 'base';
  }

  function get_style_name($instance){
    return false;
  }
}

