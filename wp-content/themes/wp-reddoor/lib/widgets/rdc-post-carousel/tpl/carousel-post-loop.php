<?php
$image_size = !empty( $instance['image_size'] ) ? $instance['image_size'] : 'sow-carousel-default';
$posts = new WP_Query($query);
while($posts->have_posts()) : $posts->the_post(); ?>
	<li class="sow-carousel-item<?php if( is_rtl() ) echo ' rtl' ?>">
		<div class="sow-carousel-thumbnail">
			<?php if( has_post_thumbnail() ) : $img = wp_get_attachment_image_src(get_post_thumbnail_id(), $image_size); ?>
				<a href="<?php the_permalink() ?>" style="background-image: url('<?php echo sow_esc_url($img[0]); ?>'); background-size: cover;)">
					<span class="overlay"></span>
				</a>
			<?php else : ?>
				<a href="<?php the_permalink() ?>" class="sow-carousel-default-thumbnail"><span class="overlay"></span></a>
			<?php endif; ?>
		</div>
		<h3><a href="<?php the_permalink() ?>"><?php the_title() ?></a></h3>
		<?php /*// <h4>Posted on <?php the_date('j M Y', '<span>', '</span>'); ?></h4> */ ?>
	</li>
<?php endwhile; wp_reset_postdata(); ?>