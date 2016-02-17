<?php
/**
 * WP-Property and its Add-ons Hooks.
 */

/**
 * Extend JavaScript var 'wpp' with search_values,
 * which are needed for rendering custom search form on supermap.
 */
add_filter( 'wpp::get_instance', function( $data ) {
  $data[ 'search_values' ] = array();

  $search_values = \WPP_F::get_search_values( array(
    'random_75', // Location
    'bathrooms',
    'bedrooms',
    'price',
    'listing_type', // Listing Type
    'prop_type', // Prop Type
    'status', // Status
    'area', // SQFT
    'acres', // Lot Size
    'year_built',
  ), ud_get_wp_property( 'searchable_property_types' ) );

  foreach( (array)$search_values as $key => $values ) {

    switch( $key ) {
      case 'bathrooms':
      case 'bedrooms':
      case 'price':
      case 'area':
      case 'acres':
        $predefined_values = trim( ud_get_wp_property("predefined_search_values.{$key}") );
        $data[ 'search_values' ][ $key ] = !empty( $predefined_values ) ? explode( ',', $predefined_values ) : group_search_values( $values );
        break;

      default:
        $data[ 'search_values' ][ $key ] = $values;
        break;
    }

  }

  return $data;
} );

//** SUPERMAP HOOKS */

/**
 * Map column classes.
 *
 * Redeclare default width by setting 'col-md-7' class
 */
add_filter( 'wpp::advanced_supermap::map_column_classes', function(){
  return 'col-md-7';
} );

/**
 * Properties Table column classes.
 *
 * Redeclare default width by setting 'col-md-4' class
 */
add_filter( 'wpp::advanced_supermap::table_column_classes', function(){
  return 'col-md-5';
}  );

/**
 * Custom Property Search Form template.
 *
 */
add_filter( 'wpp::advanced_supermap::property_search::form', function( $content ){
  ob_start();
  get_template_part('templates/supermap/search-form');
  return ob_get_clean();
} );

/**
 * Current Property Details content
 */
add_filter( 'wpp::advanced_supermap::current_property::details', function( $content ) {
  ob_start();
  get_template_part('templates/supermap/current-property');
  return ob_get_clean();
} );

/**
 * Total Results Label.
 */
add_filter( 'wpp::advanced_supermap::total_results::label', function( $content ) {
  return $content;
} );

/**
 * No Results content
 */
add_filter( 'wpp::advanced_supermap::no_results', function( $content ) {
  return $content;
} );