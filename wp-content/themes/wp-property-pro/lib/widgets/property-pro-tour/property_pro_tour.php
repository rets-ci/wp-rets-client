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
          'label' => __('Title', 'wp-property-pro'),
        ],
        'subtitle' => [
          'type' => 'text',
          'label' => __('Subtitle', 'wp-property-pro'),
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