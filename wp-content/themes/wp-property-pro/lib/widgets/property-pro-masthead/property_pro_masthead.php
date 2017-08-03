<?php
/*
Widget Name: Property Pro Masthead
Description: A customizable masthead widget.
Author: fq.jony@UD
Author URI:
*/

namespace UsabilityDynamics\PropertyPro\Widget\Masthead {

  if (!class_exists('SiteOrigin_Widget')) include_once get_stylesheet_directory() . '/lib/widgets/property-pro-masthead/base/property-pro-siteorigin-widget.class.php';

  class Property_Pro_Masthead_Widget extends \SiteOrigin_Widget
  {
    function __construct()
    {

      parent::__construct(
        'porperty-pro-masthead',
        __('Property Pro Masthead', 'wp-property-pro'),
        [
          'description' => __('A customizable masthead widget.', 'wp-property-pro'),
          'help' => 'https://siteorigin.com/widgets-bundle/button-widget-documentation/'
        ],
        [],
        false,
        get_template_directory_uri() . '/lib/widgets/property-pro-masthead'
      );

      /** Disable widget styles panel */
      add_filter('siteorigin_panels_widget_style_fields', '__return_false', 11);

    }

    function initialize()
    {
      $this->register_frontend_styles(
        [
          [
            'property-pro-masthead-base',
            get_template_directory_uri() . '/lib/widgets/property-pro-masthead/css/style.css',
            [],
            SOW_BUNDLE_VERSION
          ],
        ]
      );
    }

    function initialize_form()
    {

      $taxonomy = 'wpp_listing_type';

      $search_options = [];
      $delimiter = '-';

      $all_property_types = array_map(function($t){
        return $t->slug;
      }, array_filter(get_terms(['taxonomy' => $taxonomy, 'hide_empty' => false ]), function($t){
        return $t->parent;
      }));

      /** Build search options array */
      foreach ([
                 'Rent',
                 'Sale',
                 'Land',
                 'Commercial'
               ] as $label) {


        $sale_type = $label;
        if (in_array($label, ['Rent', 'Sale']))
          $key = implode($delimiter, $all_property_types);
        else {
          $term = get_term_by('slug', $label, $taxonomy);
          $types = array_map(function ($id) use ($taxonomy) {
            return get_term_by('id', $id, $taxonomy)->slug;
          }, get_term_children($term->term_id, $taxonomy));
          $key = implode($delimiter, $types);
          $sale_type = 'Sale';
        }

        $search_options[$label . $delimiter . $sale_type . $delimiter . strtolower($key)] = [
          'type' => 'checkbox',
          'default' => false,
          'label' => __($label, 'wp-property-pro'),
        ];
      }

      return [
        'layout' => [
          'type' => 'select',
          'label' => __('Layout', 'wp-property-pro'),
          'default' => 'search_layout',
          'options' => [
            'title_description_layout' => __('Title, Subtitle', 'wp-property-pro'),
            'subtitle_title_layout' => __('Subtitle, Title', 'wp-property-pro'),
          ],
        ],

        'title' => [
          'type' => 'text',
          'label' => __('Title', 'wp-property-pro'),
        ],

        'subtitle' => [
          'type' => 'text',
          'label' => __('Subtitle', 'wp-property-pro'),
        ],

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
          ],
        ],

        'search_options' => [
          'type' => 'section',
          'label' => __('Search', 'wp-property-pro'),
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

  siteorigin_widget_register('property-pro-masthead', __FILE__, 'UsabilityDynamics\PropertyPro\Widget\Masthead\Property_Pro_Masthead_Widget');

}