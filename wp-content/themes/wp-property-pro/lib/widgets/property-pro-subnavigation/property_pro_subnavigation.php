<?php
/*
Widget Name: Property Pro Subnavigation
Description: A customizable subnavigation widget.
Author: fq.jony@UD
Author URI:
*/


namespace UsabilityDynamics\PropertyPro\PropertyProSubnavigation {

  if (!class_exists('SiteOrigin_Widget')) include_once get_stylesheet_directory() . '/lib/widgets/property-pro-subnavigation/base/property-pro-siteorigin-widget.class.php';

  class Property_Pro_Subnavigation_Widget extends \SiteOrigin_Widget
  {

    function __construct()
    {

      parent::__construct(
        'porperty-pro-subnavigation',
        __('Property Pro Subnavigation', 'wp-property-pro'),
        [
          'description' => __('A customizable subnavigation widget.', 'wp-property-pro'),
          'help' => 'https://siteorigin.com/widgets-bundle/button-widget-documentation/'
        ],
        [],
        false,
        get_template_directory_uri().'/lib/widgets/property-pro-subnavigation'
      );

    }

    function initialize()
    {
      $this->register_frontend_styles(
        [
          [
            'property-pro-subnavigation-base',
            get_template_directory_uri().'/lib/widgets/property-pro-subnavigation/css/style.css',
            [],
            SOW_BUNDLE_VERSION
          ],
        ]
      );
    }

    function initialize_form()
    {
      $menus = [];
      foreach (get_terms('nav_menu', array('hide_empty' => true)) as $menu) {
        $menus[$menu->term_id] = $menu->name;
      }

      return [
        'layout' => [
          'type' => 'select',
          'label' => __('Layout', 'wp-property-pro'),
          'default' => 'text',
          'options' => [
            'text' => __('Text', 'wp-property-pro'),
            'icon' => __('Icon', 'wp-property-pro')
          ],
        ],
        'menu_select' => [
          'type' => 'select',
          'label' => __('Menu select', 'wp-property-pro'),
          'options' => $menus
        ]
      ];
    }

    function get_template_name($instance)
    {
      return 'base';
    }

  }

  siteorigin_widget_register('property-pro-subnavigation', __FILE__, 'UsabilityDynamics\PropertyPro\PropertyProSubnavigation\Property_Pro_Subnavigation_Widget');
}