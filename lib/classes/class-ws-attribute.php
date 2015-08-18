<?php
/**
 * Walk Score Attribute Handler
 *
 * @since 1.0.0
 */
namespace UsabilityDynamics\WPP {

  if( !class_exists( 'UsabilityDynamics\WPP\WS_Attribute' ) ) {

    class WS_Attribute {

      /**
       * Constructor.
       *
       */
      public function __construct() {

        add_action( 'init', array( $this, 'setup_walkscore_attribute' ) );

        add_filter( 'wpp::rwmb_meta_box::field', array( $this, 'remove_rwmb_meta_box_field' ), 99, 3 );

      }

      /**
       * Adds attribute directly to WP-Property settings if it does not exist.
       * Attribute is required and CAN NOT BE REMOVED!!
       *
       */
      public function setup_walkscore_attribute() {
        global $wp_properties;

        $attributes = ud_get_wp_property( 'property_stats', array() );

        /** Add Walk Score Attribute if it does not exist */
        if( !array_key_exists( '_ws_walkscore', $attributes ) ) {

          $attributes = array_merge( array(
            '_ws_walkscore' => __( 'Walk Score', ud_get_wpp_walkscore('domain') )
          ), $attributes );

          /* Set boolean 'false' at first to save the correct order on set new values. */
          ud_get_wp_property()->set( 'property_stats', false );
          ud_get_wp_property()->set( 'property_stats', $attributes );

        }

        /** Be sure that Walk Score is numeric. */
        /** We prohibit to select Data Entry manually for this attribute. */
        ud_get_wp_property()->set( 'admin_attr_fields._ws_walkscore', 'number' );

        /** Be sure that Walk Score has any selected search input. */
        $search_input = ud_get_wp_property( 'searchable_attr_fields._ws_walkscore' );
        if( empty( $search_input ) ) {
          ud_get_wp_property()->set( 'searchable_attr_fields._ws_walkscore', 'range_input' );
        }

        $wp_properties = ud_get_wp_property()->get();

      }

      /**
       *
       */
      public function remove_rwmb_meta_box_field( $field, $slug, $post ) {
        if( $slug == '_ws_walkscore' && is_numeric( $post->ID ) && $post->post_type == 'property' ) {
          $field['type'] = 'hidden';
        }
        return $field;
      }

    }

  }

}
