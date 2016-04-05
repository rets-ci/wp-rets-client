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
    }
  }

}