<?php
/*
Widget Name: Property Pro Listing Carousel
Description: A customizable listing widget.
Author: fq.jony@UD
Author URI:
*/

namespace UsabilityDynamics\PropertyPro\Widget\ListingCarousel {

  if (!class_exists('SiteOrigin_Widget')) include_once get_stylesheet_directory() . '/lib/widgets/property-pro-listing-carousel/base/property-pro-siteorigin-widget.class.php';

  class Property_Pro_Listing_Carousel_Widget extends \SiteOrigin_Widget
  {
    function __construct()
    {

      parent::__construct(
        'porperty-pro-listing-carousel',
        __('Property Pro Listing Carousel', 'wp-property-pro'),
        [
          'description' => __('A customizable listing carousel widget.', 'wp-property-pro'),
          'help' => 'https://siteorigin.com/widgets-bundle/button-widget-documentation/'
        ],
        [],
        false,
        get_template_directory_uri() . '/lib/widgets/property-pro-listing-carousel'
      );

    }

    function initialize()
    {
      $this->register_frontend_styles(
        [
          [
            'property-pro-listing-carousel-base',
            get_template_directory_uri() . '/lib/widgets/property-pro-listing-carousel/css/style.css',
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

  siteorigin_widget_register('property-pro-listing-carousel', __FILE__, 'UsabilityDynamics\PropertyPro\Widget\ListingCarousel\Property_Pro_Listing_Carousel_Widget');

}