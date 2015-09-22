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

				<div class="property-information">
					<?php if ( $property['location'] ) : ?>
						<a href="<?php echo $property['permalink']; ?>"><span class="property-address"><?php echo $property['display_address']; ?></span></a>
					<?php endif; ?>
					<ul class="icons-list">
						<?php if( !empty( $property[ 'bedrooms' ] ) ) : ?>
							<li title="<?php _e( 'Bedrooms', 'rdc' ); ?>"><span class="rdc-icon icon-bed-a"></span><span class="val"><?php echo $property[ 'bedrooms' ] ?></span></li>
						<?php endif; ?>
						<?php if( !empty( $property[ 'bathrooms' ] ) ) : ?>
							<li title="<?php _e( 'Bathrooms', 'rdc' ); ?>"><span class="rdc-icon icon-shower"></span><span class="val"><?php echo $property[ 'bathrooms' ] ?></span></li>
						<?php endif; ?>
						<?php if( !empty( $property[ 'area' ] ) ) : ?>
							<li title="<?php _e( 'SQFT', 'rdc' ); ?>"><span class="rdc-icon icon-area"></span><span class="val"><?php echo $property[ 'area' ] ?></span></li>
						<?php endif; ?>
					</ul>
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