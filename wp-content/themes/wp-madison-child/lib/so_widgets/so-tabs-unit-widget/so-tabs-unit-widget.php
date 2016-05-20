<?php
/*
Widget Name: Tabs Unit Widget
Description: Adds Tabs with static information.
Author: UsabilityDynamics, Inc.
Author URI: https://www.usabilitydynamics.com
*/

/**
 * Fix path to template file.
 */
add_filter( 'siteorigin_widgets_template_file_rdc-tabs-unit', function( $template_file, $instance, $object ){
	return get_stylesheet_directory() . '/lib/so_widgets/so-tabs-unit-widget' . $template_file;
}, 99, 3 );

class SiteOrigin_Widget_TabsUnit_Widget extends SiteOrigin_Widget {

	function __construct() {

		parent::__construct(
			'rdc-tabs-unit',
			__('RDC Tenants/Landlords Tabs', 'rdc'),
			array(
				'description' => __('Display Tabs with static information.', 'rdc'),
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
				'tab1'        => array(
					'type'        => 'section',
					'label'       => __( 'Tenants', 'rdc' ),
					'hide'        => false,
					'description' => __( 'Tenants Tab Content.', 'rdc' ),
					'fields'      => array(
						'tab1item1label' => array(
							'type' => 'text',
							'label' => __( 'Left Box Label', 'rdc' )
						),
						'tab1item1link' => array(
							'type' => 'text',
							'label' => __( 'Left Box Link', 'rdc' )
						),
						'tab1item1target_blank' => array(
							'type' => 'checkbox',
							'label' => __( 'Open link in a new window tab', 'rdc' )
						),
						'tab1item1text' => array(
							'type' => 'textarea',
							'label' => __( 'Left Box Content', 'rdc' )
						),
						'tab1item2label' => array(
							'type' => 'text',
							'label' => __( 'Middle Box Label', 'rdc' )
						),
						'tab1item2link' => array(
							'type' => 'text',
							'label' => __( 'Middle Box Link', 'rdc' )
						),
						'tab1item2target_blank' => array(
							'type' => 'checkbox',
							'label' => __( 'Open link in a new window tab', 'rdc' )
						),
						'tab1item2text' => array(
							'type' => 'textarea',
							'label' => __( 'Middle Box Content', 'rdc' )
						),
						'tab1item3label' => array(
							'type' => 'text',
							'label' => __( 'Right Box Label', 'rdc' )
						),
						'tab1item3link' => array(
							'type' => 'text',
							'label' => __( 'Right Box Link', 'rdc' )
						),
						'tab1item3target_blank' => array(
							'type' => 'checkbox',
							'label' => __( 'Open link in a new window tab', 'rdc' )
						),
						'tab1item3text' => array(
							'type' => 'textarea',
							'label' => __( 'Right Box Content', 'rdc' )
						),
					)
				),
				'tab2'        => array(
					'type'        => 'section',
					'label'       => __( 'Landlords', 'rdc' ),
					'hide'        => false,
					'description' => __( 'Landlords Tab Content.', 'rdc' ),
					'fields'      => array(
						'tab2item1label' => array(
							'type' => 'text',
							'label' => __( 'Left Box Label', 'rdc' )
						),
						'tab2item1link' => array(
							'type' => 'text',
							'label' => __( 'Left Box Link', 'rdc' )
						),
						'tab2item1target_blank' => array(
							'type' => 'checkbox',
							'label' => __( 'Open link in a new window tab', 'rdc' )
						),
						'tab2item1text' => array(
							'type' => 'textarea',
							'label' => __( 'Left Box Content', 'rdc' )
						),
						'tab2item2label' => array(
							'type' => 'text',
							'label' => __( 'Middle Box Label', 'rdc' )
						),
						'tab2item2link' => array(
							'type' => 'text',
							'label' => __( 'Middle Box Link', 'rdc' )
						),
						'tab2item2target_blank' => array(
							'type' => 'checkbox',
							'label' => __( 'Open link in a new window tab', 'rdc' )
						),
						'tab2item2text' => array(
							'type' => 'textarea',
							'label' => __( 'Middle Box Content', 'rdc' )
						),
						'tab2item3label' => array(
							'type' => 'text',
							'label' => __( 'Right Box Label', 'rdc' )
						),
						'tab2item3link' => array(
							'type' => 'text',
							'label' => __( 'Right Box Link', 'rdc' )
						),
						'tab2item3target_blank' => array(
							'type' => 'checkbox',
							'label' => __( 'Open link in a new window tab', 'rdc' )
						),
						'tab2item3text' => array(
							'type' => 'textarea',
							'label' => __( 'Right Box Content', 'rdc' )
						),
					)
				),
			)
		);
	}

	function initialize() {
		if(
			( empty( $_SERVER[ 'SCRIPT_FILENAME' ] ) || strpos( $_SERVER[ 'SCRIPT_FILENAME' ], 'customize.php' ) === false ) &&
			( empty( $_SERVER[ 'HTTP_REFERER' ] ) || strpos( $_SERVER[ 'HTTP_REFERER' ], 'customize.php' ) === false )
		) {
			$this->register_frontend_scripts(
				array(
					array(
						'rdc-tabs-unit',
						get_stylesheet_directory_uri() . '/lib/so_widgets/so-tabs-unit-widget/js/tabs-unit.js',
						array('jquery', 'jquery-ui-tabs'),
						'1.0',
						true
					)
				)
			);
		}
		$this->register_frontend_styles(
			array(
				array(
					'rdc-tabs-unit',
					get_stylesheet_directory_uri() . '/lib/so_widgets/so-tabs-unit-widget/css/style.css',
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

siteorigin_widget_register('tabs-unit', __FILE__);