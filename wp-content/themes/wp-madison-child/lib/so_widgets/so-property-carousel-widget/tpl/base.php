<?php

$query = array(
	'post_status' => 'publish',
	'post_type' => 'property',
	'posts_per_page' => 100,
);
$the_query = new WP_Query( $query );

?>
<?php if($the_query->have_posts()) : ?>
	<div class="rdc-property-carousel">
		<div class="section-content">
			<div class="rdc-carousel-title">
				<?php echo $args['before_title'] . esc_html($instance['title']) . $args['after_title'] ?>

				<a href="#" class="rdc-carousel-next" title="<?php esc_attr_e('Next', 'siteorigin-widgets') ?>"></a>
				<a href="#" class="rdc-carousel-previous" title="<?php esc_attr_e('Previous', 'siteorigin-widgets') ?>"></a>
			</div>

			<div class="rdc-carousel-container">

				<a href="#" class="rdc-carousel-previous" title="<?php esc_attr_e('Previous', 'siteorigin-widgets') ?>"></a>

				<a href="#" class="rdc-carousel-next" title="<?php esc_attr_e('Next', 'siteorigin-widgets') ?>"></a>

				<div class="rdc-carousel-wrapper"
				     data-query="<?php echo esc_attr($instance['posts']) ?>"
				     data-found-posts="<?php echo esc_attr($the_query->found_posts) ?>"
				     data-ajax-url="<?php echo esc_url( wp_nonce_url( admin_url('admin-ajax.php'), 'widgets_action', '_widgets_nonce' ) ) ?>"
					>
					<ul class="rdc-carousel-items">
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
								<div class="rdc-carousel-thumbnail">
									<?php if( has_post_thumbnail() ) : $img = wp_get_attachment_image_src(get_post_thumbnail_id(), 'rdc-carousel-default'); ?>
										<a href="<?php the_permalink() ?>" style="background-image: url(<?php echo esc_url($img[0]) ?>)">
											<span class="overlay"></span>
										</a>
									<?php else : ?>
										<a href="<?php the_permalink() ?>" class="rdc-carousel-default-thumbnail"><span class="overlay"></span></a>
									<?php endif; ?>
									<div class="price"><?php echo $property[ 'price' ] ?></div>
								</div>
								<div class="item-content">
									<h3><a href="<?php the_permalink() ?>"><?php the_title() ?></a></h3>
									<p class="address"><?php echo $property[ 'display_address' ]; ?></p>
									<ul>
										<li><i class="icon"></i><?php echo $property[ 'bedrooms' ] ?></li>
										<li><i class="icon"></i><?php echo $property[ 'bathrooms' ] ?></li>
										<li><i class="icon"></i><?php echo $property[ 'area' ] ?></li>
									</ul>
								</div>
							</li>
						<?php endwhile; wp_reset_postdata(); ?>
					</ul>
				</div>
			</div>
		</div>
	</div>
<?php endif; ?>