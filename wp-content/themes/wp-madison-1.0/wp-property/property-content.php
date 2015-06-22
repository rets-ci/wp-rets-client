<?php
/**
 * Template for displaying content. This is the
 * default content tempalte.
 *
 * @package Madison
 * @author Justin Kopepasah
 * @since 1.0.0
*/
$property_images = get_post_meta( $post->ID, 'slideshow_images', true );
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<?php if ( ! WPP_F::get_coordinates() ): ?>
		<header class="entry-header">
			<h1 class="entry-title"><?php the_title(); ?></h1>
		</header>
	<?php endif; ?>

	<?php if ( ! empty( $property_images[0] ) && count( $property_images ) > 1 ) : ?>
		<section class="property-images">
			<?php foreach ( $property_images as $index => $id ) : ?>
				<?php
					$large = wp_get_attachment_image_src( $id, 'property-featured-image' );
					$thumb = wp_get_attachment_image_src( $id, 'thumbnail' );
				?>
				<img src="<?php echo $large[0]; ?>" alt="" data-image-id="<?php echo $id; ?>" data-image-index="<?php echo $index; ?>" data-image-thumb="<?php echo $thumb[0]?>" />
			<?php endforeach; ?>
		</section>
	<?php elseif ( has_post_thumbnail() ) : ?>
		<section class="property-image">
			<?php the_post_thumbnail( 'property-featured-image' ); ?>
		</section>
	<?php elseif ( count( $property_images ) == 1 ) : ?>
		<section class="property-image">
			<?php
				$large = wp_get_attachment_image_src( $property_images[0], 'property-featured-image' );
			?>
			<img src="<?php echo $large[0]; ?>" alt="" />
		</section>
	<?php endif; ?>

	<section class="property-info">
		<div class="property-attributes column-wrapper">
			<?php if ( isset( $post->parent_link ) ) : ?>
				<span class="property-price column col-6-12"><?php echo get_attribute( 'price' ); ?></span>
				<span class="property-return column col-6-12"><a href="<?php echo $post->parent_link; ?>"><?php _e( 'Return to Building','madison' ) ?></a></span>
			<?php else : ?>
				<span class="property-price column col-4-12"><?php echo get_attribute( 'price' ); ?></span>
				<span class="property-bedrooms column col-4-12"><?php echo get_attribute( 'bedrooms' ); ?> <?php _e( 'Bedrooms', 'madison' ); ?></span>
				<span class="property-bathrooms column col-4-12"><?php echo get_attribute( 'bathrooms' ); ?> <?php _e( 'Bathrooms', 'madison' ); ?></span>
			<?php endif; ?>
		</div>

		<?php if ( isset( $post->tagline ) ) : ?>
			<div class="property-tagline">
				<p><?php the_tagline(); ?></p>
			</div>
		<?php endif; ?>
	</section>

	<?php if ( ! empty( $post->post_content ) || draw_stats( array( 'display' => 'array' ) ) ) : ?>
		<section class="property-content property-box">
			<?php if ( ! empty( $post->post_content ) ) : ?>
				<p class="property-content-header property-box-header"><strong><?php _e( 'More Information', 'madison' ); ?></strong></p>
				<div class="property-content-text property-box-inner entry-content">
					<?php the_content(); ?>
				</div>
			<?php endif; ?>
			<?php if ( draw_stats( array( 'display' => 'array' ) ) ) : ?>
				<div class="property-stats column-wrapper">
					<?php if ( empty( $GLOBALS['wp_properties']['property_groups'] ) || $GLOBALS['wp_properties']['configuration']['property_overview']['sort_stats_by_groups'] != 'true' ) : ?>
						<?php foreach ( draw_stats( array( 'display' => 'array' ) ) as $slug => $data ) : ?>
							<span class="left column col-6-12"><?php echo $data[ 'label' ]; ?></span>
							<span class="right column col-6-12"><?php echo $data[ 'value' ]; ?></span>
						<?php endforeach; ?>
					<?php else : ?>
						<?php foreach ( draw_stats( array( 'display' => 'array' ) ) as $group => $attribute ) : ?>
							<?php if ( $group == '0' ) : ?>
								<span class="group-name column col-12-12"><?php echo _e( 'Other', 'madison' ) ?></span>
							<?php else : ?>
								<span class="group-name column col-12-12"><?php echo $GLOBALS['wp_properties'][ 'property_groups' ][ $group ]['name']; ?></span>
							<?php endif; ?>
							<?php foreach ( $attribute as $slug => $data ) : ?>
								<span class="left column col-6-12"><?php echo $data[ 'label' ]; ?></span>
								<span class="right column col-6-12"><?php echo $data[ 'value' ]; ?></span>
							<?php endforeach; ?>
						<?php endforeach; ?>
					<?php endif; ?>
				</div>
			<?php endif; ?>
		</section>
	<?php endif; ?>

	<?php if( ! empty( $wp_properties['taxonomies'] ) ) : ?>
		<div class="property-features column-wrapper">
			<?php foreach ( $wp_properties['taxonomies'] as $tax_slug => $tax_data ) : ?>
				<?php if ( get_features( array( 'type' => $tax_slug, 'format' => 'count' ) ) ) :  ?>
					<div class="property-feature property-feature-<?php echo $tax_slug ?> column col-6-12">
						<div class="col-inner property-box">
							<p class="property-feature-header property-box-header"><strong><?php echo $tax_data['label']; ?></strong></p>
							<div class="property-feature-list property-box-inner">
								<?php foreach ( get_features( array( 'type' => $tax_slug, 'format' => 'array' ) ) as $feature ) : ?>
									<?php echo $feature ?>
								<?php endforeach; ?>
							</div>
						</div>
					</div>
				<?php endif; ?>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>

	<?php if ( is_array( $wp_properties['property_meta'] ) ) : ?>
		<div class="property-meta column-wrapper">
			<?php foreach ( $wp_properties['property_meta'] as $meta_slug => $meta_title ) : if ( empty( $post->$meta_slug ) || $meta_slug == 'tagline' ) continue;?>
				<div class="property-meta-item property-meta-<?php echo $meta_slug ?> column col-6-12">
					<div class="col-inner property-box">
						<p class="property-meta-header property-box-header"><?php echo $meta_title; ?></p>
						<div class="property-meta-list property-box-inner">
							<?php echo do_shortcode( html_entity_decode( $post->$meta_slug ) ); ?>
						</div>
					</div>
				</div>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>
</article>