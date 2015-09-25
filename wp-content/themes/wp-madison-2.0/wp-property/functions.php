<?php
/**
 * WP Property Specific Functions.
 *
 * This file only loads of WPP_Version is defined.
 * In other words, this file only loads if WP Property
 * is currently active.
 *
 * @package Madison
 * @author Justin Kopepasah
 * @since 1.0.0
*/

/**
 * Filter WP Property custom styles.
*/
add_filter( 'wpp::custom_styles', '__return_true' );

/**
 * Enqueue scripts and styles.
 *
 * @since 1.0.0
 */
function madison_wpp_scripts() {
	wp_deregister_style( 'wp-property-frontend' );
	// wp_deregister_style( 'wpp-jquery-fancybox-css' );
	// wp_deregister_script( 'wpp-jquery-fancybox' );
	// wp_deregister_script( 'wp-property-frontend' );

	if ( is_singular( 'property' ) ) {
		wp_enqueue_script( 'madison-single-property', get_template_directory_uri() . '/js/property.js', array( 'jquery', 'slides' ), $GLOBALS['koop_theme_data']['version'], true );

		if ( $coords = WPP_F::get_coordinates() ) {
			wp_enqueue_script( 'madison-single-property-map', get_template_directory_uri() . '/js/property-map.js', array( 'jquery' ), $GLOBALS['koop_theme_data']['version'], true );
			$map_options = array(
				'id'        => get_the_ID() . '-map',
				'latitude'  => $coords['latitude'],
				'longitude' => $coords['longitude'],
				'zoom'      => ( ! empty( $GLOBALS['wp_properties']['configuration']['gm_zoom_level'] ) ? $GLOBALS['wp_properties']['configuration']['gm_zoom_level'] : 13 ),
				'icon'      => apply_filters( 'wpp_supermap_marker', '', get_the_ID() ),
			);
			wp_localize_script( 'madison-single-property-map', 'madison_property_map', $map_options );
		}
	}

	if ( is_property_overview_page() || ( is_page_template( 'page-templates/front-page.php' ) ) || is_page( 'properties' ) ) {
		wp_enqueue_script( 'madison-property-load-more', get_template_directory_uri() . '/js/property-overview.js', array( 'jquery', 'spin' ), '20140312', true );
	}

	if ( 'posts' != get_option( 'show_on_front' ) && is_front_page() ) {
		wp_enqueue_script( 'google-maps' );

		wp_enqueue_script( 'madison-front-page', get_template_directory_uri() . '/js/front-page.js', array( 'jquery', 'slides', 'backstretch' ), $GLOBALS['koop_theme_data']['version'], true );
	}
}
add_action( 'wp_enqueue_scripts', 'madison_wpp_scripts' );

/**
 * Add body_class for WP Property specific items.
 *
 * @since 1.0.0
 * @param string Body classes.
*/
function madison_wpp_body_class( $classes ) {
	if ( is_page_template( 'page-templates/front-page.php' ) ) {
		$classes[] = 'wpp-front-page';
	}

	return $classes;
}
add_action( 'body_class', 'madison_wpp_body_class' );

/**
 * Need to unregister and reregister WP Property
 * widget to use thecorrect markup of this theme.
 *
 * @since 1.0.0
*/
function madison_wpp_widgets_init() {
	if (
		!isset($GLOBALS['wp_properties'][ 'configuration' ][ 'do_not_register_sidebars' ]) ||
		$GLOBALS['wp_properties'][ 'configuration' ][ 'do_not_register_sidebars' ] != 'true'
	) {
		foreach( $GLOBALS['wp_properties'][ 'property_types' ] as $property_slug => $property_title ) {
			unregister_sidebar( 'wpp_sidebar_' . $property_slug );

			register_sidebar( array(
				'name'          => sprintf( __( 'Property: %s', 'madison' ), $property_title ),
				'id'            => 'wpp_sidebar_' . $property_slug,
				'description'   => sprintf( __( 'Sidebar located on the %s page.', 'madison' ), $property_title ),
				'before_widget' => '<aside id="%1$s"  class="widget wpp_widget %2$s">',
				'after_widget'  => '</aside>',
				'before_title'  => '<h2 class="widget-title">',
				'after_title'   => '</h2>',
			) );
		}
	}
}
add_action( 'wpp_post_init', 'madison_wpp_widgets_init', 101 );

