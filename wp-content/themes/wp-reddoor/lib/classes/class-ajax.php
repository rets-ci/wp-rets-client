<?php

/**
 *
 */
namespace UsabilityDynamics\RDC {

  if ( !class_exists( '\UsabilityDynamics\RDC\Ajax' ) ) {

    /**
     * Class Ajax
     * @package UsabilityDynamics\RDC
     */
    class Ajax {

      /**
       * Actions
       */
      private $actions = array(
        // slug => is_private
        'TermsSearchable' => 0,
        'mapFilterAutocomplete' => 0,
        'categoryCard' => 0
      );

      public function __construct() {

        foreach( $this->actions as $action => $is_private ) {

          if ( !is_callable( array( $this, $action ) ) ) continue;

          add_action( "wp_ajax_{$action}", array( $this, $action ) );
          if ( !$is_private ) {
            add_action( "wp_ajax_nopriv_{$action}", array( $this, $action ) );
          }

        }

        add_filter( 'rdc_search_taxonomy_label', array( $this, 'search_taxonomy_label' ) );

      }

      /**
       * @param $taxonomy_slug
       * @return mixed
       */
      public function search_taxonomy_label( $taxonomy_slug ) {

        $labels = apply_filters( 'rdc_taxonomy_labels', array(
            'high_school' => __('High School'),
            'middle_school' => __('Middle School'),
            'elementary_school' => __('Elementary School'),
            'location_country' => __('County'),
            'location_zip' => __('Zip'),
            'neighborhood' => __('Neighborhood'),
            'location_city' => __('City'),
            'mls_id' => __('MLS ID') ) );

        if ( array_key_exists( $taxonomy_slug, $labels ) ) {
          return $labels[$taxonomy_slug];
        }

        return $taxonomy_slug;
      }

      /**
       * Autocomplete search for terms
       */
      public function TermsSearchable() {

        $query = $_GET['q'];

        $_terms = get_terms( array(
          'taxonomy' => apply_filters( 'rdc_taxonomy_keys', array( 'high_school', 'middle_school', 'elementary_school', 'location_country', 'location_zip', 'neighborhood', 'location_city', 'mls_id' ) ),
          'search' => $query,
          'hierarchical' => false,
          'hide_empty' => true
        ) );

        $_terms = array_map( function( $data ) {

          return array(
              "id" => $data->term_id,
              "slug" => $data->slug,
              "name" => $data->name,
              "count" => $data->count,
              "taxonomy" => apply_filters('rdc_search_taxonomy_label', $data->taxonomy)
          );

        }, $_terms );

        wp_send_json(array(
            "ok" => true,
            "data" => apply_filters( 'rdc_autocomplete_locations_results', $_terms )
        ));

      }

      /**
       *
       */
      public function mapFilterAutocomplete() {

        $query = $_GET['q'];

        $_terms = get_terms( array(
            'taxonomy' => apply_filters( 'rdc_taxonomy_keys', array( 'high_school', 'middle_school', 'elementary_school', 'location_country', 'location_zip', 'neighborhood', 'location_city' ) ),
            'search' => $query,
            'hierarchical' => false,
            'hide_empty' => true
        ) );

        $_terms = array_map( function( $data ) {

          return array(
            "id" => $data->name,
            "slug" => $data->slug,
            "name" => $data->name,
            "count" => $data->count,
            "taxonomy_label" => apply_filters('rdc_search_taxonomy_label', $data->taxonomy),
            "taxonomy" => $data->taxonomy
          );

        }, $_terms );

        wp_send_json(array(
            "ok" => true,
            "data" => apply_filters( 'rdc_autocomplete_map_filter_results', $_terms )
        ));

      }

      /**
       * AJAX handler for showing category cards
       *
       * @author potanin@UD
       * @todo Make col-lg-4 configurable if ever needed. - potanin@UD
       */
      static public function categoryCard() {

        // @note Does not seem to work.
        header( 'cache-control:public,max-age=30' );

        query_posts(array(
          'post_type' => 'post',
          'posts_per_page' => $_GET['per_page'] ? $_GET['per_page'] : 3,
          'offset' => $_GET['offset'] ? $_GET['offset'] : 0,
          'category' =>  $_GET['category'] ? (int) $_GET['category'] : null
        ));

        if (have_posts()) { while (have_posts()) {
          the_post();
          echo '<div class="col-lg-4" data-element-kind="' . $_GET['kind'] . '">';
          get_template_part( 'static/views/category-card' );
          echo '</div>';
        } }

        die();

      }

    }
  }
}