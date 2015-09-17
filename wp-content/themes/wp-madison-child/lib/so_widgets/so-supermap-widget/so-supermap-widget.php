<?php
/*
Widget Name: Supermap Widget
Description: Display RDC Supermap
Author: UsabilityDynamics, Inc.
Author URI: https://www.usabilitydynamics.com
*/

/**
 * Fix path to template file.
 */
add_filter( 'siteorigin_widgets_template_file_rdc-supermap', function( $template_file, $instance, $object ){
	return get_stylesheet_directory() . '/lib/so_widgets/so-supermap-widget' . $template_file;
}, 99, 3 );

/**
 * Prevent function redeclaration
 */
if ( !function_exists( 'rdc_supermap_filters' ) ) {
	/**
	 * Renders Filters for Supermap widget
	 */
	function rdc_supermap_filters( $instance, $instance_id ) {
		global $wp_properties;

		$fields = array();
		$search_fields = array();

		$placeholder_map = array(
			'random_75' => __( 'Select Location', 'rdc' ),
			'bedrooms' => __( 'Beds', 'rdc' ),
			'bathrooms' => __( 'Baths', 'rdc' ),
		);

		$default_icon = 'fa-filter';

		$icon_map = array(
			'random_75' => 'fa-map-pin',
			'bedrooms' => 'fa-bed',
			'bathrooms' => 'fa-tint',
			'price' => 'fa-usd',
		);

		if( !empty( $instance[ 'filter1' ] ) ) {
			array_push( $fields, array(
				'key' => $instance[ 'filter1' ],
				'label' => $instance[ 'filter1' ] == 's' ? __( 'Filter by', 'rdc' ) : $wp_properties['property_stats'][$instance[ 'filter1' ]],
				'placeholder' => $instance[ 'filter1' ] == 's' ? __( 'Name, Street...', 'rdc' ) : $wp_properties['property_stats'][$instance[ 'filter1' ]],
				'type' => $instance[ 'filter1_type' ],
			) );
			array_push( $search_fields, $instance[ 'filter1' ] );
		}

		if( !empty( $instance[ 'filter2' ] ) ) {
			array_push( $fields, array(
				'key' => $instance[ 'filter2' ],
				'label' => $instance[ 'filter2' ] == 's' ? __( 'Filter by', 'rdc' ) : $wp_properties['property_stats'][$instance[ 'filter2' ]],
				'placeholder' => $instance[ 'filter2' ] == 's' ? __( 'Name, Street...', 'rdc' ) : $wp_properties['property_stats'][$instance[ 'filter2' ]],
				'type' => $instance[ 'filter2_type' ],
			) );
			array_push( $search_fields, $instance[ 'filter2' ] );
		}

		if( !empty( $instance[ 'filter3' ] ) ) {
			array_push( $fields, array(
				'key' => $instance[ 'filter3' ],
				'label' => $instance[ 'filter3' ] == 's' ? __( 'Filter by', 'rdc' ) : $wp_properties['property_stats'][$instance[ 'filter3' ]],
				'placeholder' => $instance[ 'filter3' ] == 's' ? __( 'Name, Street...', 'rdc' ) : $wp_properties['property_stats'][$instance[ 'filter3' ]],
				'type' => $instance[ 'filter3_type' ],
			) );
			array_push( $search_fields, $instance[ 'filter3' ] );
		}

		if( !empty( $instance[ 'filter4' ] ) ) {
			array_push( $fields, array(
				'key' => $instance[ 'filter4' ],
				'label' => $instance[ 'filter4' ] == 's' ? __( 'Filter by', 'rdc' ) : $wp_properties['property_stats'][$instance[ 'filter4' ]],
				'placeholder' => $instance[ 'filter4' ] == 's' ? __( 'Name, Street...', 'rdc' ) : $wp_properties['property_stats'][$instance[ 'filter4' ]],
				'type' => $instance[ 'filter4_type' ],
			) );
			array_push( $search_fields, $instance[ 'filter4' ] );
		}

		$searchable_property_types = ud_get_wp_property( 'searchable_property_types', array() );

		$search_values = WPP_F::get_search_values( $search_fields, $searchable_property_types );

		?>
		<div class="rdc-supemap-filters">
			<div class="column-wrapper">
				<form action="" class="formFilter" id="formFilter_<?php echo $instance_id ?>" class="rdc-supemap-filter" name="formFilter">
					<?php if( !empty( $fields ) ) : ?>
						<ul><?php foreach( $fields as $field ) : ?><li class="filter-attribute <?php echo $field[ 'key' ]; ?>">
									<label>
										<i class="icon fa <?php echo array_key_exists( $field[ 'key' ], $icon_map ) ? $icon_map[ $field[ 'key' ] ] : $default_icon; ?>"></i>
										<?php
										ob_start();
										wpp_render_search_input( array(
											'attrib' => $field[ 'key' ],
											'search_values' => $search_values,
											'value' => '',
											'input_type' => $field[ 'type' ],
											'placeholder' => $field[ 'placeholder' ]
										) );
										$html = ob_get_clean();
										$label = array_key_exists( $field[ 'key' ], $placeholder_map ) ? $placeholder_map[ $field[ 'key' ] ] : $field[ 'label' ];
										$html = str_replace( 'Any', $label, $html );
										echo $html;
										?>
									</label>
								</li><?php endforeach; ?>
						</ul>
					<?php endif; ?>
					<input type="button" class="submit-filters button" value="<?php _e( 'Search', 'rdc' ); ?>" data-instance_id="<?php echo $instance_id; ?>" />
				</form>
			</div>
		</div>
	<?php
	}
}

