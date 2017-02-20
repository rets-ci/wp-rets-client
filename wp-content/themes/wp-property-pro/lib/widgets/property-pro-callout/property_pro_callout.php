<?php
/*
Widget Name: Property Pro Callout
Description: A customizable callout widget.
Author: fq.jony@UD
Author URI:
*/

namespace UsabilityDynamics\PropertyPro\Widget\Callout {

  if (!class_exists('SiteOrigin_Widget')) include_once get_stylesheet_directory() . '/lib/widgets/property-pro-callout/base/property-pro-siteorigin-widget.class.php';

  class Property_Pro_Callout_Widget extends \SiteOrigin_Widget
  {
    function __construct()
    {

      parent::__construct(
        'porperty-pro-callout',
        __('Property Pro Callout', 'wp-property-pro'),
        [
          'description' => __('A customizable callout widget.', 'wp-property-pro'),
          'help' => 'https://siteorigin.com/widgets-bundle/button-widget-documentation/'
        ],
        [],
        false,
        get_template_directory_uri() . '/lib/widgets/property-pro-callout'
      );

    }

    function initialize()
    {
      $this->register_frontend_styles(
        [
          [
            'property-pro-callout-base',
            get_template_directory_uri() . '/lib/widgets/property-pro-callout/css/style.css',
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
          'label' => __('Title', 'wp-property-pro'),
        ],
        'button' => [
          'type' => 'section',
          'label' => __('Button', 'wp-property-pro'),
          'hide' => true,
          'fields' => [
            'label' => [
              'type' => 'text',
              'label' => __('Label', 'wp-property-pro'),
            ],
            'url' => [
              'type' => 'text',
              'default' => false,
              'label' => __('Url', 'wp-property-pro'),
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

  siteorigin_widget_register('property-pro-callout', __FILE__, 'UsabilityDynamics\PropertyPro\Widget\Callout\Property_Pro_Callout_Widget');

}