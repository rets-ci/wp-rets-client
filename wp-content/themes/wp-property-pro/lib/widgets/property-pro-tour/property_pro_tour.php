<?php
/*
Widget Name: Property Pro Tour
Description: A customizable tour widget.
Author: fq.jony@UD
Author URI:
*/

namespace UsabilityDynamics\PropertyPro\Widget\Tour {

  if (!class_exists('SiteOrigin_Widget')) include_once get_stylesheet_directory() . '/lib/widgets/property-pro-tour/base/property-pro-siteorigin-widget.class.php';

  class Property_Pro_Tour_Widget extends \SiteOrigin_Widget
  {
    function __construct()
    {

      parent::__construct(
        'porperty-pro-tour',
        __('Property Pro Tour', 'wp-property-pro'),
        [
          'description' => __('A customizable tour widget.', 'wp-property-pro'),
          'help' => 'https://siteorigin.com/widgets-bundle/button-widget-documentation/'
        ],
        [],
        false,
        get_template_directory_uri() . '/lib/widgets/property-pro-tour'
      );

    }

    function initialize()
    {
      $this->register_frontend_styles(
        [
          [
            'property-pro-tour-base',
            get_template_directory_uri() . '/lib/widgets/property-pro-tour/css/style.css',
            [],
            SOW_BUNDLE_VERSION
          ],
        ]
      );
    }

    function initialize_form()
    {
      return [
        'layout' => [
          'type' => 'select',
          'label' => __('Layout', 'wp-property-pro'),
          'default' => 'default_layout',
          'options' => [
            'default_layout' => __('Default layout', 'wp-property-pro')
          ],
        ],
        'title' => [
          'type' => 'text',
          'label' => __('Title', 'wp-property-pro')
        ],
        'subtitle' => [
          'type' => 'text',
          'label' => __('Subtitle', 'wp-property-pro')
        ],
        'feature_groups' => [
          'type' => 'repeater',
          'label' => __('Feature groups', 'wp-property-pro'),
          'item_name' => __('Feature group', 'wp-property-pro'),
          'fields' => [
            'layout' => [
              'type' => 'select',
              'label' => __('Layout', 'wp-property-pro'),
              'default' => 'left',
              'options' => [
                'left' => __('Text Block on Left', 'wp-property-pro'),
                'right' => __('Text Block on Right', 'wp-property-pro'),
              ]
            ],
            'background' => [
              'type' => 'select',
              'label' => __('Background', 'wp-property-pro'),
              'default' => 'part',
              'options' => [
                'part' => __('Style 1', 'wp-property-pro'),
                'full' => __('Style 2', 'wp-property-pro'),
              ]
            ],
            'image_section' => [
              'type' => 'section',
              'label' => __('Image', 'wp-property-pro'),
              'hide' => true,
              'fields' => [
                'image' => [
                  'type' => 'media',
                  'label' => __('Background Image', 'wp-property-pro'),
                  'description' => __('Set background image file.', 'wp-property-pro'),
                ],

                'image_position' => [
                  'type' => 'select',
                  'label' => __('Background image position', 'wp-property-pro'),
                  'default' => 'left_top',
                  'options' => [
                    'left_top' => __('left_top', 'wp-property-pro'),
                    'left_center' => __('left_center', 'wp-property-pro'),
                    'left_bottom' => __('left_bottom', 'wp-property-pro'),
                    'right_top' => __('right_top', 'wp-property-pro'),
                    'right_center' => __('right_center', 'wp-property-pro'),
                    'right_bottom' => __('right_bottom', 'wp-property-pro'),
                    'center_top' => __('center_top', 'wp-property-pro'),
                    'center_center' => __('center_center', 'wp-property-pro'),
                    'center_bottom' => __('center_bottom', 'wp-property-pro'),
                  ]
                ]
              ]
            ],
            'features' => [
              'type' => 'repeater',
              'label' => __('Features', 'wp-property-pro'),
              'item_name' => __('Feature', 'wp-property-pro'),
              'fields' => [
                'title' => [
                  'type' => 'text',
                  'label' => __('Title', 'wp-property-pro')
                ],
                'description' => [
                  'type' => 'text',
                  'label' => __('Description', 'wp-property-pro')
                ],
                'button_section' => [
                  'type' => 'section',
                  'label' => __('Button', 'wp-property-pro'),
                  'hide' => true,
                  'fields' => [
                    'label' => [
                      'type' => 'text',
                      'label' => __('Label', 'wp-property-pro')
                    ],
                    'url' => [
                      'type' => 'text',
                      'label' => __('Url', 'wp-property-pro')
                    ]
                  ]
                ],
                'testimonial_section' => [
                  'type' => 'section',
                  'label' => __('Testimonial', 'wp-property-pro'),
                  'hide' => true,
                  'fields' => [
                    'review' => [
                      'type' => 'text',
                      'label' => __('Review', 'wp-property-pro')
                    ],
                    'name' => [
                      'type' => 'text',
                      'label' => __('Name', 'wp-property-pro')
                    ],
                    'location' => [
                      'type' => 'text',
                      'label' => __('Location', 'wp-property-pro')
                    ],
                    'image' => [
                      'type' => 'media',
                      'label' => __('Background Image', 'wp-property-pro'),
                      'description' => __('Set testimonial image file.', 'wp-property-pro'),
                    ]
                  ]
                ]
              ]
            ]
          ]
        ]
      ];
    }

    function get_template_name($instance)
    {
      return 'base';
    }

  }

  siteorigin_widget_register('property-pro-tour', __FILE__, 'UsabilityDynamics\PropertyPro\Widget\Tour\Property_Pro_Tour_Widget');

}