class SiteOrigin_Widget_Supermap_Widget extends SiteOrigin_Widget {

	function __construct() {

		$attributes = array(
			'0' => 'Not Selected',
		);
		$sattrs = ud_get_wp_property( 'searchable_attributes', array() );
		if( !empty( $sattrs ) && is_array( $sattrs ) ) {
			foreach( $sattrs as $k ) {
				$attributes[ $k ] =  ud_get_wp_property( "property_stats.{$k}", "No label" );
			}
		}
		$attributes['s'] = __('Full Text', 'rdc');

		$types = array(
			'range_dropdown' => 'Range Dropdown',
			'dropdown' => 'Dropdown',
			'input' => 'Text Input'
		);

		parent::__construct(
			'rdc-supermap',
			__('RDC Supermap', 'rdc'),
			array(
				'description' => __('Display RDC Supermap.', 'rdc'),
				'has_preview' => false
			),
			array(),
			array(
				'label' => array(
					'type' => 'text',
					'label' => __( 'Label', 'rdc' )
				),
				'tagline' => array(
					'type' => 'text',
					'label' => __( 'Tagline', 'rdc' )
				),
				'filters'        => array(
					'type'        => 'section',
					'label'       => __( 'Filters', 'rdc' ),
					'hide'        => false,
					'description' => __( 'Filters Form', 'rdc' ),
					'fields'      => array(
						'filter1' => array(
							'type' => 'select',
							'label' => __( 'Filter 1', 'rdc' ),
							'options' => $attributes
						),
						'filter1_type' => array(
							'type' => 'select',
							'label' => __( 'Filter 1 Type', 'rdc' ),
							'options' => $types
						),
						'filter2' => array(
							'type' => 'select',
							'label' => __( 'Filter 2', 'rdc' ),
							'options' => $attributes
						),
						'filter2_type' => array(
							'type' => 'select',
							'label' => __( 'Filter 2 Type', 'rdc' ),
							'options' => $types
						),
						'filter3' => array(
							'type' => 'select',
							'label' => __( 'Filter 3', 'rdc' ),
							'options' => $attributes
						),
						'filter3_type' => array(
							'type' => 'select',
							'label' => __( 'Filter 3 Type', 'rdc' ),
							'options' => $types
						),
						'filter4' => array(
							'type' => 'select',
							'label' => __( 'Filter 4', 'rdc' ),
							'options' => $attributes
						),
						'filter4_type' => array(
							'type' => 'select',
							'label' => __( 'Filter 4 Type', 'rdc' ),
							'options' => $types
						),
					)
				),
			)
		);
	}

	function initialize() {
		$this->register_frontend_scripts(
			array(
				array(
					'rdc-supermap-widget',
					get_stylesheet_directory_uri() . '/lib/so_widgets/so-supermap-widget/js/supermap.js',
					array( 'jquery' ),
					'1.0',
					true
				)
			)
		);
		$this->register_frontend_styles(
			array(
				array(
					'rdc-supermap-widget',
					get_stylesheet_directory_uri() . '/lib/so_widgets/so-supermap-widget/css/style.css',
					array(),
					'1.0',
				)
			)
		);
	}

	function get_template_name($instance){
		return 'base';
	}

	function get_style_name($instance){
		return false;
	}
}

siteorigin_widget_register('supermap', __FILE__);