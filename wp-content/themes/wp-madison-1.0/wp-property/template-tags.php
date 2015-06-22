<?php
/**
 * WP Property Sepcific template tags.
 *
 * @package Madison
 * @author Justin Kopepasah
*/

/**
 * Template tag for adding a property search
 * feature to the header.
 *
 * @since 1.0.0
*/
function madison_wpp_header_property_search() {
	global $wp_properties;
?>
	<section class="section-property-search">
		<div class="section-container column-wrapper">
			<form action="<?php echo WPP_F::base_url( $wp_properties[ 'configuration' ][ 'base_slug' ] ); ?>" method="post" class="column-wrapper wpp_search_elements">
				<div class="price-inputs column col-5-12">
					<label><?php _e( 'Price', 'madison' ); ?></label>
					<?php
					wpp_render_search_input( array(
						'attrib' => 'price',
						'random_element_id' => 'wpp_search_element_' . rand( 1000, 9999 ),
						'input_type' => 'range_input',
					) );
					?>
				</div>
				<div class="column col-3-12">
					<div class="col-inner">
						<label><?php _e( 'Bedrooms', 'madison' ); ?></label>
						<?php
						wpp_render_search_input( array(
							'attrib' => 'bedrooms',
							'random_element_id' => 'wpp_search_element_' . rand( 1000, 9999 ),
							'input_type' => 'dropdown',
							'search_values' => array(
								'bedrooms' => array( '1', '2', '3', '4', '5', '6', '7' ),
							),
						) );
						?>
					</div>
				</div>
				<div class="column col-3-12">
					<div class="col-inner">
						<label><?php _e( 'Bathrooms', 'madison' ); ?></label>
						<?php
						wpp_render_search_input( array(
							'attrib' => 'bathrooms',
							'random_element_id' => 'wpp_search_element_' . rand( 1000, 9999 ),
							'input_type' => 'dropdown',
							'search_values' => array(
								'bathrooms' => array( '1', '2', '3', '4', '5', '6', '7' ),
							),
						) );
						?>
					</div>
				</div>
				<div class="column col-1-12">
					<input type="submit" class="wpp_search_button submit btn" value="<?php _e( 'Search', 'wpp' ) ?>"/>
				</div>
			</form>
		</div>
	</section>
<?php
}