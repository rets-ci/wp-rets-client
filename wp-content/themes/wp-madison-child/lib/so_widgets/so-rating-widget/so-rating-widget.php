<?php
/*
Widget Name: Rating Widget
Description: Display RDC Rating
Author: UsabilityDynamics, Inc.
Author URI: https://www.usabilitydynamics.com
*/

/**
 * Fix path to template file.
 */
add_filter( 'siteorigin_widgets_template_file_rdc-rating', function( $template_file, $instance, $object ){
	return get_stylesheet_directory() . '/lib/so_widgets/so-rating-widget' . $template_file;
}, 99, 3 );

class SiteOrigin_Widget_Rating_Widget extends SiteOrigin_Widget {

	function __construct() {

		parent::__construct(
			'rdc-rating',
			__('RDC Rating', 'rdc'),
			array(
				'description' => __('Display RDC Rating.', 'rdc'),
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
					'rdc-rating-widget',
					get_stylesheet_directory_uri() . '/lib/so_widgets/so-rating-widget/js/rating.js',
					array( 'jquery' ),
					'1.0',
					true
				)
			)
		);
		$this->register_frontend_styles(
			array(
				array(
					'rdc-rating-widget',
					get_stylesheet_directory_uri() . '/lib/so_widgets/so-rating-widget/css/style.css',
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

siteorigin_widget_register('rating', __FILE__);