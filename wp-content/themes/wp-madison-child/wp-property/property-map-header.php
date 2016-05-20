<?php
/**
 * Template for displaying property map.
 *
 * @package Madison
 * @author Justin Kopepasah
 * @since 1.0.0
*/
?>

<?php if ( WPP_F::get_coordinates() ): ?>
	<section id="property-map">
		<div id="<?php echo $post->ID ?>-map-header" class="property-map-container"></div>
		<div class="section-container">
			<div class="property-map-header">
				<span class="property-title"><?php the_title(); ?></span>
				<span class="property-address"><?php echo $post->location; ?></span>
			</div>
		</div>
	</section>
<?php endif; ?>