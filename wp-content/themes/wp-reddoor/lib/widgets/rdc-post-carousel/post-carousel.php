<?php
/*
Widget Name: Post Carousel
Description: Gives you a widget to display your posts as a carousel.
Author: SiteOrigin
Author URI: https://siteorigin.com
*/

/**
 * Add the carousel image sizes
 */
function rdc_carousel_register_image_sizes(){
	add_image_size('rdc-carousel-default', 272, 182, true);
}
add_action('init', 'rdc_carousel_register_image_sizes');

function rdc_carousel_get_next_posts_page() {
	if ( empty( $_REQUEST['_widgets_nonce'] ) || !wp_verify_nonce( $_REQUEST['_widgets_nonce'], 'widgets_action' ) ) return;
	$query = wp_parse_args(
		siteorigin_widget_post_selector_process_query($_GET['query']),
		array(
			'post_status' => 'publish',
			'posts_per_page' => 10,
			'paged' => empty( $_GET['paged'] ) ? 1 : $_GET['paged']
		)
	);

	$posts = new WP_Query($query);
	ob_start();
	include 'tpl/carousel-post-loop.php';
	$result = array( 'html' => ob_get_clean() );
	header('content-type: application/json');
	echo json_encode( $result );

	exit();
}
add_action( 'wp_ajax_rdc_carousel_load', 'rdc_carousel_get_next_posts_page' );
add_action( 'wp_ajax_nopriv_rdc_carousel_load', 'rdc_carousel_get_next_posts_page' );

class RDC_Widget_PostCarousel_Widget extends SiteOrigin_Widget {


	function __construct() {

		$sizes = array_flip( get_intermediate_image_sizes() );
		foreach( $sizes as $i => $v ) {
			$sizes[$i] = $i;
		}

		parent::__construct(
			'rdc-post-carousel',
			__('RDC Post Carousel', 'so-widgets-bundle'),
			array(
				'description' => __('Display your posts as a carousel.', 'so-widgets-bundle'),
				'help' => 'https://siteorigin.com/widgets-bundle/post-carousel-widget/'
			),
			array(

			),
			array(
				'title' => array(
					'type' => 'text',
					'label' => __('Title', 'so-widgets-bundle'),
				),
				'image_size' => array(
					'type' => 'select',
					'label' => __('Image Size', 'reddoor'),
					'options' => $sizes
				),
				'posts' => array(
					'type' => 'posts',
					'label' => __('Posts query', 'so-widgets-bundle'),
				),
			),
			plugin_dir_path(__FILE__).'../'
		);
	}

	function initialize() {
		$this->register_frontend_scripts(
			array(
				array(
					'touch-swipe',
					plugin_dir_url( SOW_BUNDLE_BASE_FILE ) . 'js/jquery.touchSwipe' . SOW_BUNDLE_JS_SUFFIX . '.js',
					array( 'jquery' ),
					'1.6.6'
				),
				array(
					'sow-carousel-basic',
					get_stylesheet_directory_uri() . '/lib/widgets/rdc-post-carousel/js/carousel' . SOW_BUNDLE_JS_SUFFIX . '.js',
					array( 'jquery', 'touch-swipe' ),
					SOW_BUNDLE_VERSION,
					true
				)
			)
		);
		$this->register_frontend_styles(
			array(
				array(
					'sow-carousel-basic',
					get_stylesheet_directory_uri() . '/lib/widgets/rdc-post-carousel/css/style.css',
					array(),
					SOW_BUNDLE_VERSION
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

siteorigin_widget_register('rdc-post-carousel', __FILE__, 'RDC_Widget_PostCarousel_Widget');