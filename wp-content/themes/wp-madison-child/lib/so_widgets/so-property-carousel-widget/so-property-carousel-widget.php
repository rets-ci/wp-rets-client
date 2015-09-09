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

/**
 * Prevent function redeclaration
 */
if ( !function_exists( 'rdc_carousel_filters' ) ) {
	/**
	 * Renders Filters for carousel
	 */
	function rdc_carousel_filters( $instance ) {
		global $wp_properties;

		$fields = array();
		$search_fields = array();

		if( !empty( $instance[ 'filter1' ] ) ) {
			array_push( $fields, array(
				'key' => $instance[ 'filter1' ],
				'label' => $instance[ 'filter1' ] == 's' ? __( 'Filter by', 'rdc' ) : $wp_properties['property_stats'][$instance[ 'filter1' ]],
				'placeholder' => $instance[ 'filter1' ] == 's' ? __( 'Name, Street...', 'rdc' ) : $wp_properties['property_stats'][$instance[ 'filter1' ]],
				'type' => $instance[ 'filter1_type' ],
			) );
			array_push( $search_fields, $instance[ 'filter1' ] );
		}

		if( !empty( $instance[ 'filter2' ] ) ) {
			array_push( $fields, array(
				'key' => $instance[ 'filter2' ],
				'label' => $instance[ 'filter2' ] == 's' ? __( 'Filter by', 'rdc' ) : $wp_properties['property_stats'][$instance[ 'filter2' ]],
				'placeholder' => $instance[ 'filter2' ] == 's' ? __( 'Name, Street...', 'rdc' ) : $wp_properties['property_stats'][$instance[ 'filter2' ]],
				'type' => $instance[ 'filter2_type' ],
			) );
			array_push( $search_fields, $instance[ 'filter2' ] );
		}

		if( !empty( $instance[ 'filter3' ] ) ) {
			array_push( $fields, array(
				'key' => $instance[ 'filter3' ],
				'label' => $instance[ 'filter3' ] == 's' ? __( 'Filter by', 'rdc' ) : $wp_properties['property_stats'][$instance[ 'filter3' ]],
				'placeholder' => $instance[ 'filter3' ] == 's' ? __( 'Name, Street...', 'rdc' ) : $wp_properties['property_stats'][$instance[ 'filter3' ]],
				'type' => $instance[ 'filter3_type' ],
			) );
			array_push( $search_fields, $instance[ 'filter3' ] );
		}

		$searchable_property_types = ud_get_wp_property( 'searchable_property_types', array() );

		$search_values = WPP_F::get_search_values( $search_fields, $searchable_property_types );

		?>
		<div class="rdc-carousel-filters">
			<div class="column-wrapper">
				<form action="" class="" class="rdc-carousel-filter">
					<?php if( !empty( $fields ) ) : ?>
						<ul>
							<?php foreach( $fields as $field ) : ?>
								<li>
									<label>
										<span class="filter-label"><?php echo $field[ 'label' ]; ?> <span class="delimiter">:</span></span>
										<?php
										wpp_render_search_input( array(
											'attrib' => $field[ 'key' ],
											'search_values' => $search_values,
											'value' => '',
											'input_type' => $field[ 'type' ],
											'placeholder' => $field[ 'placeholder' ]
										) );
										?>
									</label>
								</li>
							<?php endforeach; ?>
						</ul>
					<?php endif; ?>
				</form>
			</div>
		</div>
		<?php
	}
}

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

	if( !empty( $_REQUEST[ 'filter' ] ) ) {
		$filters = array();
		parse_str( urldecode( $_REQUEST[ 'filter' ] ), $filters );
		if( !empty( $filters[ 'wpp_search' ] ) ) {
			$filters = $filters[ 'wpp_search' ];
		}
		if( !empty( $filters ) && is_array( $filters ) ) {
			$attributes = ud_get_wp_property( 'property_stats', array() );
			$meta_query = array();
			foreach( $filters as $k => $v ) {
				if( array_key_exists( $k, (array)$attributes ) && !empty( $v ) && $v != '-1' ) {
					if( is_array( $v ) ) {
						if( !empty( $v[ 'min' ] ) ) {
							array_push( $meta_query, array(
								'key' => $k,
								'value' => $v[ 'min' ],
								'compare' => '>=',
							) );
						} elseif ( !empty( $v[ 'max' ] ) ) {
							array_push( $meta_query, array(
								'key' => $k,
								'value' => $v[ 'max' ],
								'compare' => '<=',
							) );
						}
					} else {
						array_push( $meta_query, array(
							'key' => $k,
							'value' => $v,
							'compare' => '=',
						) );
					}
				} elseif ( $k == 's' && is_string( $v ) && !empty( $v ) ) {
					$query[ 's' ] = $v;
				}
			}
		}

		if( !empty( $meta_query ) ) {
			$query[ 'meta_query' ] = $meta_query;
		}
	}

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
	$result = array( 'html' => ob_get_clean(), 'found_posts' => $posts->found_posts );
	header('content-type: application/json');
	echo json_encode( $result );

	exit();
}
add_action( 'wp_ajax_rdc_carousel_load', 'rdc_carousel_get_next_posts_page' );
add_action( 'wp_ajax_nopriv_rdc_carousel_load', 'rdc_carousel_get_next_posts_page' );

class SiteOrigin_Widget_PropertyCarousel_Widget extends SiteOrigin_Widget {
	function __construct() {

		$attributes = array(
			'0' => 'Not Selected',
		);
		$sattrs = ud_get_wp_property( 'searchable_attributes', array() );
		if( !empty( $sattrs ) && is_array( $sattrs ) ) {
			foreach( $sattrs as $k ) {
				$attributes[ $k ] =  ud_get_wp_property( "property_stats.{$k}", "No label" );
			}
		}
		$attributes['s'] = __('Full Text', 'rdc');

		$types = array(
			'range_dropdown' => 'Range Dropdown',
			'dropdown' => 'Dropdown',
			'input' => 'Text Input'
		);

		parent::__construct(
			'rdc-property-carousel',
			__('RDC Property Carousel', 'rdc'),
			array(
				'description' => __('Display your properties as a carousel.', 'rdc'),
				'has_preview' => false
			),
			array(),
			array(
				'filter1' => array(
					'type' => 'select',
					'label' => __( 'Filter 1', 'rdc' ),
					'options' => $attributes
				),
				'filter1_type' => array(
					'type' => 'select',
					'label' => __( 'Filter 1 Type', 'rdc' ),
					'options' => $types
				),
				'filter2' => array(
					'type' => 'select',
					'label' => __( 'Filter 2', 'rdc' ),
					'options' => $attributes
				),
				'filter2_type' => array(
					'type' => 'select',
					'label' => __( 'Filter 2 Type', 'rdc' ),
					'options' => $types
				),
				'filter3' => array(
					'type' => 'select',
					'label' => __( 'Filter 3', 'rdc' ),
					'options' => $attributes
				),
				'filter3_type' => array(
					'type' => 'select',
					'label' => __( 'Filter 3 Type', 'rdc' ),
					'options' => $types
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
					get_stylesheet_directory_uri() . '/lib/so_widgets/so-property-carousel-widget/js/carousel.js',
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