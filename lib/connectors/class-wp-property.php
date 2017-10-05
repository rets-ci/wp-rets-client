<?php

/**
 * Compatibility connector for WP-Property
 */
namespace UsabilityDynamics\WPRETSC\Connectors {

  if ( !class_exists( 'UsabilityDynamics\WPRETSC\Connectors\WPProperty' ) ) {

    /**
     * Class WPProperty
     * @package UsabilityDynamics\WPRETSC\Connectors
     */
    final class WPProperty {

      /**
       * WPML constructor.
       */
      public function __construct() {

        /**
         * WP-Property: Supermap add-on support
         *
         * Ignore 'exclude_from_supermap' parameter
         */
        add_filter( 'wpp:supermap:query_defaults', function($query, $atts) {
          if( isset( $query['exclude_from_supermap'] ) ) {
            unset($query['exclude_from_supermap']);
          }
          return $query;
        }, 10, 2 );

        /**
         * Flush all object caches (WPP) related to current property
         */
        add_action( 'wrc::xmlrpc::on_flush_cache', function( $post_id ) {
          if( method_exists( '\UsabilityDynamics\WPP\Property_Factory', 'flush_cache' ) ) {
            //ud_get_wp_rets_client()->write_log( "Flushing WPP object cache for [" . $post_id . "] psot_id", 'info' );
            \UsabilityDynamics\WPP\Property_Factory::flush_cache( $post_id );
          }
        }, 10, 1 );

        /**
         *
         */
        add_action( 'wrc::manage_property::postmeta', function( $post_data, $options ) {
          $postmeta = array();
          foreach( (array) $post_data[ 'meta_input' ] as $_meta_key => $_meta_value ) {
            if( !empty( $_meta_value ) && isset( $options[ 'createWPPAttributes' ] ) && $options[ 'createWPPAttributes' ] ) {
              array_push( $postmeta, $_meta_key );
              if( $_meta_key === 'property_type' ) {
                self::create_wpp_property_type($_meta_value);
              }
            }
          }
          self::create_wpp_attributes($postmeta);
        }, 10, 2 );

        /**
         *
         */
        add_action( 'wrc::manage_property::taxonomies', function( $_post_data_tax_input, $options ){
          if( isset( $options[ 'createWPPTerms' ] ) && $options[ 'createWPPTerms' ] ) {
            self::create_wpp_taxonomies( array_keys( (array)$_post_data_tax_input ) );
          }
        }, 10, 2 );

      }

      /**
       * Create WP-Property attributes
       * And WP-Property attribute with provided key does not exist
       *
       * @param $keys
       */
      static public function create_wpp_attributes( $keys = array() ) {
        if( empty( $keys ) ) {
          return;
        }

        // We must ignore the following postmeta
        // to prevent different issues, on trying to manage it:
        $ignore_list = array(
          'property_type',
          'wpp::rets_pk',
          'wpp_import_time',
          'wpp_import_schedule_id',
          'address_is_formatted'
        );

        $wpp_settings = get_option( 'wpp_settings' );

        $added = false;

        foreach( (array)$keys as $key ) {
          // Break if Property Attribute already exists
          if( !empty( $wpp_settings[ 'property_stats' ][ $key ] ) || in_array($key,$ignore_list) ) {
            continue;
          }

          // Add attribute
          if( !isset( $wpp_settings[ 'property_stats' ] ) || !is_array($wpp_settings[ 'property_stats' ]) ) {
            $wpp_settings[ 'property_stats' ] = array();
          }
          // Make attribute hidden ( Admin Only ). So administrator would be able to manage it before it will be shown.
          $wpp_settings[ 'property_stats' ][ $key ] = ucwords( str_replace( '_', ' ', $key ) );

          if( !isset( $wpp_settings[ 'hidden_frontend_attributes' ] ) || !is_array($wpp_settings[ 'hidden_frontend_attributes' ]) ) {
            $wpp_settings[ 'hidden_frontend_attributes' ] = array();
          }
          if( !in_array( $key, $wpp_settings[ 'hidden_frontend_attributes' ] ) ) {
            $wpp_settings[ 'hidden_frontend_attributes' ][] = $key;
          }

          $added = true;
        }

        if($added) {
          update_option( 'wpp_settings', $wpp_settings );
        }
      }

      /**
       * Create WP-Property taxonomies
       * And WP-Property taxonomy with provided key does not exist
       *
       * @param $keys
       */
      static public function create_wpp_taxonomies( $keys = array() ) {

        if( empty( $keys ) ) {
          return;
        }

        // Break if WP-Property Terms not activate
        if( !function_exists( 'ud_get_wpp_terms' ) ) {
          return;
        }

        $taxonomies = ud_get_wpp_terms()->get( 'config.taxonomies', array() );

        $added = false;

        foreach( (array)$keys as $key ) {
          // Break if Taxonomy already exists
          if( !empty( $taxonomies[ $key ] ) ) {
            continue;
          }
          $taxonomies[ $key ] = ud_get_wpp_terms()->prepare_taxonomy( array(), ucwords( str_replace( '_', ' ', $key ) ) );
          $added = true;
        }

        if($added) {
          ud_get_wpp_terms()->set( 'config.taxonomies', $taxonomies );
          ud_get_wpp_terms()->settings->commit();
        }
      }

      /**
       * Add property type if it's missing
       *
       */
      static public function create_wpp_property_type( $type ) {
        $wpp_settings = get_option( 'wpp_settings' );
        if( is_array($wpp_settings) && empty( $wpp_settings['property_types'][$type] ) ) {
          $wpp_settings['property_types'][$type] = ucwords( str_replace( '_', ' ', $type ) );
          update_option( 'wpp_settings', $wpp_settings );
        }
      }

    }

  }

}