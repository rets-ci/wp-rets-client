<?php
/*
Widget Name: Property Pro Masthead
Description: A customizable masthead widget.
Author: fq.jony@UD
Author URI:
*/

if (!class_exists('SiteOrigin_Widget')) include_once get_stylesheet_directory() . '/lib/widgets/property-pro-masthead/base/rdc-siteorigin-widget.class.php';

class Property_Pro_Masthead_Widget extends SiteOrigin_Widget
{
  function __construct()
  {

    parent::__construct(
      'porperty-pro-masthead',
      __('Property Pro Masthead', 'so-widgets-bundle'),
      [
        'description' => __('A customizable masthead widget.', 'so-widgets-bundle'),
        'help' => 'https://siteorigin.com/widgets-bundle/button-widget-documentation/'
      ],
      [],
      false,
      get_stylesheet_directory_uri('/lib/widgets/property-pro-masthead')
    );

  }

  function initialize()
  {
    $this->register_frontend_styles(
      [
        [
          'property-pro-masthead-base',
          get_stylesheet_directory_uri('/lib/widgets/property-pro-masthead/css/style.css'),
          [],
          SOW_BUNDLE_VERSION
        ],
      ]
    );
  }

  function initialize_form()
  {
    global $wp_properties;

    $general_property_types = array_filter($wp_properties['property_types'], function ($type) {
      return !in_array($type, ['Land', 'Commercial']);
    });

    $excluded_property_types = array_filter($wp_properties['property_types'], function ($type) {
      return in_array($type, ['Land', 'Commercial']);
    });

    $search_options = [];
    $delimiter = '-';
    foreach ([
               'Rent',
               'Sale',
               'Land',
               'Commercial'
             ] as $label) {

      $sale_type = $label;
      if (in_array($label, ['Rent', 'Sale']))
        $key = implode($delimiter, $general_property_types);
      else {
        $key = $excluded_property_types[strtolower($label)];
        $sale_type = 'Sale';
      }


      $search_options[$label . $delimiter . $sale_type . $delimiter . strtolower($key)] = [
        'type' => 'checkbox',
        'default' => false,
        'label' => __($label, 'so-widgets-bundle'),
      ];
    }

    return [
      'layout' => [
        'type' => 'select',
        'label' => __('Layout', 'so-widgets-bundle'),
        'default' => 'search_layout',
        'options' => [
          'search_layout' => __('Search layout', 'so-widgets-bundle'),
          'text_layout' => __('Text layout', 'so-widgets-bundle'),
        ],
      ],

      'title' => [
        'type' => 'text',
        'label' => __('Title', 'so-widgets-bundle'),
      ],

      'subtitle' => [
        'type' => 'text',
        'label' => __('Subtitle', 'so-widgets-bundle'),
      ],

      'image' => [
        'type' => 'media',
        'label' => __('Image', 'so-widgets-bundle'),
        'description' => __('Set backgound image file.', 'so-widgets-bundle'),
      ],

      'search_options' => [
        'type' => 'section',
        'label' => __('Search', 'so-widgets-bundle'),
        'hide' => true,
        'fields' => $search_options
      ]
    ];
  }

  function get_template_name($instance)
  {
    return 'base';
  }

}

siteorigin_widget_register('property-pro-masthead', __FILE__, 'Property_Pro_Masthead_Widget');
