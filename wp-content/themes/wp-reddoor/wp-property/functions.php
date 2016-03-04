<?php
/**
 * WP-Property and its Add-ons Hooks.
 */

/**
 * Extend JavaScript var 'wpp' with search values,
 * which are needed for rendering custom search form on supermap.
 */
add_filter( '__DISABLED__wpp::get_instance', function( $data ) {

  $data[ 'search_data' ] = array(
    'property_type' => array()
  );

  /* Property Types */
  foreach( ud_get_wp_property('property_types', array()) as $k => $v ) {
    array_push( $data[ 'search_data' ][ 'property_type' ], array(
      'value' => $k,
      'label' => $v,
    ) );
  }

  /**
   * Specific Attributes
   * We are setting attributes manually for better perfomance
   * since there are a lot of attributes in project
   */
  $search_values = \WPP_F::get_search_values( apply_filters( 'rdc::search_values::attributes', array(
    'random_75', // Location
    'bathrooms',
    'bedrooms',
    'price',
    'listing_type', // Listing Type
    'prop_type', // Prop Type
    'status', // Status,
    'status_2', // Status 2,
    'status_detail', // Status Detail
    'area', // SQFT
    'acres', // Lot Size
    'year_built',
  ) ), ud_get_wp_property( 'searchable_property_types' ) );

  foreach( (array)$search_values as $key => $values ) {

    $predefined_values = trim( ud_get_wp_property("predefined_search_values.{$key}") );

    if(
      in_array( $key, ud_get_wp_property( 'numeric_attributes', array() ) ) ||
      in_array( $key, ud_get_wp_property( 'currency_attributes', array() ) )
    ) {
      $values = !empty( $predefined_values ) ? explode( ',', $predefined_values ) : group_search_values( $values );
    } else {
      $values = !empty( $predefined_values ) ? explode( ',', $predefined_values ) : $values;
    }

    $data[ 'search_data' ][ $key ] = array();
    foreach( (array)$values as $value ) {
      array_push( $data[ 'search_data' ][ $key ], array(
        'value' => $value,
        'label' => $value,
      ) );
    }

  }

  $data[ 'search_values' ] = array();
  foreach( $data[ 'search_data' ] as $key => $d ) {
    $values = array();
    foreach( $d as $v ) {
      array_push( $values, $v['label'] );
    }
    $data[ 'search_values' ][ $key ] = $values;
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