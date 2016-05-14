<?php
/**
 * WP-AMD Plugin.
 *
 */
namespace UsabilityDynamics\AMD {

  use UsabilityDynamics\Settings;

  if( !class_exists( 'UsabilityDynamics\AMD\Bootstrap' ) ) {

    class Bootstrap {

      /**
       * Cluster core version.
       *
       * @static
       * @property $version
       * @type {Object}
       */
      public $version = false;

      /**
       * Textdomain String
       *
       * @public
       * @property domain
       * @var string
       */
      public $domain = false;

      /**
       * Singleton Instance Reference.
       *
       * @public
       * @static
       * @property $instance
       * @type {Object}
       */
      public static $instance = null;

      public $option = array();

      /**
       * Instantaite class.
       */
      private function __construct() {
        
        $plugin_data = get_file_data( ( dirname( __DIR__ ) . '/wp-amd.php' ), array(
          'Name' => 'Plugin Name',
          'Version' => 'Version',
          'TextDomain' => 'Text Domain',
        ), 'plugin' );
        
        $this->version  = trim( $plugin_data[ 'Version' ] );
        $this->domain   = trim( $plugin_data[ 'TextDomain' ] );

        // Initialize Settings.
        $this->settings = new Settings( array(
          'key'  => 'wp_amd',
          'data' => array(
            'version' => $this->version,
            'domain' => $this->domain,
            'assets' => array(
              'script' => array(
                'type'          => 'script',
                'disk_cache'    => apply_filters( 'wp-amd:script:disk_cache', false, $this ),
                'extension'     => 'js',
                'minify'        => false,
                'admin_menu'    => true,
                'load_in_head'  => false,
                'permalink'     => apply_filters( 'wp-amd:script:path', 'assets/wp-amd.js', $this ),
                'dependencies'  => apply_filters( 'wp-amd:script:dependencies', array(
                  'jquery'  => array(
                    'id'            => 'jquery',
                    'name'          => 'jQuery',
                    'infourl'       => 'http://jquery.com',
                    'version'       => '2.1.0',
                    'url'           => '//ajax.aspnetcdn.com/ajax/jquery/jquery-2.1.0.min.js',
                  ),
                  'backbone'  => array(
                    'id'            => 'backbone',
                    'name'          => 'Backbone.js',
                    'infourl'       => 'http://backbonejs.com',
                    'url'           => 'http://backbonejs.org/backbone-min.js',
                  ),
                  'lodash' => array(
                    'id'            => 'lodash',
                    'name'          => 'Lodash',
                    'infourl'       => 'http://lodash.com',
                    'version'       => '2.4.1',
                    'url'           => 'http://cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.js',
                  ),
                  'knockout' => array(
                    'id'            => 'knockout',
                    'name'          => 'Knockout.js',
                    'version'       => '2.2.1',
                    'infourl'       => 'http://knockoutjs.com',
                    'url'           => 'http://ajax.aspnetcdn.com/ajax/knockout/knockout-2.2.1.js',
                  ),
                  'udx-requires' => array(
                    'id'            => 'udx-requires',
                    'name'          => 'Requires.js (UDX)',
                    'infourl'       => 'http://cdn.udx.io',
                    'version'       => '4.0.0',
                    'url'           => '//cdn.udx.io/udx.requires.js',
                  ),
                  'twitter-bootstrap' => array(
                    'id'            => 'twitter-bootstrap',
                    'name'          => 'Twitter Bootstrap',
                    'infourl'       => 'http://getbootstrap.com/',
                    'version'       => '3.1.1',
                    'url'           => '//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js'
                  ),
                  'google-analytics' => array(
                    'id'            => 'google-analytics',
                    'name'          => 'Google Analytics',
                    'infourl'       => 'http://google-analytics.com/',
                    'version'       => '3.1.1',
                    'url'           => '//www.google-analytics.com/urchin.js'
                  )
                ), $this ),
              ),
              'style'  => array(
                'type'          => 'style',
                'minify'        => false,
                'disk_cache'    => apply_filters( 'wp-amd:script:disk_cache', false, $this ),
                'permalink'     => apply_filters( 'wp-amd:style:path', 'assets/wp-amd.css', $this ),
                'extension'     => 'css',
                'admin_menu'    => true,
                'load_in_head'  => true,
                'dependencies'  => apply_filters( 'wp-amd:style:dependencies', array(
                  'twitter-bootstrap' => array(
                    'id'            => 'twitter-bootstrap',
                    'name'          => 'Twitter Bootstrap',
                    'version'       => '3.1.1',
                    'infourl'       => 'http://getbootstrap.com/',
                    'url'           => '//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css'
                  ),
                  'normalize' => array(
                    'id'            => 'normalize',
                    'name'          => 'Normalize',
                    'version'       => '3.0.1',
                    'infourl'       => 'http://getbootstrap.com/',
                    'url'           => '//cdnjs.cloudflare.com/ajax/libs/normalize/3.0.1/normalize.min.css'
                  ),
                  'fontawesome' => array(
                    'id'            => 'fontawesome',
                    'name'          => 'Font Awesome',
                    'infourl'       => 'http://fontawesome.io/',
                    'url'           => '//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.0.3/css/font-awesome.min.css'
                  ),
                ), $this ),
              )
            )
          )
        ));

        // Set Dynamics.
        $this->set( 'version',  $this->version );
        $this->set( 'locale',   $this->domain );

        // Initialize Style and Script classes.
        $this->style    = new Style( $this->get( 'assets.style' ), $this );
        $this->script   = new Script( $this->get( 'assets.script' ), $this );

        // AJAX Update Handler.
        add_action( 'wp_ajax_/amd/v1/asset', array( $this, 'ajax_handler' ) );

        // Handle dynamic URL identification for plugin assets.
        add_filter( 'includes_url', array( $this, 'includes_url' ), 20, 2 );
        add_filter( 'plugins_url', array( $this, 'plugins_url' ), 20, 2 );

      }

      /**
       * Modify includes_url() to find valid location for AMD includes assets.
       *
       * @since 1.1.1
       * @author potanin@UD

       * @param string $url
       * @param string $path
       *
       * @return string
       */
      public function plugins_url( $url = '', $path = '' ) {

        return $url;

      }

      /**
       * Modify includes_url() to find valid location for AMD includes assets.
       *
       * @since 1.1.1
       * @author potanin@UD
       * @param string $url
       * @param string $path
       *
       * @return string
       */
      public function includes_url( $url = '', $path = '' ) {



        return $url;

      }

      /**
       * Handle Administrative AJAX Actions
       *
       * @author potanin@UD
       * @method ajax_handler
       */
      public function ajax_handler() {

        $_data = $_POST[ 'data' ];
        $_type = $_POST[ 'type' ];
        $_dependency = isset( $_POST[ 'dependency' ] ) ? $_POST[ 'dependency' ] : array();
        if( !is_array( $_dependency ) ) {
          $_dependency = array();
        }

        if( !$_type || !method_exists( $this->{$_type}, 'save_asset' ) ) {

          wp_send_json(array(
            'ok' => false,
            'message' => __( 'Unexpected error occured.', $this->get( 'locale' ) )
          ));

        }

        if( !is_wp_error( $_revision = $this->{$_type}->save_asset( $_data ) ) ) {

          update_post_meta( $_revision, 'dependency', $_dependency );

          wp_send_json(array(
            'ok' => false,
            'revision' => $_revision,
            'dependency' => $_dependency,
            'message' => __( 'Asset saved successfully.', $this->get( 'locale' ) )
          ));

        }

        wp_send_json(array(
          'ok' => false,
          'message' => __( 'Unable to save asset.', $this->get( 'locale' ) )
        ));

      }

      /**
       * Determine if instance already exists and Return Theme Instance
       *
       */
      public static function get_instance( $args = array() ) {
        return null === self::$instance ? self::$instance = new self() : self::$instance;
      }

      /**
       * @param null $key
       * @param null $value
       *
       * @return \UsabilityDynamics\Settings
       */
      public function set( $key = null, $value = null ) {
        return $this->settings->set( $key, $value );
      }

      /**
       * @param null $key
       * @param null $default
       *
       * @return \UsabilityDynamics\type
       */
      public function get( $key = null, $default = null ) {
        return $this->settings->get( $key, $default );
      }

    }

  }

}
