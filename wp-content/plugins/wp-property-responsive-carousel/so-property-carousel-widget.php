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
add_filter( 'siteorigin_widgets_template_file_wp-property-responsive-carousel', function( $template_file, $instance, $object ){
		return untrailingslashit(plugin_dir_path(__FILE__)) . $template_file;
}, 99, 3 );

/**
 * Add the carousel image sizes
 */
function ud_carousel_register_image_sizes(){
	add_image_size('ud-carousel-default', 255, 186, true);
}
add_action('init', 'ud_carousel_register_image_sizes');

function wp_property_siteorigin_widget_post_selector_process_query($query){
	$query = wp_parse_args($query,
			array(
					'post_status' => 'publish'
			)
	);

	if(!empty($query['post_type'])) {
		if($query['post_type'] == '_all') $query['post_type'] = siteorigin_widget_post_selector_all_post_types();
		$query['post_type'] = explode(',', $query['post_type']);
	}

	if(!empty($query['post__in'])) {
		$query['post__in'] = explode(',', $query['post__in']);
		array_map('intval', $query['post__in']);
	}

	if(!empty($query['tax_query']) && !is_array($query['tax_query'])) {
		$tax_queries = explode(',', $query['tax_query']);

		$query['tax_query'] = array();
		$query['tax_query']['relation'] = 'AND';
		foreach($tax_queries as $tq) {
			list($tax, $term) = explode(':', $tq);

			if( empty($tax) || empty($term) ) continue;
			$query['tax_query'][] = array(
					'taxonomy' => $tax,
					'field' => 'slug',
					'terms' => $term
			);
		}
	}

	if ( ! empty( $query['date_query'] ) ) {
		$query['date_query'] = json_decode( $query['date_query'], true );
	}

	if ( ! empty( $query['sticky'] ) ) {
		switch($query['sticky']){
			case 'ignore' :
				$query['ignore_sticky_posts'] = 1;
				break;
			//TODO: Revisit this. Not sure if it makes sense to have this as an option in a separate dropdown, but am
			//TODO: trying to stay as close as possible to Page Builder Post Loop widget post selection options.
			//TODO: It's probably better in the long run to make this work well and just cope with issues that come up in
			//TODO: Page Builder Post Loop migrations until it dies.
			case 'only' :
				$post_in = empty( $query['post__in'] ) ? array() : $query['post__in'];
				$query['post__in'] = array_merge( $post_in, get_option( 'sticky_posts' ) );
				break;
			case 'exclude' :
				$query['post__not_in'] = get_option( 'sticky_posts' );
				break;
		}
		unset( $query['sticky'] );
	}

	if ( ! empty( $query['additional'] ) ) {
		$additional = implode( '&', explode( ',', $query['additional'] ) );
		$query = wp_parse_args( $additional, $query );
		unset( $query['additional'] );
	}

	return $query;
}

/**
 * Prevent function redeclaration
 */
