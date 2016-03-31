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

      }

      /**
       * @param $query
       * @return mixed
       */
      public function parse_request( $query ) {

        if( !empty( $_POST[ 'wpp_search' ] ) && !empty( $_POST[ '_term' ] ) ) {

          $term = $_POST[ '_term' ];
          $term = is_numeric( $term ) ? (int)$term : $term;
          $_redirect = get_term_link( $term );

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
       *
       */
      public function frontend_scripts() {
        wp_enqueue_script('jquery');
        wp_enqueue_script('jquery-ui-core');
        wp_enqueue_script('jquery-ui-accordion');
        wp_enqueue_script('bootstrap', get_stylesheet_directory_uri() . '/static/scripts/src/bootstrap.js');
        wp_enqueue_script('main', get_stylesheet_directory_uri() . '/static/scripts/src/main.js?nocache='.rand(0,1000));
        wp_enqueue_script('svgxuse', 'https://i.icomoon.io/public/524f31be7a/rdc/svgxuse.js');
        wp_enqueue_script('jquery.sticky', get_stylesheet_directory_uri() . '/static/scripts/src/jquery.sticky.js');
        wp_enqueue_script('masked', get_stylesheet_directory_uri() . '/static/scripts/src/masked.js');
        wp_enqueue_script('select2.min', get_stylesheet_directory_uri() . '/static/scripts/src/select2.min.js');
        wp_enqueue_style('style', get_stylesheet_directory_uri() . '/static/styles/style.css?nocache='.rand(0,100));
        wp_enqueue_script( 'rdc-custom-validate', 'https://cloud.crm.powerobjects.net/powerWebFormV3/scripts/jquery-1.9.0.validate.min.js', array('jquery') );
        wp_enqueue_script( 'rdc-custom-ui', 'https://cloud.crm.powerobjects.net/powerWebFormV3/scripts/jquery-ui-1.8.17.custom.min.js', array('jquery') );

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

        }

        if ( function_exists( 'register_widget' ) ) {
          register_widget('\UsabilityDynamics\RDC\RDCScheduleShowing');
          register_widget('\UsabilityDynamics\RDC\RDCProspectLandlordForm');
          register_widget('\UsabilityDynamics\RDC\RDCContactForm');
          register_widget('\UsabilityDynamics\RDC\RDCFeedbackForm');
          register_widget('\UsabilityDynamics\RDC\RDCReferralProgramForm');
          register_widget('\UsabilityDynamics\RDC\RDCApplicationRequestForm');
          register_widget('\UsabilityDynamics\RDC\RDCJobRequestForm');
          register_widget('\UsabilityDynamics\RDC\Guide_content_Widget');
          register_widget('\UsabilityDynamics\RDC\RDC_Callout_Widget');
          register_widget('\UsabilityDynamics\RDC\RDC_Masthead_Widget');
          register_widget('\UsabilityDynamics\RDC\RDCHomeBuyingForm');
        }
      }
    }
  }
}