/**
 * Set up a shortcode for a property grid.
 * It's just a wrapper for standard wp-property's [property_overview] shortcode.
 * which handles templates implementation.
 *
 * NOTE This functionality belongs in a plugin and will created in the future. - 2014-03-20 - koop
 *
 * @since 1.0.0
*/
function madison_wpp_property_grid_shortcode( $atts ) {

  // Set default template 'grid'.
  $atts = wp_parse_args(  $atts, array(
    'template' => 'grid',
  ) );
  
  // Have ability to use standard (default wp-property's) template. User should set template=default.
  $atts[ 'template' ] = ( $atts[ 'template' ] == 'default' ? false : $atts[ 'template' ] );
  
  switch( $atts[ 'template' ] ) {
  
    /**
     * Madison grid templates.
     * The following templates are using custom implementation.
     */
    case 'grid': // Two columns grid template
    case 'grid-3': // Actually, attribute columns=3 should be set instead of template=grid-3, but it also makes sense
    case 'grid-4': // Actually, attribute columns=4 should be set instead of template=grid-4, but it also makes sense
    
      // Set defaults.
      $defaults = array(
        'sort_by'          => 'menu_order',
        'sort_order'       => 'ASC',
        'fancybox_preview' => false,
        'sorter_type'      => 'none',
        'per_page'         => 10,
        'starting_row'     => 0,
        'class'            => 'property-overview-grid column-wrapper',
        'pagination'       => 'off',
        'hide_count'       => true
      );
      
      // The types of columns available.
      $columns = array( '3', '4' );

      // Set the columns.
      if ( isset( $atts['columns'] ) && in_array( $atts['columns'], $columns ) ) {
        $atts['template'] = 'grid-' . $atts['columns'];
        $atts['class'] = 'madison-property-overview property-overview-grid column-wrapper property-overview-grid-' . $atts['columns'];
      }

      if ( isset( $atts['template'] ) && $atts['template'] == 'list' ) {
        $atts['template'] = 'list';
      }

      // Enqueue property load more script.
      wp_enqueue_script( 'madison-property-load-more', get_template_directory_uri() . '/js/property-overview.js', array( 'jquery', 'spin' ), '20140312', true );
      
      $atts = wp_parse_args( $atts, $defaults );

      break;
      
    /**
     * Also Madison template
	 * 
	 * NOTE This template is just an idea that I was throwing together for use in the future. - Kopepasah
     */
    case 'list':
      // Do nothing ?
      break;
      
    /**
     * Also Madison template
	 *
	 * * NOTE This template is used on the front page (for displaying one featured property), when supermap is not active. I can be used in other places, but will need documentation. - Kopepasah
     */
    case 'full-width':
      // Do nothing ?
      break;
    
    /**
     * Standard wp-property templates
     */
    default:
      // Do nothing.
      break;
  
  }
  
	return WPP_Core::shortcode_property_overview( $atts );
}
// Replace original [property_overview] shortcode functionality with madison's one.
remove_shortcode( 'property_overview' );
add_shortcode( 'property_overview', 'madison_wpp_property_grid_shortcode' );

/**
 * AJAX function called load more properties on
 * on the property overview page.
 *
 * @since 1.0.0
 * @return string HTML output of properties.
*/
function madison_wpp_load_properties() {

	$atts = array(
		'fancybox_preview' => false,
		'sorter_type'      => 'none',
		'disable_wrapper'  => true,
		'pagination'       => 'off',
		'hide_count'       => true,
		'ajax_call'        => false
	);

  $atts = wp_parse_args( $_POST, $atts );

	echo WPP_Core::shortcode_property_overview( $atts );

	exit;
}
add_action( 'wp_ajax_madison-property-view-load-properties', 'madison_wpp_load_properties' );
add_action( 'wp_ajax_nopriv_madison-property-view-load-properties', 'madison_wpp_load_properties');

/**
 * Add the found amount to our custom templates
 * and add the loader to the bottom.
 *
 * @since 1.0.0
*/
function madison_wpp_filter_property_overview_render( $result ) {
	$templates = array(
		'grid',
		'grid-3',
		'grid-4',
		'list'
	);

	// If not in our custom template, pagination is on or the wrapper is disabled, bail.
	if ( ! in_array( $GLOBALS['wpp_query']['template'], $templates )|| $GLOBALS['wpp_query']['pagination'] != 'off' || $GLOBALS['wpp_query']['disable_wrapper'] == true ) {
		return $result;
	}

	$load_more = '';

  if ( !empty( $GLOBALS['wpp_query']['query'] ) && is_array($GLOBALS['wpp_query']['query']) ) {
    $_attribute_string = '';
    foreach( $GLOBALS['wpp_query']['query'] as $_field => $_value ) {
      if ( $_field == 'pagi' ) continue;
      $_attribute_string .= 'data-' . $_field . '="' . $_value . '" ';
    }
  }

	if ( $GLOBALS['wpp_query'][ 'properties' ]['total'] > $GLOBALS['wpp_query']['per_page'] ) {
		$load_more .= '<div id="property-overview-load-more">';
			$load_more .= '<a href class="btn" '.$_attribute_string.' data-append_to="wpp_shortcode_' . $GLOBALS['wpp_query']['unique_hash'] . '" data-starting_row="' . $GLOBALS['wpp_query']['per_page'] . '" data-per_page="' . $GLOBALS['wpp_query']['per_page'] . '" data-template="' . $GLOBALS['wpp_query']['template'] . '">' . __( 'Load More', 'madison' ) . '<i class="fa fa-plus"></i></a>';
		$load_more .= '</div>';
	}

	if ( $result['bottom'] ) {
		$result['bottom'] = $result['bottom'] . $load_more;
	} else {
		$result['bottom'] = $load_more;
	}

	return $result;
}
add_filter( 'wpp_property_overview_render', 'madison_wpp_filter_property_overview_render', 10 );

/**
 * Filter WP Property template paths.
 *
 * @since 1.0.0
*/
function madison_wpp_filter_possible_template_paths( $paths ) {
	array_unshift( $paths, get_template_directory() . '/wp-property' );

	return $paths;
}
add_filter( 'ud::template_part::path', 'madison_wpp_filter_possible_template_paths' );

/**
 * Add the property search to the header menu.
 *
 * NOTE todo make this work as as the full shortcode and not just the hardcoded search. - Kopepasah
 * @since 1.1.0
*/
function madison_wpp_header_menu_items( $items, $args ) {
	if ( $args->theme_location != 'header' ) {
		return $items;
	}

	ob_start()
		?>
			<li class="menu-item menu-item-property-search">
				<a href><i class="fa fa-search"></i></a>
			</li>
		<?php
	$items .= ob_get_clean();

	return $items;
}
// add_action( 'wp_nav_menu_items' , 'madison_wpp_header_menu_items', 101, 2 );