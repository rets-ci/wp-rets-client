<?php

$query = siteorigin_widget_post_selector_process_query( $instance['posts'] );

$query = $_query = array_merge( $query, array(
	'post_type' => 'property',
) );

if( empty( $query[ 'posts_per_page' ] ) ) {
	$query[ 'posts_per_page' ] = 50;
}

$filters = array();

if( !empty( $instance[ 'filter1' ] ) && !empty( $instance[ 'filter1_default' ] ) ) {
	if( !empty( $instance[ 'filter1_type' ] ) && $instance[ 'filter1_type' ] == 'range_dropdown' ) {
		$filters[ $instance[ 'filter1' ] ] = array( 'min' => $instance[ 'filter1_default' ] );
	} else {
		$filters[ $instance[ 'filter1' ] ] = $instance[ 'filter1_default' ];
	}
}

if( !empty( $instance[ 'filter2' ] ) && !empty( $instance[ 'filter2_default' ] ) ) {
	if( !empty( $instance[ 'filter2_type' ] ) && $instance[ 'filter2_type' ] == 'range_dropdown' ) {
		$filters[ $instance[ 'filter2' ] ] = array( 'min' => $instance[ 'filter2_default' ] );
	} else {
		$filters[ $instance[ 'filter2' ] ] = $instance[ 'filter2_default' ];
	}
}

if( !empty( $instance[ 'filter3' ] ) && !empty( $instance[ 'filter3_default' ] ) ) {
	if( !empty( $instance[ 'filter3_type' ] ) && $instance[ 'filter3_type' ] == 'range_dropdown' ) {
		$filters[ $instance[ 'filter3' ] ] = array( 'min' => $instance[ 'filter3_default' ] );
	} else {
		$filters[ $instance[ 'filter3' ] ] = $instance[ 'filter3_default' ];
	}
}

if( !empty( $filters ) ) {
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

$the_query = new WP_Query( $query );



?>
<?php if($the_query->have_posts()) : ?>
	<div class="rdc-property-carousel">
		<div class="section-content">
			<div class="rdc-carousel-title">
				<?php ud_carousel_filters( $instance ); ?>

				<a href="#" class="rdc-carousel-next" title="<?php esc_attr_e('Next', 'siteorigin-widgets') ?>"></a>
				<a href="#" class="rdc-carousel-previous" title="<?php esc_attr_e('Previous', 'siteorigin-widgets') ?>"></a>
			</div>

			<div class="rdc-carousel-container">

				<a href="#" class="rdc-carousel-previous" title="<?php esc_attr_e('Previous', 'siteorigin-widgets') ?>"></a>

				<a href="#" class="rdc-carousel-next" title="<?php esc_attr_e('Next', 'siteorigin-widgets') ?>"></a>

				<div class="rdc-carousel-wrapper"
				     data-query="<?php echo http_build_query($_query); ?>"
				     data-found-posts="<?php echo esc_attr($the_query->found_posts) ?>"
				     data-ajax-url="<?php echo esc_url( wp_nonce_url( admin_url('admin-ajax.php'), 'widgets_action', '_widgets_nonce' ) ) ?>"
					>
					<ul class="rdc-carousel-items">
						<li class="rdc-carousel-item descriptionBlock" style="width: 500px;">
							<?php if( !empty( $instance[ 'Description' ] )){
									echo $instance[ 'Description' ];
							} ?>
						</li>
						<?php while($the_query->have_posts()) : $the_query->the_post(); ?>
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
												$get_location_street_terms = get_the_terms($property['ID'], 'location_street');
												($get_location_street_terms[0]) ? _e($get_location_street_terms[0]->name) : '';
												if(!empty($property[ 'price_2' ])){
													echo ' - <span>$' . number_format($property[ 'price_2' ]) . '</span>';
												}
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
											<?php $get_bedrooms_terms = get_the_terms($property['ID'], 'bedrooms'); if($get_bedrooms_terms[0]){ ?><li><span class="icon-wpproperty-attribute-bedroom-solid singlePropertyIcon"></span><?php _e($get_bedrooms_terms[0]->name . ' Beds'); echo '</li>'; } ?>
											<?php $get_bathrooms_terms = get_the_terms($property['ID'], 'bathrooms'); if($get_bathrooms_terms[0]){ ?><li><span class="icon-wpproperty-attribute-bathroom-solid singlePropertyIcon"></span><?php _e($get_bathrooms_terms[0]->name . ' Baths'); echo '</li>'; } ?>
											<?php $get_living_area_terms = get_the_terms($property['ID'], 'total_living_area_sqft'); if($get_living_area_terms[0]){ ?><li><span class="icon-wpproperty-attribute-size-solid singlePropertyIcon"></span><?php _e($get_living_area_terms[0]->name . ' ft<sup>2</sup>.'); echo '</li>'; } ?>
										</ul>
									</div>
								</a>
							</li>
						<?php endwhile; wp_reset_postdata(); ?>
					</ul>
				</div>
			</div>
		</div>
	</div>
<?php endif; ?>