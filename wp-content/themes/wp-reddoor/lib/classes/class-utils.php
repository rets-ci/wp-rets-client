<?php

/**
 *
 */
namespace UsabilityDynamics\RDC {

  if ( !class_exists( '\UsabilityDynamics\RDC\Utils' ) ) {

    /**
     * Class Utils
     * @package UsabilityDynamics\RDC
     */
    class Utils {

      /**
       * @return int
       */
      public static function get_sale_properties_count() {

        $queryTermsSale = new \WP_Query(
          array(
            'post_type' => 'property',
            'tax_query' => array(
              array(
                'taxonomy' => 'sale_type',
                'field' => 'slug',
                'terms' => 'sale'
              )
            )
          )
        );

        return count($queryTermsSale->posts);
      }

      /**
       * @return int
       */
      public static function get_rent_properties_count() {

        $queryTermsRent = new \WP_Query(
          array(
            'post_type' => 'property',
            'tax_query' => array(
              array(
                'taxonomy' => 'sale_type',
                'field' => 'slug',
                'terms' => 'rent'
              )
            )
          )
        );

        return count($queryTermsRent->posts);
      }

      /**
       * @param bool $taxonomy
       * @param bool $property_id
       * @param string $field
       * @return string
       */
      public static function get_single_term( $taxonomy = false, $property_id = false, $field = 'name' ) {
        if ( !$taxonomy || !$property_id ) return '';
        $_terms = get_the_terms( $property_id, $taxonomy );
        return $_terms[0] ? $_terms[0]->$field : '';
      }

      /**
       * Return user object of an agent that matches rets agent byt some field
       *
       * @param $rets_agent_id
       * @param array $users
       * @param string $field_to_compare
       * @return bool
       */
      public static function get_matched_agent( $rets_agent_id, $users = array(), $field_to_compare = 'agent_mls_id' ) {

        if ( empty( $users ) ) {
          $users = get_users( array( 'role' => 'agent' ) );
        }

        if ( empty( $users ) ) return false;

        foreach( $users as $agent ) {

          if ( $rets_agent_id == get_user_meta( $agent->ID, $field_to_compare, 1 ) ) {
            return $agent;
          }

        }

        return false;

      }
    }
  }

}