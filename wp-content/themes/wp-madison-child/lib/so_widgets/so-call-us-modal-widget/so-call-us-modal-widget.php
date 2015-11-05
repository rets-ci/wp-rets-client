<?php
/*
Widget Name: Call Us Modal
Description: Display Modal with phone
Author: UsabilityDynamics, Inc.
Author URI: https://www.usabilitydynamics.com
*/

/**
 * Fix path to template file.
 */
add_filter( 'siteorigin_widgets_template_file_rdc-call-us-modal', function( $template_file, $instance, $object ){
	return get_stylesheet_directory() . '/lib/so_widgets/so-call-us-modal-widget' . $template_file;
}, 99, 3 );

class SiteOrigin_Widget_CallUs_Modal_Widget extends SiteOrigin_Widget {

	function __construct() {

		parent::__construct(
			'rdc-call-us-modal',
			__('RDC Call Us Modal', 'rdc'),
			array(
				'description' => __('Display call us modal.', 'rdc'),
				'has_preview' => false
			),
			array(),
			array(
				'label' => array(
					'type' => 'text',
					'label' => __( 'Phone', 'rdc' )
				)
			)
		);
	}

	function initialize() {

	}

	function get_template_name($instance){
		return 'base';
	}

	function get_style_name($instance){
		return false;
	}
}

siteorigin_widget_register('call-us-modal', __FILE__, 'SiteOrigin_Widget_CallUs_Modal_Widget');