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

    /** @TODO get dynamic properties types and sale types */
//    $property_types = [];
//    foreach ([
//               'Rent' => 'Rent',
//               'Sale' => 'Buy',
//               'Land' => 'Land',
//               'Commercial' => 'Commercial'
//             ] as $key => $label) {
//      $property_types[$key] = [
//        'type' => 'checkbox',
//        'default' => false,
//        'label' => __($label, 'so-widgets-bundle'),
//      ];
//    }

    return [
      'layout' => [
        'type' => 'select',
        'label' => __('Layout', 'so-widgets-bundle'),
        'default' => 'option_1',
        'options' => [
          'option_1' => __('Option 1', 'so-widgets-bundle'),
          'option_2' => __('Option 2', 'so-widgets-bundle'),
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

//      'property_types' => [
//        'type' => 'section',
//        'label' => __('Search', 'so-widgets-bundle'),
//        'hide' => true,
//        'fields' => $property_types
//      ]
    ];
  }

  function get_template_name($instance)
  {
    return 'base';
  }

}

siteorigin_widget_register('property-pro-masthead', __FILE__, 'Property_Pro_Masthead_Widget');
