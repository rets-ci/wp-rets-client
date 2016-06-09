<?php

/**
 *
 */
namespace UsabilityDynamics\RDC {

  if ( !class_exists( '\UsabilityDynamics\RDC\Bootstrap' ) ) {

    /**
     * Class Bootstrap
     * @package UsabilityDynamics\RDC
     */
    class Bootstrap {

      /**
       * Bootstrap constructor.
       */
      public function __construct() {

        /**
         * Ajax
         */
        new Ajax();

        /**
         * Property Hooks
         */
        new PropertyHooks();

        /**
         *
         */
        new Customizer();

        /**
         * Thumbs support
         */
        add_theme_support('post-thumbnails');

        /**
         * Menu registered
         */
        register_nav_menu('main-menu', 'Main menu');

        /**
         * Remove unwanted
         */
        remove_action( 'wp_head', 'print_emoji_detection_script', 7);
        remove_action( 'wp_print_styles', 'print_emoji_styles');
        remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
        remove_action( 'admin_print_styles', 'print_emoji_styles' );

        /**
         *
         */
        add_action('init', array( $this, 'register_post_types' ));

        /**
         * Init widgets
         */
        add_action('widgets_init', array( $this, 'register_widgets' ));

        /**
         * Frontend scripts
         */
        add_action('wp_enqueue_scripts', array( $this, 'frontend_scripts' ));

        /**
         * Parse Search Request and redirect to Taxonomy page
         *
         * @author peshkov@UD
         */
        add_filter( "parse_request", array( $this, 'parse_request' ), 1 );

        /**
         *
         */
        add_filter( 'wpp::advanced_supermap::property_fields', array( $this, 'supermap_advanced_fields' ) );
        add_filter( 'wpp:supermap:query_defaults', array( $this, 'alter_supermap_query' ), 10, 2 );

        add_filter( 'wpp_post_type', array( $this, 'wpp_post_type_alter' ) );
        add_filter( 'wpp::register_taxonomy', array( $this, 'wpp_post_type_alter' ) );

        // facebook/twitter/google shortcode
        add_shortcode( 'share_this_article', array( 'UsabilityDynamics\RDC\Shortcodes', 'share_this_article' ) );

        // get any template part
        add_shortcode( 'template_part', array( 'UsabilityDynamics\RDC\Shortcodes', 'template_part' ) );

      }

      /**
       * @param $post_type_object
       * @return mixed
       */
      public function wpp_post_type_alter( $post_type_object ) {
        $post_type_object['rewrite']['with_front'] = false;
        return $post_type_object;
      }

      /**
       * @param $query
       * @param $atts
       * @return array
       */
      public function alter_supermap_query( $query, $atts ) {

        wp_localize_script( 'supermap-advanced', 'sm_current_filter', array_merge($atts, ( isset( $_REQUEST['wpp_search'] ) ? (array) $_REQUEST['wpp_search'] : array() ) ) );

        /**
         * @todo: could not find other place for this
         */
        wp_dequeue_style('bootstrap-css');

        $taxonomies = ud_get_wpp_terms( 'config.taxonomies', array() );

        $must_query = array(
          array(
            'exists' => array(
              'field' => 'tax_input'
            ),
            'exists' => array(
                'field' => '_system.location'
            )
          )
        );

        $must_not_query = array();

        $_location_selected = array();

        foreach( $query as $field => $value ) {
          if ( array_key_exists( $field, $taxonomies ) ) {

            if ( !is_array( $value ) ) {

              $values = explode(',', $value);

              $labels = array();
              foreach ($values as $term) {
                $labels[] = get_term_by('slug', $term, $field)->name;
              }

              $must_query[] = array(
                'terms' => array(
                  'tax_input.' . $field => $labels
                )
              );

              if ( in_array( $field, apply_filters( 'rdc_taxonomy_keys', array( 'high_school', 'middle_school', 'elementary_school', 'location_country', 'location_zip', 'neighborhood', 'location_city' ) ) ) ) {
                $_location_selected = array(
                  'key' => $field,
                  'values' => $labels
                );
              }

            } else {

              $ranges = array();

              if ( array_key_exists( 'min', $value ) && !empty( $value['min'] ) ) {
                $ranges = array(
                  'gte' => $value['min']
                );
              }

              if ( array_key_exists( 'max', $value ) && !empty( $value['max'] ) ) {
                $ranges['lte'] = $value['max'];
              }

              if ( !empty( $ranges ) ) {
                $must_query[] = array(
                    'range' => array(
                        'tax_input.' . $field => $ranges
                    )
                );
              }

            }

          }
        }

        $must_tax_query = array();
        if( is_tax() && ! empty( $queried_object = get_queried_object() ) ) {
          $must_tax_query = array(
              'terms' => array(
                  'tax_input.' . $queried_object->taxonomy => array( $queried_object->name ),
              ),
          );
        }
        $rdc_listing = true;
        $rdc_listing_query = array(
            'terms' => array(
                'tax_input.listing_office' => array( 'Red Door Company' ),
            ),
        );
        //check if current page is rdc listing or not - tax query can tell us on which page we are on currently
        if( $rdc_listing_query == $must_tax_query ) {
          $rdc_listing_query = array();
          $rdc_listing = false;
        }

        wp_localize_script( 'supermap-advanced', 'sm_current_terms', $_location_selected );
        wp_localize_script( 'supermap-advanced', 'sm_must_tax_query', $must_tax_query );
        wp_localize_script( 'supermap-advanced', 'sm_rdc_listing', $rdc_listing );
        wp_localize_script( 'supermap-advanced', 'sm_rdc_listing_query', $rdc_listing_query );

        $_query = array(
          'bool' => array(
            'must' => $must_query,
            'must_not' => $must_not_query
          )
        );

        return $_query;
      }

      /**
       * @param $fields
       * @return array
       */
      public function supermap_advanced_fields( $fields ) {
        return array_merge( array(
            'post_title',
            'tax_input.location_latitude',
            'tax_input.location_longitude',
            '_permalink',
            'tax_input.listing_type',
            'tax_input.bedrooms',
            'tax_input.bathrooms',
            'tax_input.price',
            'tax_input.total_living_area_sqft',
            'tax_input.days_on_market',
            'tax_input.acres',
            'tax_input.price_per_sqft',
            'tax_input.approximate_lot_size',
            'tax_input.subdivision',
            'tax_input.neighborhood',
            'tax_input.added',
            'tax_input.sale_type',
            'tax_input.location_city',
            'tax_input.location_street_number',
            'tax_input.location_direction',
            'tax_input.location_street',
            'tax_input.location_unit',
        ), ud_get_wp_property( 'configuration.feature_settings.supermap.display_attributes', array() ) );
      }

      /**
       * @param $query
       * @return mixed
       */
      public function parse_request( $query ) {

        if( !empty( $_POST[ 'wpp_search' ] ) && !empty( $_POST[ '_term' ] ) ) {

          $term = $_POST[ '_term' ];
          $term = is_numeric( $term ) ? (int)$term : $term;
          $term_object = get_term( $term );

          $_redirect = get_term_link( $term );

          if ( $term_object->taxonomy == 'mls_id' ) {
            $p_query = new \WP_Query(
              array(
                'post_type' => 'property',
                'tax_query' => array(
                  array(
                    'taxonomy' => $term_object->taxonomy,
                    'field'    => 'term_id',
                    'terms'    => $term_object->term_id,
                  )
                )
              )
            );
          }

          if ( !empty( $p_query->posts ) && count( $p_query->posts ) > 0 ) {
            wp_redirect( get_permalink( $p_query->posts[0]->ID ) );
            exit;
          }

          if( is_wp_error( $_redirect ) ) {
            return $query;
          }

          $_query = http_build_query( apply_filters( 'wpp::search::query', array( 'wpp_search' => $_POST[ 'wpp_search' ] ) ), '', '&' );
          $_redirect .= ( strpos( $_redirect, '?' ) === false ? '?' : '&' ) . $_query;
          wp_redirect( $_redirect );
          die();
        }

        return $query;

      }

      /**
       *
       */
      public function register_post_types() {

        register_post_type('associations', array(
            'labels' => array(
                'name' => 'Association',
                'singular_name' => 'Association',
                'add_new' => 'Add association',
                'add_new_item' => 'add new association',
                'edit_item' => 'Edit association',
                'new_item' => 'New association',
                'view_item' => 'View association',
                'search_items' => 'Search association',
                'not_found' => 'Association not found',
                'not_found_in_trash' => 'Association not found in trash',
                'parent_item_colon' => ''
            ),
            'public' => true,
            'supports' => array('title', 'thumbnail'),
            'has_archive' => false,
            'exclude_from_search' => true

        ));
      }

      /**
       * Front End Scripts Loading
       */
      public function frontend_scripts() {
        wp_enqueue_script('jquery');
        wp_enqueue_script('jquery-ui-core');
        wp_enqueue_script('jquery-ui-accordion');
        wp_enqueue_script('bootstrap', get_stylesheet_directory_uri() . '/static/scripts/src/bootstrap.js', array(), '1.0.0');
        wp_enqueue_script('main', get_stylesheet_directory_uri() . '/static/scripts/src/main.js?nocache='.rand(0,100) . '', array('jquery'), '1.0.0');
        wp_enqueue_script('rdc-popups', get_stylesheet_directory_uri() . '/static/scripts/src/popups.js?nocache='.rand(0,10000).'', array('jquery'), '1.0.0');
        wp_enqueue_script('rdc-guides', get_stylesheet_directory_uri() . '/static/scripts/src/guides.js?nocache='.rand(0,10000).'', array('jquery'), '1.0.0');
        wp_enqueue_script('svgxuse', 'https://i.icomoon.io/public/524f31be7a/rdc/svgxuse.js');
        wp_enqueue_script('jquery.sticky', get_stylesheet_directory_uri() . '/static/scripts/src/jquery.sticky.js', array('jquery'), '1.0.0');
        wp_enqueue_script('masonry', 'https://npmcdn.com/masonry-layout@4.0/dist/masonry.pkgd.js', array('jquery'), '4.0');
        wp_enqueue_script('isotope', get_stylesheet_directory_uri() . '/static/scripts/src/isotope.min.js', array( 'jquery' ), '1.0.0' );
        wp_enqueue_script('select2.min', get_stylesheet_directory_uri() . '/static/scripts/src/select2.min.js', array('jquery'), '1.0.0');
        wp_enqueue_script('rdc-custom-validate', 'https://cloud.crm.powerobjects.net/powerWebFormV3/scripts/jquery-1.9.0.validate.min.js', array('jquery') );
        wp_enqueue_script('rdc-custom-ui', 'https://cloud.crm.powerobjects.net/powerWebFormV3/scripts/jquery-ui-1.8.17.custom.min.js', array('jquery') );
        wp_enqueue_script('touch-swipe');

        wp_enqueue_style('style', get_stylesheet_directory_uri() . '/static/styles/style.css?nocache='.rand(0,10000));
        wp_enqueue_style('agents-carousel', get_stylesheet_directory_uri() . '/static/styles/src/agents-carousel.css');

        //if ( is_singular( 'property' ) ) {
          wp_enqueue_script('agents-carousel', get_stylesheet_directory_uri(). '/static/scripts/src/agents-carousel.js', array('jquery'), '1.0.0');
       // }

          wp_enqueue_script('jquery-search-form', get_stylesheet_directory_uri(). '/static/scripts/src/jquery-search-form.js?nocache='.rand(0,10000).'', array('jquery'), '1.0.0');

        $recaptcha = get_theme_mod( 'rdc_recaptcha_key' );
        if( !empty( $recaptcha ) ) {
          wp_enqueue_script( 'google-recaptcha-api', 'https://www.google.com/recaptcha/api.js' );
        }
      }


      /**
       *
       */
      public function register_widgets() {

        if (function_exists('register_sidebar')) {

          register_sidebar(array(
              'name' => 'Footer area 1',
              'id' => 'footer_area_1',
              'before_widget' => '<div id="%1$s" class="widget %2$s">',
              'after_widget' => '</div>',
              'before_title' => '<h2 class="offscreen">',
              'after_title' => '</h2>',
          ));
          register_sidebar(array(
              'name' => 'Footer area 2',
              'id' => 'footer_area_2',
              'before_widget' => '<div id="%1$s" class="widget %2$s">',
              'after_widget' => '</div>',
              'before_title' => '<h2 class="offscreen">',
              'after_title' => '</h2>',
          ));
          register_sidebar(array(
              'name' => 'Footer area 3',
              'id' => 'footer_area_3',
              'before_widget' => '<div id="%1$s" class="widget %2$s">',
              'after_widget' => '</div>',
              'before_title' => '<h2 class="offscreen">',
              'after_title' => '</h2>',
          ));
          register_sidebar(array(
              'name' => 'Single-sidebar',
              'id' => 'single-sidebar',
              'before_widget' => '<div id="%1$s" class="widget %2$s">',
              'after_widget' => '</div>',
              'before_title' => '<h2 class="offscreen">',
              'after_title' => '</h2>',
          ));

          register_sidebar(array(
              'name' => 'Guide Article Footer',
              'id' => 'guide-article-footer',
              'before_widget' => '<aside id="%1$s" class="widget %2$s">',
              'after_widget' => '</aside>',
              'before_title' => '<h2 class="offscreen">',
              'after_title' => '</h2>',
          ));

        }

        if ( function_exists( 'register_widget' ) ) {
          register_widget('\UsabilityDynamics\RDC\Guide_content_Widget');
          register_widget('\UsabilityDynamics\RDC\RDC_Callout_Widget');
        }
      }
    }
  }
}