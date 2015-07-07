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
  <div class="<?php wpp_css('property_overview::row_view', "wpp_row_view wpp_property_view_result"); ?>">
	<?php foreach ( returned_properties() as $property ) : ?>
		<article id="property-<?php echo $property['ID']; ?>" class="hentry property property-overview-item column col-3-12">
			<div class="col-inner">
				<?php if ( has_post_thumbnail( $property['ID'] ) ) : ?>
					<figure class="property-image entry">
						<?php echo get_the_post_thumbnail( $property['ID'], 'property-overview-featured', array( 'class' => 'property-featured-image' ) ); ?>
						<a href="<?php echo $property['permalink']; ?>" class="property-image-permalink"><i class="fa fa-plus"></i></a>
						<?php if ( $property['price'] ) : ?>
							<span class="property-price"><?php echo $property['price']; ?></span>
						<?php endif; ?>
					</figure>
				<?php endif; ?>

				<header class="property-header entry-header">
					<p class="property-title entry-title"><a href="<?php echo $property['permalink']; ?>"><?php echo $property['post_title']; ?></a></p>
				</header>

				<div class="property-information">
					<?php if ( $property['display_address'] ) : ?>
						<span class="property-address"><?php echo $property['display_address']; ?></span>
					<?php endif; ?>
				</div>
			</div>
		</article>
	<?php endforeach; ?>
  </div>
<?php else : ?>
	<div id="property-overview-end">
		<p><?php _e( 'No more properties found.', 'madison' ); ?></p>
	</div>
<?php endif; ?>