<?php
/*
Widget Name: Property Pro Testimonials
Description: A customizable testimonials widget.
Author: fq.jony@UD
Author URI:
*/

namespace UsabilityDynamics\PropertyPro\Widget\Testimonials {

  if (!class_exists('SiteOrigin_Widget')) include_once get_stylesheet_directory() . '/lib/widgets/property-pro-testimonials/base/property-pro-siteorigin-widget.class.php';

  class Property_Pro_Testimonials_Widget extends \SiteOrigin_Widget
  {

    const TESTIMONIALS_LIMIT = 3;

    function __construct()
    {

      parent::__construct(
        'porperty-pro-testimonials',
        __('Property Pro Testimonials', 'wp-property-pro'),
        [
          'description' => __('A customizable testimonials widget.', 'wp-property-pro'),
          'help' => 'https://siteorigin.com/widgets-bundle/button-widget-documentation/'
        ],
        [],
        false,
        get_template_directory_uri().'/lib/widgets/property-pro-testimonials'
      );

    }

    function initialize()
    {
      $this->register_frontend_styles(
        [
          [
            'property-pro-testimonials-base',
            get_template_directory_uri().'/lib/widgets/property-pro-testimonials/css/style.css',
            [],
            SOW_BUNDLE_VERSION
          ],
        ]
      );
    }

    function initialize_form()
    {

      $testimonials = [];
      for ($i = 1; $i <= self::TESTIMONIALS_LIMIT; $i++) {
        $testimonials[] = [
          'type' => 'section',
          'label' => __('Testimonial', 'wp-property-pro'),
          'hide' => true,
          'fields' => [
            'title' => [
              'type' => 'text',
              'label' => __('Title', 'wp-property-pro')
            ],
            'subtitle' => [
              'type' => 'text',
              'label' => __('Subtitle', 'wp-property-pro')
            ],
            'review' => [
              'type' => 'text',
              'label' => __('Review', 'wp-property-pro')
            ],
            'image' => [
              'type' => 'media',
              'label' => __('Image', 'wp-property-pro'),
              'description' => __('Set background image file.', 'wp-property-pro'),
            ],
          ]

        ];
      }

      return [
        'layout' => [
          'type' => 'select',
          'label' => __('Layout', 'wp-property-pro'),
          'default' => 'default_layout',
          'options' => [
            'default_layout' => __('Default', 'wp-property-pro')
          ],
        ],
        'title' => [
          'type' => 'text',
          'label' => __('Title', 'wp-property-pro'),
        ],
        'testimonials' => [
          'type' => 'section',
          'label' => __('Search', 'wp-property-pro'),
          'hide' => false,
          'fields' => $testimonials
        ]
      ];
    }

    function get_template_name($instance)
    {
      return 'base';
    }

  }

  siteorigin_widget_register('property-pro-testimonials', __FILE__, 'UsabilityDynamics\PropertyPro\Widget\Testimonials\Property_Pro_Testimonials_Widget');
}