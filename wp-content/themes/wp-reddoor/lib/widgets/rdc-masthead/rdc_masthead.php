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

					'color' => array(
						'type' => 'color',
						'label' => __( 'Background color', 'so-widgets-bundle' ),
						'default' => '#333333',
					),
				),
			),
			'buttons' => array(
				'type' => 'section',
				'label' => __('Widget buttons', 'so-widgets-bundle'),
				'hide' => true,
				'fields' => array(
					'primary-button' => array(
						'type' => 'section',
						'label' => __('Primary button', 'so-widgets-bundle'),
						'hide' => true,
						'fields' => array(
							'btn_title' => array(
								'type' => 'text',
								'label' => __('Text button', 'so-widgets-bundle'),
							),

							'btn_url' => array(
								'type' => 'link',
								'label' => __('Destination URL', 'so-widgets-bundle'),
							),

							'btn_class' => array(
								'type' => 'text',
								'label' => __('Class button', 'so-widgets-bundle'),
								'description' => __('You can set few classes through space.', 'so-widgets-bundle'),
							),

							'btn_text_color' => array(
								'type' => 'color',
								'label' => __( 'Button text color', 'so-widgets-bundle' ),
								'default' => '#ffffff',
							),

							'btn_color' => array(
								'type' => 'color',
								'label' => __( 'Button color', 'so-widgets-bundle' ),
								'default' => '#333333',
							),

							'btn_align' => array(
								'type' => 'select',
								'label' => __('Align', 'so-widgets-bundle'),
								'default' => 'left',
								'options' => array(
									'left' => __('Left', 'so-widgets-bundle'),
									'right' => __('Right', 'so-widgets-bundle'),
								),
							),

							'btn_available' => array(
								'type' => 'checkbox',
								'default' => false,
								'label' => __('Enable primary button', 'so-widgets-bundle'),
							),

						),
					),

					'secondary-button' => array(
						'type' => 'section',
						'label' => __('Secondary button', 'so-widgets-bundle'),
						'hide' => true,
						'fields' => array(
							'btn_title_sec' => array(
								'type' => 'text',
								'label' => __('Text button', 'so-widgets-bundle'),
							),

							'btn_url_sec' => array(
								'type' => 'link',
								'label' => __('Destination URL', 'so-widgets-bundle'),
							),

							'btn_class_sec' => array(
								'type' => 'text',
								'label' => __('Class button', 'so-widgets-bundle'),
								'description' => __('You can set few classes through space.', 'so-widgets-bundle'),
							),

							'btn_text_color_sec' => array(
								'type' => 'color',
								'label' => __( 'Button text color', 'so-widgets-bundle' ),
								'default' => '#ffffff',
							),

							'btn_border_color_sec' => array(
								'type' => 'color',
								'label' => __( 'Button border color', 'so-widgets-bundle' ),
								'default' => '#333333',
							),

							'btn_border_size_sec' => array(
								'label' => __( 'Set border size', 'so-widgets-bundle' ),
								'type' => 'slider',
								'min' => 0,
								'max' => 10,
								'default' => 2,
							),

							'btn_align_sec' => array(
								'type' => 'select',
								'label' => __('Align', 'so-widgets-bundle'),
								'default' => 'right',
								'options' => array(
									'left' => __('Left', 'so-widgets-bundle'),
									'right' => __('Right', 'so-widgets-bundle'),
								),
							),

							'btn_available_sec' => array(
								'type' => 'checkbox',
								'default' => false,
								'label' => __('Enable secondary button', 'so-widgets-bundle'),
							),

						),
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
