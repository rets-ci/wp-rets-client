<?php
/*
Widget Name: RDC Masthead
Description: A customizable masthead widget.
Author:
Author URI:
*/

if( !class_exists( 'SiteOrigin_Widget' ) ) include_once get_stylesheet_directory().'/lib/widgets/rdc-masthead/base/rdc-siteorigin-widget.class.php';

class RDC_Masthead_Widget extends SiteOrigin_Widget {
	function __construct() {

		parent::__construct(
			'rdc-masthead',
			__('RDC Masthead', 'so-widgets-bundle'),
			array(
				'description' => __('A customizable masthead widget.', 'so-widgets-bundle'),
				'help' => 'https://siteorigin.com/widgets-bundle/button-widget-documentation/'
			),
			array(

			),
			false,
			get_stylesheet_directory_uri('/lib/widgets/rdc-masthead')
		);

	}

	function initialize() {
		$this->register_frontend_styles(
			array(
				array(
					'rdc-masthead-base',
					get_stylesheet_directory_uri('/lib/widgets/rdc-masthead/css/style.css'),
					array(),
					SOW_BUNDLE_VERSION
				),
			)
		);
	}

	function initialize_form() {
		return array(
			'title' => array(
				'type' => 'text',
				'label' => __('Title', 'so-widgets-bundle'),
			),

			'subtitle' => array(
				'type' => 'text',
				'label' => __('Subtitle', 'so-widgets-bundle'),
			),

			'searchbar' => array(
				'type' => 'checkbox',
				'default' => false,
				'label' => __('Display search-form', 'so-widgets-bundle'),
			),

			'button_icon' => array(
				'type' => 'section',
				'label' => __('Icon', 'so-widgets-bundle'),
				'fields' => array(
					'icon_selected' => array(
						'type' => 'icon',
						'label' => __('Icon', 'so-widgets-bundle'),
					),

					'icon_color' => array(
						'type' => 'color',
						'label' => __('Icon color', 'so-widgets-bundle'),
					),

					'icon' => array(
						'type' => 'media',
						'label' => __('Image icon', 'so-widgets-bundle'),
						'description' => __('Replaces the icon with your own image icon.', 'so-widgets-bundle'),
					),
				),
			),

			'background' => array(
				'type' => 'section',
				'label' => __('Background image', 'so-widgets-bundle'),
				'hide' => true,
				'fields' => array(
					'image' => array(
						'type' => 'media',
						'label' => __('Image', 'so-widgets-bundle'),
						'description' => __('Set backgound image file.', 'so-widgets-bundle'),
					),

				),
			),
		);
	}

	function get_template_name($instance) {
		return 'base';
	}



}

siteorigin_widget_register('rdc-masthead', __FILE__, 'RDC_Masthead_Widget');
