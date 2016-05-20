<?php

/**
 *
 */
namespace UsabilityDynamics\RDC {

  if (!class_exists('\UsabilityDynamics\RDC\PropertyHooks')) {


    /**
     * WP-Property and its Add-ons Hooks.
     */
    class PropertyHooks {

      /**
       * PropertyHooks constructor.
       */
      function __construct() {

        /**
         * Extend JavaScript var 'wpp' with search values,
         * which are needed for rendering custom search form on supermap.
         */
        add_filter( '__DISABLED__wpp::get_instance', array( $this, 'disable_wpp_get_instance' ) );

        /**
         * Map column classes.
         *
         * Redeclare default width by setting 'col-md-7' class
         */
        add_filter('wpp::advanced_supermap::map_column_classes', function () {
          return 'col-md-7';
        });

        /**
         * Properties Table column classes.
         *
         * Redeclare default width by setting 'col-md-4' class
         */
        add_filter('wpp::advanced_supermap::table_column_classes', function () {
          return 'col-md-5';
        });

        /**
         * Custom Property Search Form template.
         *
         */
        add_filter('wpp::advanced_supermap::property_search::form', array( $this, 'wpp_advanced_supermap_property_search_form' ));

        /**
         * Current Property Details content
         */
        add_filter('wpp::advanced_supermap::current_property::details', array( $this, 'wpp_advanced_supermap_current_property_details' ));

        /**
         * Total Results Label.
         */
        add_filter('wpp::advanced_supermap::total_results::label', function ($content) {
          return $content;
        });

        /**
         * No Results content
         */
        add_filter('wpp::advanced_supermap::no_results', function ($content) {
          return $content;
        });

        /**
         * Validate reCAPTCHA and send form to external server.
         *
         */
        add_action( 'template_redirect', array( $this, 'rdc_form_action' ) );

        /**
         *
         */
        add_filter( 'wpp::supermap::template_path', array( $this, 'supermap_template_paths' ) );
      }

      /**
       * @param $paths
       * @return array
       */
      public function supermap_template_paths($paths) {
        array_unshift( $paths, get_stylesheet_directory() . '/static/views/supermap' );
        return $paths;
      }

      /**
       * RDC forms validator
       */
      public function rdc_form_action() {

        if( isset( $_REQUEST[ 'rdc_action' ] ) && $_REQUEST[ 'rdc_action' ] == 'submit_form' && !empty( $_POST[ 'rdc_fyb' ] ) ) {

          $key = get_theme_mod( 'rdc_recaptcha_key' );
          $secret = get_theme_mod( 'rdc_recaptcha_secret' );
          $redirect = isset( $_POST[ 'ignore_redirecturl' ] ) ? $_POST[ 'ignore_redirecturl' ] : '';

          try {

            if( !empty( $key ) && !empty( $secret ) ) {

              if (empty($_POST['g-recaptcha-response'])) {
                throw new Exception('No captcha response');
              }

              $recaptcha = $_POST['g-recaptcha-response'];
              unset($_POST['g-recaptcha-response']);

              $request = wp_remote_post('https://www.google.com/recaptcha/api/siteverify?secret=' . $secret . '&response=' . $recaptcha);

              if (is_wp_error($request) || wp_remote_retrieve_response_code($request) != 200) {
                throw new Exception('Invalid response from Captcha API');
              }

              $response = wp_remote_retrieve_body($request);
              $response = @json_decode($response, true);

              if (empty($response['success']) || !$response['success']) {
                throw new Exception('Captcha is not valid');
              }

            }

            $url = $_POST[ 'rdc_fyb' ];

            unset( $_POST[ 'rdc_fyb' ] );

            $data = $_POST;
            $data[ 'ignore_redirecturl' ] = '';

            $response = wp_remote_post( $url, array(
                'body' => $data,
            ) );

            if( is_wp_error( $response ) || wp_remote_retrieve_response_code( $response ) != 200 ) {
              throw new Exception( 'Invalid response from CRM Server' );
            }

          } catch( Exception $e ) {

            wp_redirect( home_url() . '/success/error' );

          }

          if( !empty( $redirect ) ) {
            wp_redirect( $redirect );
          } else {
            wp_redirect( home_url() );
          }

        }

      }

      /**
       * @param $content
       * @return string
       */
      public function wpp_advanced_supermap_current_property_details($content) {
        ob_start();
        get_template_part('static/views/supermap/current-property');
        return ob_get_clean();
      }

      /**
       * @param $content
       * @return string
       */
      public function wpp_advanced_supermap_property_search_form($content) {
        ob_start();
        get_template_part('static/views/supermap/search-form');
        return ob_get_clean();
      }

      /**
       * @param $data
       * @return mixed
       */
      public function disable_wpp_get_instance( $data ) {

        $data['search_data'] = array(
            'property_type' => array()
        );

        /* Property Types */
        foreach (ud_get_wp_property('property_types', array()) as $k => $v) {
          array_push($data['search_data']['property_type'], array(
              'value' => $k,
              'label' => $v,
          ));
        }

        /**
         * Specific Attributes
         * We are setting attributes manually for better perfomance
         * since there are a lot of attributes in project
         */
        $search_values = \WPP_F::get_search_values(apply_filters('rdc::search_values::attributes', array(
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
        )), ud_get_wp_property('searchable_property_types'));

        foreach ((array)$search_values as $key => $values) {

          $predefined_values = trim(ud_get_wp_property("predefined_search_values.{$key}"));

          if (
              in_array($key, ud_get_wp_property('numeric_attributes', array())) ||
              in_array($key, ud_get_wp_property('currency_attributes', array()))
          ) {
            $values = !empty($predefined_values) ? explode(',', $predefined_values) : group_search_values($values);
          } else {
            $values = !empty($predefined_values) ? explode(',', $predefined_values) : $values;
          }

          $data['search_data'][$key] = array();
          foreach ((array)$values as $value) {
            array_push($data['search_data'][$key], array(
                'value' => $value,
                'label' => $value,
            ));
          }

        }

        $data['search_values'] = array();
        foreach ($data['search_data'] as $key => $d) {
          $values = array();
          foreach ($d as $v) {
            array_push($values, $v['label']);
          }
          $data['search_values'][$key] = $values;
        }

        return $data;
      }
    }
  }

}