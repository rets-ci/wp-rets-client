<?php
/**
 * Plugin Name: Shameless Hacks
 * Plugin URI: http://usabilitydynamics.com/plugins/
 * Description: System hacks.
 * Author: Usability Dynamics, Inc.
 * Version: 0.1.0
 * Author URI: http://usabilitydynamics.com
 *
 */

add_filter( 'postmeta_form_keys', function() { return array(); });
add_filter( 'media_library_months_with_files', function() { return array(); });
add_filter( 'media_library_show_audio_playlist', function() { return false; });
add_filter( 'media_library_show_video_playlist', function() { return false; });

add_filter( 'ud:errors:admin_notices', function() { return null; });
add_filter( 'ud:messages:admin_notices', function() { return null; });
add_filter( 'ud:warnings:admin_notices', function() { return null; });

/**
 *
 * Add rets_mls_number and wpp_address_formatted_simple to search input.
 *
 * Add wpp_address_formatted_simple and rets_mls_number to title payload.
 *
 */
add_filter( 'wpp:elastic:title_suggest', function( $title_suggest, $post_args, $post_id ) {

  // add MLS Number and Formatted Address
  $title_suggest['input'] = array_filter( array_merge(
    $title_suggest['input'],
    $post_args['post_meta']['rets_mls_number'],
    isset( $post_args['post_meta']['wpp_address_formatted_simple'] ) ? $post_args['post_meta']['wpp_address_formatted_simple'] : array()
  ));

  $contexts = !empty( $title_suggest['contexts'] ) ? $title_suggest['contexts'] : array();

  if( empty( $contexts[ 'sale_status' ] ) ) {
    $contexts['sale_status'] = rdc_get_suggest_contexts( $post_id, 'wpp_sale_status' );
  }

  if( empty( $contexts[ 'listing_type_status' ] ) ) {
    $contexts[ 'listing_type_status' ] = array();
  }

  if(
    !empty( $contexts['listing_type'] ) && is_array( $contexts['listing_type'] ) &&
    !empty( $contexts['sale_status'] ) && is_array( $contexts['sale_status'] )
  ) {
    foreach( $contexts['listing_type'] as $type_slug => $type_value ) {
      foreach( $contexts['sale_status'] as $status_slug => $status_value ) {
        if( strpos( $type_slug, 'slug-' ) === 0 && strpos( $status_slug, 'slug-' ) === 0 ) {
          array_push( $contexts[ 'listing_type_status' ], $type_value . '-' . $status_value );
        }
        else if( strpos( $type_slug, 'name-' ) === 0 && strpos( $status_slug, 'name-' ) === 0 ) {
          array_push( $contexts[ 'listing_type_status' ], $type_value . ' ' . $status_value );
        }
      }
    }
  }

  $title_suggest['contexts'] = $contexts;

  return $title_suggest;

}, 100, 3 );

add_filter( 'wpp:elastic:prepare', function( $post_args, $post_id ) {

  $_wpp_media = array();

  $_attached = get_attached_media( 'image', $post_id );

  foreach( (array) $_attached as $_media_item ) {

    $_wpp_media[] =  array(
      "id" => $_media_item->ID,
      "url" => $_media_item->guid,
      "mime" => $_media_item->post_mime_type,
    );

  }

  $post_args['wpp_media'] = $_wpp_media;

  return $post_args;

}, 80, 2 );

add_filter( 'wpp:elastic:prepare', function( $post_args, $post_id ) {

  $latitude = get_post_meta( $post_id, 'wpp_location_latitude', true );
  if( empty( $latitude ) && $latitude == '0' ) {
    $latitude = get_post_meta( $post_id, 'latitude', true );
  }

  $longitude = get_post_meta( $post_id, 'wpp_location_longitude', true );
  if( empty( $longitude ) && $longitude == '0' ) {
    $longitude = get_post_meta( $post_id, 'longitude', true );
  }

  if( !empty( $latitude ) && !empty( $longitude ) ) {
    $post_args[ 'post_meta' ][ 'wpp_location_pin' ] = array($latitude,$longitude);
  }

  return $post_args;

}, 50, 2 );

/**
 *
 * `wp property trigger --do-action=fix_wpp_settings`
 *
 */
add_action( 'wpp::cli::trigger::fix_wpp_settings', function( $args ) {

  $wpp_settings = ud_get_wp_property()->get();

  $wpp_settings = SH_Array_cleaner::clean( $wpp_settings );

  update_option('wpp_settings', $wpp_settings);

} );


function rdc_get_suggest_contexts( $post_id, $taxonomy ) {

  $terms = wp_get_object_terms( $post_id, $taxonomy );

  if( empty( $terms ) ) {
    return $terms;
  }

  $contexts = array();
  foreach( $terms as $term ) {
    $contexts[ sanitize_title( 'slug-' . $term->slug ) ] = $term->slug;
    $contexts[ sanitize_title( 'name-' . $term->name ) ] = $term->name;

  }

  $contexts = array_unique( $contexts );

  return $contexts;

}

class SH_Array_cleaner {

  static function clean( $arr ) {
    if( is_array( $arr ) ) {
      foreach( $arr as $k => $e ) {
        if( is_array( $e ) && !empty( $e ) && !self::isAssoc( $e ) && is_string($e[0]) ) {

          $_e = array_unique( $e );

          //* Prints
          if( md5( json_encode( $_e ) ) !== md5( json_encode( $e ) ) ) {
            echo "<pre>";
            print_r($e);
            echo "</pre>";

            echo "<pre>";
            print_r($_e);
            echo "</pre>";
          }
          //*/

          $arr[ $k ] = $_e;

        } else if ( is_array( $e ) && !empty( $e ) && self::isAssoc( $e ) ) {
          $arr[$k] = self::clean( $e );
        }
      }
    }
    return $arr;
  }

  static function isAssoc(array $arr) {
    if (array() === $arr) return false;
    return array_keys($arr) !== range(0, count($arr) - 1);
  }

}

