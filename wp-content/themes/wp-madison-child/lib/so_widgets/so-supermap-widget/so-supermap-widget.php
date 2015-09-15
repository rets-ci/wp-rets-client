<?php
/*
Widget Name: Supermap Widget
Description: Display RDC Supermap
Author: UsabilityDynamics, Inc.
Author URI: https://www.usabilitydynamics.com
*/

/**
 * Fix path to template file.
 */
add_filter( 'siteorigin_widgets_template_file_rdc-supermap', function( $template_file, $instance, $object ){
	return get_stylesheet_directory() . '/lib/so_widgets/so-supermap-widget' . $template_file;
}, 99, 3 );

class SiteOrigin_Widget_Supermap_Widget extends SiteOrigin_Widget {

	function __construct() {

		parent::__construct(
			'rdc-supermap',
			__('RDC Supermap', 'rdc'),
			array(
				'description' => __('Display RDC Supermap.', 'rdc'),
				'has_preview' => false
			),
			array(),
			array(
				'label' => array(
					'type' => 'text',
					'label' => __( 'Label', 'rdc' )
				),
				'tagline' => array(
					'type' => 'text',
					'label' => __( 'Tagline', 'rdc' )
				),
			)
		);
	}

	function initialize() {
		$this->register_frontend_scripts(
			array(
				array(
					'rdc-supermap-widget',
					get_stylesheet_directory_uri() . '/lib/so_widgets/so-supermap-widget/js/supermap.js',
					array( 'jquery' ),
					'1.0',
					true
				)
			)
		);
		$this->register_frontend_styles(
			array(
				array(
					'rdc-supermap-widget',
					get_stylesheet_directory_uri() . '/lib/so_widgets/so-supermap-widget/css/style.css',
					array(),
					'1.0',
				)
			)
		);
	}

	function get_template_name($instance){
		return 'base';
	}

	function get_style_name($instance){
		return false;
	}
}

siteorigin_widget_register('supermap', __FILE__);