if ( !function_exists( 'ud_carousel_filters' ) ) {
	/**
	 * Renders Filters for carousel
	 */
	function ud_carousel_filters( $instance ) {
		global $wp_properties;

		$fields = array();
		$search_fields = array();

		if( !empty( $instance[ 'filter1' ] ) ) {
			array_push( $fields, array(
				'key' => $instance[ 'filter1' ],
				'label' => $instance[ 'filter1' ] == 's' ? __( 'Filter by', 'ud' ) : $wp_properties['property_stats'][$instance[ 'filter1' ]],
				'placeholder' => $instance[ 'filter1' ] == 's' ? __( 'Name, Street...', 'ud' ) : $wp_properties['property_stats'][$instance[ 'filter1' ]],
				'type' => $instance[ 'filter1_type' ],
				'value' => !empty( $instance[ 'filter1_default' ] ) ? $instance[ 'filter1_default' ] : '',
			) );
			array_push( $search_fields, $instance[ 'filter1' ] );
		}

		if( !empty( $instance[ 'filter2' ] ) ) {
			array_push( $fields, array(
				'key' => $instance[ 'filter2' ],
				'label' => $instance[ 'filter2' ] == 's' ? __( 'Filter by', 'ud' ) : $wp_properties['property_stats'][$instance[ 'filter2' ]],
				'placeholder' => $instance[ 'filter2' ] == 's' ? __( 'Name, Street...', 'ud' ) : $wp_properties['property_stats'][$instance[ 'filter2' ]],
				'type' => $instance[ 'filter2_type' ],
				'value' => !empty( $instance[ 'filter2_default' ] ) ? $instance[ 'filter2_default' ] : '',
			) );
			array_push( $search_fields, $instance[ 'filter2' ] );
		}

		if( !empty( $instance[ 'filter3' ] ) ) {
			array_push( $fields, array(
				'key' => $instance[ 'filter3' ],
				'label' => $instance[ 'filter3' ] == 's' ? __( 'Filter by', 'ud' ) : $wp_properties['property_stats'][$instance[ 'filter3' ]],
				'placeholder' => $instance[ 'filter3' ] == 's' ? __( 'Name, Street...', 'ud' ) : $wp_properties['property_stats'][$instance[ 'filter3' ]],
				'type' => $instance[ 'filter3_type' ],
				'value' => !empty( $instance[ 'filter3_default' ] ) ? $instance[ 'filter3_default' ] : '',
			) );
			array_push( $search_fields, $instance[ 'filter3' ] );
		}

		$searchable_property_types = ud_get_wp_property( 'searchable_property_types', array() );

		$search_values = WPP_F::get_search_values( $search_fields, $searchable_property_types );

		?>
		<div class="ud-carousel-filters">
			<div class="column-wrapper">
				<form action="" class="ud-carousel-filter">
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
											'value' => $field[ 'value' ],
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

function ud_carousel_get_next_posts_page() {
	if ( empty( $_REQUEST['_widgets_nonce'] ) || !wp_verify_nonce( $_REQUEST['_widgets_nonce'], 'widgets_action' ) ) return;
	$query = wp_parse_args(
		wp_property_siteorigin_widget_post_selector_process_query($_GET['query']),
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

  // Require a thumbnail. - potanin@UD
  $query[ 'meta_query' ][] = array(
    'key'     => '_thumbnail_id',
    'value'   => '0',
    'compare' => '>',
  );

//	echo '<pre>';
//	print_r($query);

  $the_query = new WP_Query($query);

  ob_start();
	while($the_query->have_posts()) : $the_query->the_post(); ?>
		<?php $property = prepare_property_for_display( get_property( get_the_ID(), array(
			'get_children'          => 'false',
			'load_gallery'          => 'false',
			'load_thumbnail'        => 'false',
			'load_parent'           => 'false',
			'cache'                 => 'true',
		) ) );
		?>
		<li class="rdc-carousel-item carousel-item" data-property-id="<?php echo get_the_ID(); ?>">
			<?php
//			echo '<pre>';
//			print_r($posts);
//			echo '</pre>';
			?>
			<a href="<?php the_permalink() ?>">
				<div class="rdc-carousel-thumbnail">
					<?php if( has_post_thumbnail() ) : $img = wp_get_attachment_image_url(get_post_thumbnail_id(), 'thumbnail'); ?>
						<div class="thumb" style="background-image: url(<?php echo esc_url($img) ?>); background-size: cover; background-position: center center;">
							<?php //echo get_the_post_thumbnail($property['ID'], 'property_carousel'); ?>
							<span class="overlay"></span>
						</div>
					<?php else : ?>
						<div class="rdc-carousel-default-thumbnail"><span class="overlay"></span></div>
					<?php endif; ?>
				</div>
				<div class="item-content">
					<p>
						<?php
						$get_location_street_number_terms = get_the_terms($property['ID'], 'location_street_number');
						($get_location_street_number_terms[0]) ? _e($get_location_street_number_terms[0]->name) : '';
						echo ' ';
						$get_location_direction_terms = get_the_terms($property['ID'], 'location_direction');
						($get_location_direction_terms[0]) ? _e($get_location_direction_terms[0]->name) : '';
						echo ' ';
						$get_location_street_terms = get_the_terms($property['ID'], 'location_street');
						($get_location_street_terms[0]) ? _e($get_location_street_terms[0]->name) : '';
						echo ' ';
						$get_location_unit_terms = get_the_terms($property['ID'], 'location_unit');
						($get_location_unit_terms[0]) ? _e($get_location_unit_terms[0]->name) : '';
						?>
					</p>
						<span>
							<?php
							$get_location_city_terms = get_the_terms($property['ID'], 'location_city');
							($get_location_city_terms[0]) ? _e($get_location_city_terms[0]->name) : '';
							echo ', ';
							$get_location_state_terms = get_the_terms($property['ID'], 'location_state');
							($get_location_state_terms[0]) ? _e($get_location_state_terms[0]->name . ' ') : '';
							$get_location_zip_terms = get_the_terms($property['ID'], 'location_zip');
							($get_location_zip_terms[0]) ? _e($get_location_zip_terms[0]->name) : ''
							?>
						</span>
					<ul>
						<?php $get_bedrooms_terms = get_the_terms($property['ID'], 'bedrooms'); if($get_bedrooms_terms[0]){ ?><li><span class="icon-wpproperty-attribute-bedroom-outline singlePropertyIcon"></span><?php _e($get_bedrooms_terms[0]->name); echo '</li>'; } ?>
						<?php $get_bathrooms_terms = get_the_terms($property['ID'], 'bathrooms'); if($get_bathrooms_terms[0]){ ?><li><span class="icon-wpproperty-attribute-bathroom-outline singlePropertyIcon"></span><?php _e($get_bathrooms_terms[0]->name); echo '</li>'; } ?>
						<?php 
						$get_living_area_terms = get_the_terms($property['ID'], 'total_living_area_sqft'); 
						if($get_living_area_terms[0]){ 
							?><li class="hidden-xs"><span class="icon-wpproperty-attribute-rooms-outline singlePropertyIcon"></span>
							<?php _e($get_living_area_terms[0]->name . ' Sq.ft.'); echo '</li>'; 
						} ?>
						<?php if(!empty($property[ 'price_2' ])){ 
							echo '<li><span class="icon-wpproperty-status-rented-outline singlePropertyIcon"></span>$'. number_format($property[ 'price_2' ]); echo '</li>'; 
						} ?>

					</ul>
				</div>
			</a>
		</li>
	<?php endwhile;

	$result = array( 'html' => ob_get_clean(), 'found_posts' => $the_query->found_posts );
	wp_reset_postdata();
	header('content-type: application/json');
	echo json_encode( $result );

	exit();
}
	add_action('wp_ajax_ud_carousel_load', 'ud_carousel_get_next_posts_page');
	add_action('wp_ajax_nopriv_ud_carousel_load', 'ud_carousel_get_next_posts_page');



