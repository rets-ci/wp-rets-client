<?php
/*
Widget Name: Get in Touch Modal
Description: Display Modal with one of supported form
Author: UsabilityDynamics, Inc.
Author URI: https://www.usabilitydynamics.com
*/

/**
 * Fix path to template file.
 */
add_filter( 'siteorigin_widgets_template_file_rdc-get-touch-modal', function( $template_file, $instance, $object ){
	return get_stylesheet_directory() . '/lib/so_widgets/so-get-in-touch-modal-widget' . $template_file;
}, 99, 3 );

class SiteOrigin_Widget_GetTouch_Modal_Widget extends SiteOrigin_Widget {

	function __construct($options = array()) {

		parent::__construct(
			'rdc-get-touch-modal',
			__('RDC Get In Touch Modal', 'rdc'),
			array(
				'description' => __('Display Form modal.', 'rdc'),
				'has_preview' => false
			),
      $options,
			array(
				'title' => array(
					'type' => 'text',
					'label' => __( 'Title', 'rdc' )
				),
        'form' => array(
          'type' => 'select',
          'label' => __( 'Form', 'rdc' ),
          'options' => array(
            'rdc-schedule-showing' => __( 'Schedule Showing', 'rdc' ),
            'rdc-prospect-landlord-form' => __('Prospect Landlord Form', 'rdc'),
            'rdc-contact-form' =>  __('Contact Form', 'rdc'),
            'rdc-feedback-form' => __('Feedback Form', 'rdc'),
            'rdc-referral-program' => __('Referral Program Form', 'rdc')
          )
        )
			)
		);
	}

  /**
   *
   */
	function initialize() {
    if(
        ( empty( $_SERVER[ 'SCRIPT_FILENAME' ] ) || strpos( $_SERVER[ 'SCRIPT_FILENAME' ], 'customize.php' ) === false ) &&
        ( empty( $_SERVER[ 'HTTP_REFERER' ] ) || strpos( $_SERVER[ 'HTTP_REFERER' ], 'customize.php' ) === false )
    ) {
      $this->register_frontend_scripts(
          array(
              array(
                  'rdc-get-touch-modal',
                  get_stylesheet_directory_uri() . '/lib/so_widgets/so-get-in-touch-modal-widget/js/modal.js',
                  array('jquery',),
                  '1.0',
                  true
              )
          )
      );
    }
	}

	function get_template_name($instance){
		return 'base';
	}

	function get_style_name($instance){
		return false;
	}

  public function widget_url() {
    return get_stylesheet_directory_uri().'/lib/so_widgets/so-get-in-touch-modal-widget/';
  }

  public function forms_path() {
    return get_stylesheet_directory() . '/lib/so_widgets/so-get-in-touch-modal-widget/tpl/forms/';
  }
}

siteorigin_widget_register('get-in-touch-modal', __FILE__, 'SiteOrigin_Widget_GetTouch_Modal_Widget');