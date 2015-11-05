<?php
/*
Widget Name: Selected Posts Widget
Description: Display selected featured posts (articles)
Author: UsabilityDynamics, Inc.
Author URI: https://www.usabilitydynamics.com
*/

/**
 * Fix path to template file.
 */
add_filter( 'siteorigin_widgets_template_file_rdc-selected-posts', function( $template_file, $instance, $object ){
	return get_stylesheet_directory() . '/lib/so_widgets/so-selected-posts-widget' . $template_file;
}, 99, 3 );

if( !function_exists( 'rdc_selectedposts_excerpt_length' ) ) {
	function rdc_selectedposts_excerpt_length( $v = 55 ) {
		return 15;
	}
}

if( !function_exists( 'rdc_selectedposts_excerpt_more' ) ) {
	function rdc_selectedposts_excerpt_more( $v = ' [&hellip;]' ) {
		return '...';
	}
}

class SiteOrigin_Widget_SelectedPosts_Widget extends SiteOrigin_Widget {

	function __construct() {

		parent::__construct(
			'rdc-selected-posts',
			__('RDC Selected Posts', 'rdc'),
			array(
				'description' => __('Display Selected Posts.', 'rdc'),
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
        'posts' => array(
          'type' => 'posts',
          'label' => __( 'Select Posts', 'rdc' )
        )
			)
		);
	}

	function initialize() {
		$this->register_frontend_styles(
			array(
				array(
					'rdc-recent-posts',
					get_stylesheet_directory_uri() . '/lib/so_widgets/so-selected-posts-widget/css/style.css',
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

siteorigin_widget_register('selected-posts', __FILE__);