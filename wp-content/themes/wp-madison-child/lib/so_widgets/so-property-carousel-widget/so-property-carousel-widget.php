<?php
/*
Widget Name: Property Carousel Widget
Description: Gives you a widget to display your properties as a carousel.
Author: UsabilityDynamics, Inc.
Author URI: https://www.usabilitydynamics.com
*/

/**
 * Fix path to template file.
 */
add_filter( 'siteorigin_widgets_template_file_rdc-property-carousel', function( $template_file, $instance, $object ){
	return get_stylesheet_directory() . '/lib/so_widgets/so-property-carousel-widget' . $template_file;
}, 99, 3 );

/**
 * Add the carousel image sizes
 */
function rdc_carousel_register_image_sizes(){
	add_image_size('rdc-carousel-default', 255, 186, true);
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
	while($posts->have_posts()) : $posts->the_post(); ?>
		<?php $property = prepare_property_for_display( get_property( get_the_ID(), array(
			'get_children'          => 'false',
			'load_gallery'          => 'false',
			'load_thumbnail'        => 'false',
			'load_parent'           => 'false',
			'cache'                 => 'true',
		) ) );
		?>
		<li class="rdc-carousel-item">
			<a href="<?php the_permalink() ?>">
				<div class="rdc-carousel-thumbnail">
					<?php if( has_post_thumbnail() ) : $img = wp_get_attachment_image_src(get_post_thumbnail_id(), 'rdc-carousel-default'); ?>
						<div class="thumb" style="background-image: url(<?php echo esc_url($img[0]) ?>)">
							<span class="overlay"></span>
						</div>
					<?php else : ?>
						<div class="rdc-carousel-default-thumbnail"><span class="overlay"></span></div>
					<?php endif; ?>
					<div class="price"><?php echo $property[ 'price' ] ?></div>
				</div>
				<div class="item-content">
					<h3><?php the_title() ?></h3>
					<p class="address"><?php echo $property[ 'display_address' ]; ?></p>
					<ul>
						<li title="<?php _e( 'Bedrooms', 'rdc' ); ?>"><i class="icon fa fa-bed"></i><?php echo $property[ 'bedrooms' ] ?></li>
						<li title="<?php _e( 'Bathrooms', 'rdc' ); ?>"><i class="icon fa fa-tint"></i><?php echo $property[ 'bathrooms' ] ?></li>
						<li title="<?php _e( 'SQFT', 'rdc' ); ?>"><i class="icon fa fa-map"></i><?php echo $property[ 'area' ] ?></li>
					</ul>
				</div>
			</a>
		</li>
	<?php endwhile; wp_reset_postdata();
	$result = array( 'html' => ob_get_clean() );
	header('content-type: application/json');
	echo json_encode( $result );

	exit();
}
add_action( 'wp_ajax_rdc_carousel_load', 'rdc_carousel_get_next_posts_page' );
add_action( 'wp_ajax_nopriv_rdc_carousel_load', 'rdc_carousel_get_next_posts_page' );

class SiteOrigin_Widget_PropertyCarousel_Widget extends SiteOrigin_Widget {
	function __construct() {
		parent::__construct(
			'rdc-property-carousel',
			__('RDC Property Carousel', 'rdc'),
			array(
				'description' => __('Display your properties as a carousel.', 'rdc'),
			),
			array(),
			array(
				'title' => array(
					'type' => 'text',
					'label' => __('Title', 'rdc'),
				),
			)
		);
	}

	function initialize() {
		$this->register_frontend_scripts(
			array(
				array(
					'touch-swipe',
					get_stylesheet_directory_uri() . '/lib/so_widgets/so-property-carousel-widget/js/jquery.touchSwipe.min.js',
					array( 'jquery' ),
					'1.6.6'
				),
				array(
					'rdc-carousel-basic',
					get_stylesheet_directory_uri() . '/lib/so_widgets/so-property-carousel-widget/js/carousel.min.js',
					array( 'jquery', 'touch-swipe' ),
					'1.4.4',
					true
				)
			)
		);
		$this->register_frontend_styles(
			array(
				array(
					'rdc-carousel-basic',
					get_stylesheet_directory_uri() . '/lib/so_widgets/so-property-carousel-widget/css/style.css',
					array(),
					'1.4.4',
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

siteorigin_widget_register('property-carousel', __FILE__);