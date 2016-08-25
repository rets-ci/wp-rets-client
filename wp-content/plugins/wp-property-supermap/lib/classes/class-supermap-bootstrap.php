<?php
/**
 * Bootstrap
 *
 * @since 4.0.0
 */
namespace UsabilityDynamics\WPP {

  if( !class_exists( 'UsabilityDynamics\WPP\Supermap_Bootstrap' ) ) {

    final class Supermap_Bootstrap extends \UsabilityDynamics\WP\Bootstrap_Plugin {

      /**
       * Singleton Instance Reference.
       *
       * @protected
       * @static
       * @property $instance
       * @type UsabilityDynamics\WPP\Supermap_Bootstrap object
       */
      protected static $instance = null;

      /**
       * Instantaite class.
       */
      public function init() {
        require_once( dirname( __DIR__ ) . '/class-wpp-supermap.php' );
        add_action( 'wpp_init', array( 'class_wpp_supermap', 'pre_init' ), 0 );
        add_action( 'wpp_init', array( 'class_wpp_supermap', 'init' ), 10 );

        /**
         * May be load Shortcodes
         */
        add_action( 'init', function () {
          ud_get_wpp_supermap()->load_files( ud_get_wpp_supermap()->path( 'lib/shortcodes', 'dir' ) );
        }, 999 );

        add_action( 'wp_enqueue_scripts', function () {

          wp_register_script( 'angularjs', ud_get_wpp_supermap()->path( 'bower_components/angular/angular.min.js' ), array(), false, true );
          wp_register_script( 'angular-sanitize', ud_get_wpp_supermap()->path( 'bower_components/angular/angular-sanitize.min.js' ), array( 'angularjs' ), false, true );
          wp_register_script( 'ng-map', ud_get_wpp_supermap()->path( 'bower_components/ngmap/build/scripts/ng-map.min.js' ), array( 'google-maps', 'angularjs' ) );
          wp_register_script( 'ng-smart-table', ud_get_wpp_supermap()->path( 'bower_components/angular-smart-table/dist/smart-table.min.js' ), array( 'angularjs' ) );
          wp_register_script( 'gm-markerclusterer', ud_get_wpp_supermap()->path( 'bower_components/js-marker-clusterer/src/markerclusterer.js' ), array( 'ng-map' ) );
          wp_register_script( 'gm-infobubble', ud_get_wpp_supermap()->path( 'bower_components/js-info-bubble/src/infobubble-compiled.js' ), array( 'ng-map' ) );
          wp_register_script( 'ng-elasticsearch', ud_get_wpp_supermap()->path( 'bower_components/elasticsearch/elasticsearch.jquery.js' ), array( 'angularjs' ) );
          wp_register_script( 'async', ud_get_wpp_supermap()->path( 'bower_components/async/dist/async.js' ), array( 'angularjs' ) );
          wp_register_script( 'markerwithlabel', ud_get_wpp_supermap()->path( 'static/scripts/advanced/markerwithlabel.js' ), array( 'ng-map' ) );
          wp_register_script( 'supermap-advanced', ud_get_wpp_supermap()->path( 'static/scripts/advanced/supermap-alpha-v0.5.js' ), array( 'async', 'angularjs', 'gm-markerclusterer', 'gm-infobubble', 'ng-map', 'ng-smart-table' ), '0.5', true );

          // This can be our generic SuperMap client-side facing settings object.
          wp_localize_script( 'supermap-advanced', 'supermapMode', array(
            "isMobile" => ( isset( $_SERVER[ 'HTTP_X_USER_DEVICE' ] ) && $_SERVER[ 'HTTP_X_USER_DEVICE' ] == 'mobile' ) ? true : false,
            "aggregationFields" => array(
              'elementary_school' => array(
                  'icons' => array(
                      'main' => 'school-elementary-solid',
                      'outline' => 'school-elementary-outline',
                    ),
                  'slug' => 'elementary_school',
                  'title' => 'Elementary School',
                  'field' => 'tax_input.elementary_school',
                  'search_field' => '_search.elementary_school',
                ),
              'middle_school' => array(
                  'icons' => array(
                      'main' => 'school-middle-solid',
                      'outline' => 'school-middle-outline',
                    ),
                  'slug' => 'middle_school',
                  'title' => 'Middle School',
                  'field' => 'tax_input.middle_school',
                  'search_field' => '_search.middle_school',
                ),
              'high_school' => array(
                  'icons' => array(
                      'main' => 'school-high-solid',
                      'outline' => 'school-high-outline',
                    ),
                  'slug' => 'high_school',
                  'title' => 'High School',
                  'field' => 'tax_input.high_school',
                  'search_field' => '_search.high_school',
                ),
              'location_city' => array(
                  'icons' => array(
                      'main' => 'school-elementary-solid',
                      'outline' => 'school-elementary-outline',
                    ),
                  'slug' => 'city',
                  'title' => 'City',
                  'field' => 'tax_input.location_city',
                  'search_field' => '_search.location_city',
                ),
              'location_zip' => array(
                  'icons' => array(
                      'main' => 'school-elementary-solid',
                      'outline' => 'school-elementary-outline',
                    ),
                  'slug' => 'zip',
                  'title' => 'Zip',
                  'field' => '_system.addressDetail.zipcode',
                  'search_field' => '_search.location_zip',
                ),
              'location_county' => array(
                  'icons' => array(
                      'main' => 'school-elementary-solid',
                      'outline' => 'school-elementary-outline',
                    ),
                  'slug' => 'county',
                  'title' => 'County',
                  'field' => 'tax_input.location_county',
                  'search_field' => '_search.location_county',
                ),
            )
          ) );

        }, 5 );

        /**
         * May be load Widgets
         */
        add_action( 'widgets_init', function () {
          ud_get_wpp_supermap()->load_files( ud_get_wpp_supermap()->path( 'lib/widgets', 'dir' ) );
        }, 1 );

      }

      /**
       * Includes all PHP files from specific folder
       *
       * @param string $dir Directory's path
       * @author peshkov@UD
       */
      public function load_files( $dir = '' ) {
        $dir = trailingslashit( $dir );
        if( !empty( $dir ) && is_dir( $dir ) ) {
          if( $dh = opendir( $dir ) ) {
            while( ( $file = readdir( $dh ) ) !== false ) {
              if( !in_array( $file, array( '.', '..' ) ) && is_file( $dir . $file ) && 'php' == pathinfo( $dir . $file, PATHINFO_EXTENSION ) ) {
                include_once( $dir . $file );
              }
            }
            closedir( $dh );
          }
        }
      }

      /**
       * Plugin Activation
       *
       */
      public function activate() {
        //** flush Object Cache */
        wp_cache_flush();
        //** set transient to flush WP-Property cache */
        set_transient( 'wpp_cache_flush', time() );
      }

      /**
       * Plugin Deactivation
       *
       */
      public function deactivate() {
        //** flush Object Cache */
        wp_cache_flush();
      }

      /**
       * Determine if Utility class contains missed function
       * in other case, just return NULL to prevent ERRORS
       *
       * @author peshkov@UD
       * @param $name
       * @param $arguments
       * @return mixed|null
       */
      public function __call( $name, $arguments ) {
        if( is_callable( array( "\\UsabilityDynamics\\WPP\\Supermap_Utility", $name ) ) ) {
          return call_user_func_array( array( "\\UsabilityDynamics\\WPP\\Supermap_Utility", $name ), $arguments );
        } else {
          return NULL;
        }
      }

    }

  }

}
