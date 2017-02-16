<?php
/*
Widget Name: Property Pro Testimonials
Description: A customizable testimonials widget.
Author: fq.jony@UD
Author URI:
*/

if (!class_exists('SiteOrigin_Widget')) include_once get_stylesheet_directory() . '/lib/widgets/property-pro-testimonials/base/property-pro-siteorigin-widget.class.php';

class Property_Pro_Testimonials_Widget extends SiteOrigin_Widget
{

  const TESTIMONIALS_LIMIT = 3;

  function __construct()
  {

    parent::__construct(
      'porperty-pro-testimonials',
      __('Property Pro Testimonials', 'so-widgets-bundle'),
      [
        'description' => __('A customizable testimonials widget.', 'so-widgets-bundle'),
        'help' => 'https://siteorigin.com/widgets-bundle/button-widget-documentation/'
      ],
      [],
      false,
      get_stylesheet_directory_uri('/lib/widgets/property-pro-testimonials')
    );

  }

  function initialize()
  {
    $this->register_frontend_styles(
      [
        [
          'property-pro-testimonials-base',
          get_stylesheet_directory_uri('/lib/widgets/property-pro-testimonials/css/style.css'),
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
        'label' => __('Testimonial ' . $i, 'so-widgets-bundle'),
        'hide' => true,
        'fields' => [
          'title' => [
            'type' => 'text',
            'label' => __('Title', 'so-widgets-bundle')
          ],
          'subtitle' => [
            'type' => 'text',
            'label' => __('Subtitle', 'so-widgets-bundle')
          ],
          'review' => [
            'type' => 'text',
            'label' => __('Review', 'so-widgets-bundle')
          ],
          'image' => [
            'type' => 'media',
            'label' => __('Image', 'so-widgets-bundle'),
            'description' => __('Set backgound image file.', 'so-widgets-bundle'),
          ],
        ]

      ];
    }

    return [
      'layout' => [
        'type' => 'select',
        'label' => __('Layout', 'so-widgets-bundle'),
        'default' => 'default_layout',
        'options' => [
          'default_layout' => __('Default', 'so-widgets-bundle')
        ],
      ],
      'title' => [
        'type' => 'text',
        'label' => __('Title', 'so-widgets-bundle'),
      ],
      'testimonials' => [
        'type' => 'section',
        'label' => __('Search', 'so-widgets-bundle'),
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

siteorigin_widget_register('property-pro-testimonials', __FILE__, 'Property_Pro_Testimonials_Widget');
