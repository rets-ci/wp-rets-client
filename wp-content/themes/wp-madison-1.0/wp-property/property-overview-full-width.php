<?php
/**
 * WP-Property Overview Template
 *
 * @package Madison
 * @author Justin Kopepasah
 * @since 1.0.0
*/
?>

<?php if ( have_properties() ) : ?>
	<?php foreach ( returned_properties() as $property ) : ?>
		<article id="property-<?php echo $property['ID']; ?>" class="hentry property property-overview-item column col-12-12" <?php madison_backstretch_data( $property['ID'] ) ?>>
			<?php if ( has_post_thumbnail( $property['ID'] ) ) : ?>
				<figure class="property-image entry">
					<?php echo get_the_post_thumbnail( $property['ID'], 'property-overview-featured-full', array( 'class' => 'property-featured-image' ) ); ?>
				</figure>
			<?php endif; ?>

			<div class="section-container">
				<span class="featured-tag"><?php _e( 'Featured Property', 'madison' ); ?></span>
				<div class="property-map-header">
					<span class="property-title"><?php echo $property['post_title']; ?></span>
					<span class="property-address"><?php echo $property['display_address']; ?></span>
				</div>
			</div>
		</article>
	<?php endforeach; ?>
<?php endif; ?>