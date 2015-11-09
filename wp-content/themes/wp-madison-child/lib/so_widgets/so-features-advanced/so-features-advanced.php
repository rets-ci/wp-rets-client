<?php
/*
Widget Name: Features Advanced Widget
Description: The same as features but with textarea
Author: UsabilityDynamics, Inc.
Author URI: https://www.usabilitydynamics.com
*/

add_filter( 'siteorigin_widgets_template_file_rdc-features-advanced', function( $template_file, $instance, $object ){
  return get_stylesheet_directory() . '/lib/so_widgets/so-features-advanced' . $template_file;
}, 99, 3 );

class SiteOrigin_Widget_Features_Advanced_Widget extends SiteOrigin_Widget {

  public function __construct() {
    parent::__construct(
        'rdc-features-advanced',
        __( 'RDC Features Advanced', 'so-widgets-bundle' ),
        array(
            'description' => __( 'Displays a list of features with textarea.', 'so-widgets-bundle' ),
            'help'        => 'https://siteorigin.com/widgets-bundle/features-widget-documentation/'
        ),
        array(),
        array(

            'global_title' => array(
              'type' => 'text',
              'label' => __( 'Global Widget Title', 'so-widgets-bundle' )
            ),

            'global_subtitle' => array(
                'type' => 'text',
                'label' => __( 'Global Sub Title', 'so-widgets-bundle' )
            ),

            'features' => array(
                'type' => 'repeater',
                'label' => __('Features', 'so-widgets-bundle'),
                'item_name' => __('Feature', 'so-widgets-bundle'),
                'item_label' => array(
                    'selector' => "[id*='features-title']",
                    'update_event' => 'change',
                    'value_method' => 'val'
                ),
                'fields' => array(

                  // The container shape

                    'container_color' => array(
                        'type' => 'color',
                        'label' => __('Container color', 'so-widgets-bundle'),
                        'default' => '#404040',
                    ),

                  // The Icon

                    'icon' => array(
                        'type' => 'icon',
                        'label' => __('Icon', 'so-widgets-bundle'),
                    ),

                    'icon_color' => array(
                        'type' => 'color',
                        'label' => __('Icon color', 'so-widgets-bundle'),
                        'default' => '#FFFFFF',
                    ),

                    'icon_image' => array(
                        'type' => 'media',
                        'library' => 'image',
                        'label' => __('Icon image', 'so-widgets-bundle'),
                        'description' => __('Use your own icon image.', 'so-widgets-bundle'),
                    ),

                    'rdc_icon' => array(
                      'type' => 'select',
                      'label' => __('RDC Specific Icon', 'so-widgets-bundle'),
                      'default' => '',
                      'options' => array(
                        '' => __( 'None', 'so-widgets-bundle'),
                        'pen_agreement' => __('Pen and Agreement', 'so-widgets-bundle'),
                        'building' => __('Building', 'so-widgets-bundle'),
                        'letter-search' => __( 'Letter and Search', 'so-widgets-bundle' ),
                        'people-search' => __( 'People Search', 'so-widgets-bundle' ),
                        'compliance' => __( 'Compliance', 'so-widgets-bundle' ),
                        'leases-breaches' => __( 'Leases and Breaches', 'so-widgets-bundle' ),
                        'money-in-out' => __( 'Money In Out', 'so-widgets-bundle' ),
                        'repair' => __( 'Repair', 'so-widgets-bundle' ),
                        'online-tenant-portal' => __( 'Online Tenant Portal', 'so-widgets-bundle' ),
                        'emergency-response' => __( 'Emergency Response', 'so-widgets-bundle' ),
                        'transparency' => __( 'Transparency', 'so-widgets-bundle' ),
                        'customer-service' => __( 'Customer Service', 'so-widgets-bundle' ),
                        'professional-service' => __( 'Professional Service', 'so-widgets-bundle' )
                      )
                    ),

                    'icon_position' => array(
                      'type' => 'select',
                      'label' => __('Icon Position', 'so-widgets-bundle'),
                      'default' => 'left',
                      'options' => array(
                        'left' => __( 'Left', 'so-widgets-bundle' ),
                        'top' => __( 'Top', 'so-widgets-bundle' )
                      )
                    ),

                  // The text under the icon

                    'title' => array(
                        'type' => 'text',
                        'label' => __('Title text', 'so-widgets-bundle'),
                    ),

                    'text' => array(
                        'type' => 'tinymce',
                        'label' => __('Text', 'so-widgets-bundle')
                    ),

                    'more_text' => array(
                        'type' => 'text',
                        'label' => __('More link text', 'so-widgets-bundle'),
                    ),

                    'more_url' => array(
                        'type' => 'link',
                        'label' => __('More link URL', 'so-widgets-bundle'),
                    ),
                ),
            ),

            'container_shape' => array(
                'type' => 'select',
                'label' => __('Container shape', 'so-widgets-bundle'),
                'default' => 'round',
                'options' => array(
                ),
            ),

            'container_size' => array(
                'type' => 'number',
                'label' => __('Container size', 'so-widgets-bundle'),
                'default' => 84,
            ),

            'icon_size' => array(
                'type' => 'number',
                'label' => __('Icon size', 'so-widgets-bundle'),
                'default' => 24,
            ),

            'per_row' => array(
                'type' => 'number',
                'label' => __('Features per row', 'so-widgets-bundle'),
                'default' => 3,
            ),

            'responsive' => array(
                'type' => 'checkbox',
                'label' => __('Responsive layout', 'so-widgets-bundle'),
                'default' => true,
            ),

            'title_link' => array(
                'type' => 'checkbox',
                'label' => __('Link feature title to more URL', 'so-widgets-bundle'),
                'default' => false,
            ),

            'icon_link' => array(
                'type' => 'checkbox',
                'label' => __('Link icon to more URL', 'so-widgets-bundle'),
                'default' => false,
            ),

            'new_window' => array(
                'type' => 'checkbox',
                'label' => __('Open more URL in a new window', 'so-widgets-bundle'),
                'default' => false,
            ),

        ),
        plugin_dir_path(__FILE__).'../'
    );
  }

  function initialize() {

  }

  function get_style_name($instance){
    return false;
  }

  function get_template_name($instance){
    return 'base';
  }

  function modify_form( $form ){
    $form['container_shape']['options'] = include dirname( __FILE__ ) . '/inc/containers.php';
    return $form;
  }

  public function widget_url() {
    return get_stylesheet_directory_uri().'/lib/so_widgets/so-features-advanced/';
  }
}

siteorigin_widget_register('features-advanced', __FILE__, 'SiteOrigin_Widget_Features_Advanced_Widget');